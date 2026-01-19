import { z } from 'zod';
import { ComponentNodeSchema } from './component.js';

/**
 * Screen definition in the app.
 */
export const ScreenSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string().optional(), // Deep link path
  content: ComponentNodeSchema,
});

export type Screen = z.infer<typeof ScreenSchema>;

/**
 * Data model definition.
 */
export const DataModelSchema = z.object({
  name: z.string(),
  properties: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['string', 'int', 'double', 'bool', 'date', 'array', 'optional']),
      isOptional: z.boolean().default(false),
      defaultValue: z.unknown().optional(),
    })
  ),
  isPersisted: z.boolean().default(false), // SwiftData
});

export type DataModel = z.infer<typeof DataModelSchema>;

/**
 * App color scheme.
 */
export const ColorSchemeSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  surface: z.string(),
  text: z.string(),
  textSecondary: z.string(),
});

export type ColorScheme = z.infer<typeof ColorSchemeSchema>;

/**
 * App configuration.
 */
export const AppConfigSchema = z.object({
  // Identity
  name: z.string(),
  bundleId: z.string(),
  displayName: z.string(),
  version: z.string().default('1.0.0'),
  buildNumber: z.string().default('1'),

  // Platform
  minIOSVersion: z.string().default('17.0'),
  supportedDevices: z.array(z.enum(['iphone', 'ipad'])).default(['iphone']),

  // Appearance
  accentColor: z.string().default('#007AFF'),
  colorScheme: ColorSchemeSchema.optional(),
  supportsLightMode: z.boolean().default(true),
  supportsDarkMode: z.boolean().default(true),

  // Features
  usesSwiftData: z.boolean().default(false),
  usesCloudKit: z.boolean().default(false),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

/**
 * Complete app definition.
 * This is the top-level structure that represents an entire app.
 */
export const AppDefinitionSchema = z.object({
  config: AppConfigSchema,
  screens: z.array(ScreenSchema),
  models: z.array(DataModelSchema).optional(),
  entryScreen: z.string(), // Screen ID
  tabBar: z
    .object({
      tabs: z.array(
        z.object({
          screen: z.string(), // Screen ID
          title: z.string(),
          icon: z.string(), // SF Symbol
        })
      ),
    })
    .optional(),
});

export type AppDefinition = z.infer<typeof AppDefinitionSchema>;
