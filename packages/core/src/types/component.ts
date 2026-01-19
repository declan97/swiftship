import { z } from 'zod';

/**
 * Base schema for all components.
 * Every component in the SwiftShip system extends this.
 */
export const BaseComponentSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  children: z.array(z.lazy(() => ComponentNodeSchema)).optional(),
});

/**
 * Actions that can be triggered by user interactions.
 */
export const ActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('navigate'),
    destination: z.string(), // Screen ID
  }),
  z.object({
    type: z.literal('sheet'),
    content: z.string(), // Screen ID
  }),
  z.object({
    type: z.literal('dismiss'),
  }),
  z.object({
    type: z.literal('custom'),
    name: z.string(),
    parameters: z.record(z.unknown()).optional(),
  }),
]);

export type Action = z.infer<typeof ActionSchema>;

/**
 * Data binding configuration.
 * Connects component props to data sources.
 */
export const DataBindingSchema = z.object({
  property: z.string(), // The prop to bind
  source: z.enum(['state', 'environment', 'parameter']),
  path: z.string(), // Dot-notation path to data
});

export type DataBinding = z.infer<typeof DataBindingSchema>;

/**
 * Modifier applied to a component.
 * Maps to SwiftUI view modifiers.
 */
export const ModifierSchema = z.object({
  name: z.string(),
  arguments: z.array(z.unknown()).optional(),
});

export type Modifier = z.infer<typeof ModifierSchema>;

/**
 * A node in the component tree.
 * This is the core data structure for representing apps.
 */
export const ComponentNodeSchema: z.ZodType<ComponentNode, z.ZodTypeDef, unknown> = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.unknown()).default({}),
  children: z.array(z.lazy(() => ComponentNodeSchema)).optional(),
  bindings: z.array(DataBindingSchema).optional(),
  modifiers: z.array(ModifierSchema).optional(),
}) as z.ZodType<ComponentNode, z.ZodTypeDef, unknown>;

export interface ComponentNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: ComponentNode[];
  bindings?: DataBinding[];
  modifiers?: Modifier[];
}

/**
 * Component category for organization.
 */
export type ComponentCategory =
  | 'primitives'
  | 'layout'
  | 'navigation'
  | 'input'
  | 'data-display'
  | 'feedback'
  | 'patterns';

/**
 * Metadata about a component for the editor catalog.
 */
export interface ComponentMeta {
  name: string;
  type: string;
  description: string;
  category: ComponentCategory;
  icon: string; // SF Symbol name
  defaultProps: Record<string, unknown>;
  propsSchema: z.ZodType<unknown>;
}
