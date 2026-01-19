import { z } from 'zod';
import type { ComponentMeta } from '@swiftship/core';

// ============================================================================
// Text
// ============================================================================

export const TextPropsSchema = z.object({
  content: z.string(),
  font: z
    .enum(['largeTitle', 'title', 'title2', 'title3', 'headline', 'body', 'callout', 'subheadline', 'footnote', 'caption', 'caption2'])
    .default('body'),
  weight: z.enum(['ultraLight', 'thin', 'light', 'regular', 'medium', 'semibold', 'bold', 'heavy', 'black']).optional(),
  color: z.string().optional(), // Hex or semantic color name
  alignment: z.enum(['leading', 'center', 'trailing']).optional(),
  lineLimit: z.number().int().positive().optional(),
});

export type TextProps = z.infer<typeof TextPropsSchema>;

export const TextMeta: ComponentMeta = {
  name: 'Text',
  type: 'text',
  description: 'Displays one or more lines of text',
  category: 'primitives',
  icon: 'textformat',
  defaultProps: { content: 'Hello, World!', font: 'body' },
  propsSchema: TextPropsSchema,
};

// ============================================================================
// Button
// ============================================================================

export const ButtonPropsSchema = z.object({
  label: z.string(),
  style: z.enum(['bordered', 'borderedProminent', 'borderless', 'plain']).default('borderedProminent'),
  role: z.enum(['none', 'cancel', 'destructive']).default('none'),
  icon: z.string().optional(), // SF Symbol name
  iconPosition: z.enum(['leading', 'trailing']).default('leading'),
  isDisabled: z.boolean().default(false),
  isLoading: z.boolean().default(false),
});

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

export const ButtonMeta: ComponentMeta = {
  name: 'Button',
  type: 'button',
  description: 'A tappable control that performs an action',
  category: 'primitives',
  icon: 'hand.tap',
  defaultProps: { label: 'Button', style: 'borderedProminent', role: 'none' },
  propsSchema: ButtonPropsSchema,
};

// ============================================================================
// Image
// ============================================================================

export const ImagePropsSchema = z.object({
  source: z.discriminatedUnion('type', [
    z.object({ type: z.literal('system'), name: z.string() }), // SF Symbol
    z.object({ type: z.literal('asset'), name: z.string() }), // Asset catalog
    z.object({ type: z.literal('url'), url: z.string().url() }), // Remote URL
  ]),
  contentMode: z.enum(['fit', 'fill']).default('fit'),
  cornerRadius: z.number().default(0),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type ImageProps = z.infer<typeof ImagePropsSchema>;

export const ImageMeta: ComponentMeta = {
  name: 'Image',
  type: 'image',
  description: 'Displays an image from various sources',
  category: 'primitives',
  icon: 'photo',
  defaultProps: { source: { type: 'system', name: 'photo' }, contentMode: 'fit' },
  propsSchema: ImagePropsSchema,
};

// ============================================================================
// Icon (SF Symbol)
// ============================================================================

export const IconPropsSchema = z.object({
  name: z.string(), // SF Symbol name
  size: z.enum(['small', 'medium', 'large', 'extraLarge']).default('medium'),
  weight: z.enum(['ultraLight', 'thin', 'light', 'regular', 'medium', 'semibold', 'bold', 'heavy', 'black']).default('regular'),
  color: z.string().optional(),
  renderingMode: z.enum(['monochrome', 'hierarchical', 'palette', 'multicolor']).default('monochrome'),
});

export type IconProps = z.infer<typeof IconPropsSchema>;

export const IconMeta: ComponentMeta = {
  name: 'Icon',
  type: 'icon',
  description: 'Displays an SF Symbol icon',
  category: 'primitives',
  icon: 'star',
  defaultProps: { name: 'star', size: 'medium', weight: 'regular' },
  propsSchema: IconPropsSchema,
};

// ============================================================================
// Spacer
// ============================================================================

export const SpacerPropsSchema = z.object({
  minLength: z.number().optional(),
});

export type SpacerProps = z.infer<typeof SpacerPropsSchema>;

export const SpacerMeta: ComponentMeta = {
  name: 'Spacer',
  type: 'spacer',
  description: 'A flexible space that expands along the major axis',
  category: 'primitives',
  icon: 'arrow.left.and.right',
  defaultProps: {},
  propsSchema: SpacerPropsSchema,
};

// ============================================================================
// Divider
// ============================================================================

export const DividerPropsSchema = z.object({});

export type DividerProps = z.infer<typeof DividerPropsSchema>;

export const DividerMeta: ComponentMeta = {
  name: 'Divider',
  type: 'divider',
  description: 'A visual separator between content',
  category: 'primitives',
  icon: 'minus',
  defaultProps: {},
  propsSchema: DividerPropsSchema,
};
