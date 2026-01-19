/**
 * @swiftship/components
 *
 * iOS component library with schemas, metadata, and type definitions.
 * This package defines all components that can be used in SwiftShip apps.
 */

// Primitives
export * from './schemas/primitives.js';

// Layout
export * from './schemas/layout.js';

// Input
export * from './schemas/input.js';

// Navigation
export * from './schemas/navigation.js';

// Re-export all component metadata for catalog
import { TextMeta, ButtonMeta, ImageMeta, IconMeta, SpacerMeta, DividerMeta } from './schemas/primitives.js';
import { VStackMeta, HStackMeta, ZStackMeta, ScrollViewMeta, ListMeta, GridMeta, SectionMeta } from './schemas/layout.js';
import { TextFieldMeta, SecureFieldMeta, TextEditorMeta, ToggleMeta, PickerMeta, DatePickerMeta, SliderMeta, StepperMeta } from './schemas/input.js';
import { NavigationStackMeta, NavigationLinkMeta, TabViewMeta, SheetMeta, FullScreenCoverMeta, AlertMeta, ConfirmationDialogMeta, MenuMeta, ToolbarMeta } from './schemas/navigation.js';

import type { ComponentMeta } from '@swiftship/core';

/**
 * Complete catalog of all available components.
 * Used by the editor UI and AI prompts.
 */
export const COMPONENT_CATALOG: ComponentMeta[] = [
  // Primitives
  TextMeta,
  ButtonMeta,
  ImageMeta,
  IconMeta,
  SpacerMeta,
  DividerMeta,

  // Layout
  VStackMeta,
  HStackMeta,
  ZStackMeta,
  ScrollViewMeta,
  ListMeta,
  GridMeta,
  SectionMeta,

  // Input
  TextFieldMeta,
  SecureFieldMeta,
  TextEditorMeta,
  ToggleMeta,
  PickerMeta,
  DatePickerMeta,
  SliderMeta,
  StepperMeta,

  // Navigation
  NavigationStackMeta,
  NavigationLinkMeta,
  TabViewMeta,
  SheetMeta,
  FullScreenCoverMeta,
  AlertMeta,
  ConfirmationDialogMeta,
  MenuMeta,
  ToolbarMeta,
];

/**
 * Get component metadata by type.
 */
export function getComponentMeta(type: string): ComponentMeta | undefined {
  return COMPONENT_CATALOG.find((c) => c.type === type);
}

/**
 * Get all components in a category.
 */
export function getComponentsByCategory(category: ComponentMeta['category']): ComponentMeta[] {
  return COMPONENT_CATALOG.filter((c) => c.category === category);
}
