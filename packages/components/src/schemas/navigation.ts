import { z } from 'zod';
import type { ComponentMeta } from '@swiftship/core';

// ============================================================================
// NavigationStack
// ============================================================================

export const NavigationStackPropsSchema = z.object({
  title: z.string().optional(),
  titleDisplayMode: z.enum(['automatic', 'inline', 'large']).default('automatic'),
});

export type NavigationStackProps = z.infer<typeof NavigationStackPropsSchema>;

export const NavigationStackMeta: ComponentMeta = {
  name: 'NavigationStack',
  type: 'navigationstack',
  description: 'A container for navigation with a title bar',
  category: 'navigation',
  icon: 'arrow.right.square',
  defaultProps: { titleDisplayMode: 'automatic' },
  propsSchema: NavigationStackPropsSchema,
};

// ============================================================================
// NavigationLink
// ============================================================================

export const NavigationLinkPropsSchema = z.object({
  destination: z.string(), // Screen ID to navigate to
});

export type NavigationLinkProps = z.infer<typeof NavigationLinkPropsSchema>;

export const NavigationLinkMeta: ComponentMeta = {
  name: 'NavigationLink',
  type: 'navigationlink',
  description: 'A link that pushes a new view onto the navigation stack',
  category: 'navigation',
  icon: 'arrow.right',
  defaultProps: { destination: '' },
  propsSchema: NavigationLinkPropsSchema,
};

// ============================================================================
// TabView
// ============================================================================

export const TabItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(), // SF Symbol
  badgeCount: z.number().optional(),
});

export const TabViewPropsSchema = z.object({
  tabs: z.array(TabItemSchema),
  style: z.enum(['automatic', 'tabBarOnly', 'sidebarAdaptable']).default('automatic'),
});

export type TabViewProps = z.infer<typeof TabViewPropsSchema>;

export const TabViewMeta: ComponentMeta = {
  name: 'TabView',
  type: 'tabview',
  description: 'A container with a tab bar for switching between views',
  category: 'navigation',
  icon: 'square.fill.on.square.fill',
  defaultProps: { tabs: [], style: 'automatic' },
  propsSchema: TabViewPropsSchema,
};

// ============================================================================
// Sheet
// ============================================================================

export const SheetPropsSchema = z.object({
  detents: z.array(z.enum(['medium', 'large'])).default(['large']),
  showsDragIndicator: z.boolean().default(true),
  isInteractiveDismissDisabled: z.boolean().default(false),
});

export type SheetProps = z.infer<typeof SheetPropsSchema>;

export const SheetMeta: ComponentMeta = {
  name: 'Sheet',
  type: 'sheet',
  description: 'A modal sheet that slides up from the bottom',
  category: 'navigation',
  icon: 'rectangle.bottomhalf.inset.filled',
  defaultProps: { detents: ['large'], showsDragIndicator: true },
  propsSchema: SheetPropsSchema,
};

// ============================================================================
// FullScreenCover
// ============================================================================

export const FullScreenCoverPropsSchema = z.object({
  isInteractiveDismissDisabled: z.boolean().default(false),
});

export type FullScreenCoverProps = z.infer<typeof FullScreenCoverPropsSchema>;

export const FullScreenCoverMeta: ComponentMeta = {
  name: 'FullScreenCover',
  type: 'fullscreencover',
  description: 'A full-screen modal presentation',
  category: 'navigation',
  icon: 'rectangle.fill',
  defaultProps: {},
  propsSchema: FullScreenCoverPropsSchema,
};

// ============================================================================
// Alert
// ============================================================================

export const AlertActionSchema = z.object({
  label: z.string(),
  role: z.enum(['default', 'cancel', 'destructive']).default('default'),
});

export const AlertPropsSchema = z.object({
  title: z.string(),
  message: z.string().optional(),
  actions: z.array(AlertActionSchema),
});

export type AlertProps = z.infer<typeof AlertPropsSchema>;

export const AlertMeta: ComponentMeta = {
  name: 'Alert',
  type: 'alert',
  description: 'A modal alert dialog',
  category: 'navigation',
  icon: 'exclamationmark.triangle',
  defaultProps: { title: 'Alert', actions: [{ label: 'OK', role: 'default' }] },
  propsSchema: AlertPropsSchema,
};

// ============================================================================
// ConfirmationDialog
// ============================================================================

export const ConfirmationDialogPropsSchema = z.object({
  title: z.string(),
  titleVisibility: z.enum(['automatic', 'visible', 'hidden']).default('automatic'),
  actions: z.array(AlertActionSchema),
});

export type ConfirmationDialogProps = z.infer<typeof ConfirmationDialogPropsSchema>;

export const ConfirmationDialogMeta: ComponentMeta = {
  name: 'ConfirmationDialog',
  type: 'confirmationdialog',
  description: 'An action sheet with multiple options',
  category: 'navigation',
  icon: 'questionmark.circle',
  defaultProps: { title: 'Confirm', actions: [] },
  propsSchema: ConfirmationDialogPropsSchema,
};

// ============================================================================
// Menu
// ============================================================================

export const MenuItemSchema = z.object({
  label: z.string(),
  icon: z.string().optional(),
  role: z.enum(['default', 'destructive']).default('default'),
});

export const MenuPropsSchema = z.object({
  items: z.array(MenuItemSchema),
});

export type MenuProps = z.infer<typeof MenuPropsSchema>;

export const MenuMeta: ComponentMeta = {
  name: 'Menu',
  type: 'menu',
  description: 'A contextual menu of actions',
  category: 'navigation',
  icon: 'ellipsis.circle',
  defaultProps: { items: [] },
  propsSchema: MenuPropsSchema,
};

// ============================================================================
// Toolbar
// ============================================================================

export const ToolbarItemSchema = z.object({
  placement: z.enum(['automatic', 'primaryAction', 'confirmationAction', 'cancellationAction', 'destructiveAction', 'navigation', 'topBarLeading', 'topBarTrailing', 'bottomBar']),
});

export const ToolbarPropsSchema = z.object({
  items: z.array(ToolbarItemSchema),
});

export type ToolbarProps = z.infer<typeof ToolbarPropsSchema>;

export const ToolbarMeta: ComponentMeta = {
  name: 'Toolbar',
  type: 'toolbar',
  description: 'A container for navigation bar items',
  category: 'navigation',
  icon: 'menubar.rectangle',
  defaultProps: { items: [] },
  propsSchema: ToolbarPropsSchema,
};
