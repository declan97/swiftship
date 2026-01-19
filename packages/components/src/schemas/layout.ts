import { z } from 'zod';
import type { ComponentMeta } from '@swiftship/core';

// ============================================================================
// VStack (Vertical Stack)
// ============================================================================

export const VStackPropsSchema = z.object({
  alignment: z.enum(['leading', 'center', 'trailing']).default('center'),
  spacing: z.number().default(8),
});

export type VStackProps = z.infer<typeof VStackPropsSchema>;

export const VStackMeta: ComponentMeta = {
  name: 'VStack',
  type: 'vstack',
  description: 'A vertical stack of views',
  category: 'layout',
  icon: 'rectangle.split.1x2',
  defaultProps: { alignment: 'center', spacing: 8 },
  propsSchema: VStackPropsSchema,
};

// ============================================================================
// HStack (Horizontal Stack)
// ============================================================================

export const HStackPropsSchema = z.object({
  alignment: z.enum(['top', 'center', 'bottom', 'firstTextBaseline', 'lastTextBaseline']).default('center'),
  spacing: z.number().default(8),
});

export type HStackProps = z.infer<typeof HStackPropsSchema>;

export const HStackMeta: ComponentMeta = {
  name: 'HStack',
  type: 'hstack',
  description: 'A horizontal stack of views',
  category: 'layout',
  icon: 'rectangle.split.2x1',
  defaultProps: { alignment: 'center', spacing: 8 },
  propsSchema: HStackPropsSchema,
};

// ============================================================================
// ZStack (Overlay Stack)
// ============================================================================

export const ZStackPropsSchema = z.object({
  alignment: z.enum(['topLeading', 'top', 'topTrailing', 'leading', 'center', 'trailing', 'bottomLeading', 'bottom', 'bottomTrailing']).default('center'),
});

export type ZStackProps = z.infer<typeof ZStackPropsSchema>;

export const ZStackMeta: ComponentMeta = {
  name: 'ZStack',
  type: 'zstack',
  description: 'Overlays its children on top of each other',
  category: 'layout',
  icon: 'square.stack',
  defaultProps: { alignment: 'center' },
  propsSchema: ZStackPropsSchema,
};

// ============================================================================
// ScrollView
// ============================================================================

export const ScrollViewPropsSchema = z.object({
  axes: z.enum(['vertical', 'horizontal', 'both']).default('vertical'),
  showsIndicators: z.boolean().default(true),
});

export type ScrollViewProps = z.infer<typeof ScrollViewPropsSchema>;

export const ScrollViewMeta: ComponentMeta = {
  name: 'ScrollView',
  type: 'scrollview',
  description: 'A scrollable container',
  category: 'layout',
  icon: 'scroll',
  defaultProps: { axes: 'vertical', showsIndicators: true },
  propsSchema: ScrollViewPropsSchema,
};

// ============================================================================
// List
// ============================================================================

export const ListPropsSchema = z.object({
  style: z.enum(['automatic', 'plain', 'grouped', 'insetGrouped', 'sidebar']).default('automatic'),
  showsRowSeparators: z.boolean().default(true),
});

export type ListProps = z.infer<typeof ListPropsSchema>;

export const ListMeta: ComponentMeta = {
  name: 'List',
  type: 'list',
  description: 'A scrollable list of data',
  category: 'layout',
  icon: 'list.bullet',
  defaultProps: { style: 'automatic', showsRowSeparators: true },
  propsSchema: ListPropsSchema,
};

// ============================================================================
// Grid (LazyVGrid)
// ============================================================================

export const GridPropsSchema = z.object({
  columns: z.number().int().positive().default(2),
  spacing: z.number().default(8),
  columnSpacing: z.number().optional(),
  rowSpacing: z.number().optional(),
});

export type GridProps = z.infer<typeof GridPropsSchema>;

export const GridMeta: ComponentMeta = {
  name: 'Grid',
  type: 'grid',
  description: 'A grid layout with flexible columns',
  category: 'layout',
  icon: 'square.grid.2x2',
  defaultProps: { columns: 2, spacing: 8 },
  propsSchema: GridPropsSchema,
};

// ============================================================================
// Section
// ============================================================================

export const SectionPropsSchema = z.object({
  header: z.string().optional(),
  footer: z.string().optional(),
});

export type SectionProps = z.infer<typeof SectionPropsSchema>;

export const SectionMeta: ComponentMeta = {
  name: 'Section',
  type: 'section',
  description: 'A group of list items with optional header/footer',
  category: 'layout',
  icon: 'rectangle.split.1x2',
  defaultProps: {},
  propsSchema: SectionPropsSchema,
};
