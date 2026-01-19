/**
 * Spacing system based on 4px grid.
 * Creates consistent spacing, radii, and shadow tokens.
 */

import type {
  SpacingTokens,
  ShadowTokens,
  MotionTokens,
  OklchColor,
} from '@swiftship/core';

/**
 * Generate spacing tokens based on a base unit
 */
export function generateSpacingTokens(baseUnit: number = 4): SpacingTokens {
  return {
    baseUnit,
    scale: {
      '0': 0,
      '0.5': baseUnit * 0.5,   // 2px
      '1': baseUnit * 1,        // 4px
      '1.5': baseUnit * 1.5,    // 6px
      '2': baseUnit * 2,        // 8px
      '2.5': baseUnit * 2.5,    // 10px
      '3': baseUnit * 3,        // 12px
      '4': baseUnit * 4,        // 16px
      '5': baseUnit * 5,        // 20px
      '6': baseUnit * 6,        // 24px
      '8': baseUnit * 8,        // 32px
      '10': baseUnit * 10,      // 40px
      '12': baseUnit * 12,      // 48px
      '16': baseUnit * 16,      // 64px
      '20': baseUnit * 20,      // 80px
      '24': baseUnit * 24,      // 96px
    },
    radii: {
      none: 0,
      sm: baseUnit,             // 4px
      md: baseUnit * 2,         // 8px
      lg: baseUnit * 3,         // 12px
      xl: baseUnit * 4,         // 16px
      '2xl': baseUnit * 6,      // 24px
      '3xl': baseUnit * 8,      // 32px
      full: 9999,
    },
    borderWidths: {
      none: 0,
      thin: 0.5,                // Hairline on retina
      normal: 1,
      medium: 2,
      thick: 4,
    },
  };
}

/**
 * Generate shadow tokens for elevation system
 */
export function generateShadowTokens(options?: {
  shadowColor?: OklchColor;
  intensity?: 'subtle' | 'normal' | 'strong';
}): ShadowTokens {
  const shadowColor = options?.shadowColor ?? { l: 0, c: 0, h: 0, alpha: 0.15 };
  const intensity = options?.intensity ?? 'normal';

  const multiplier =
    intensity === 'subtle' ? 0.5 : intensity === 'strong' ? 1.5 : 1.0;

  const adjustAlpha = (alpha: number) => alpha * multiplier;

  return {
    none: {
      x: 0,
      y: 0,
      blur: 0,
      spread: 0,
      color: { ...shadowColor, alpha: 0 },
    },
    sm: {
      x: 0,
      y: 1,
      blur: 2,
      spread: 0,
      color: { ...shadowColor, alpha: adjustAlpha(0.05) },
    },
    md: {
      x: 0,
      y: 2,
      blur: 4,
      spread: -1,
      color: { ...shadowColor, alpha: adjustAlpha(0.1) },
    },
    lg: {
      x: 0,
      y: 4,
      blur: 8,
      spread: -2,
      color: { ...shadowColor, alpha: adjustAlpha(0.1) },
    },
    xl: {
      x: 0,
      y: 8,
      blur: 16,
      spread: -4,
      color: { ...shadowColor, alpha: adjustAlpha(0.15) },
    },
  };
}

/**
 * Generate motion tokens for animations
 */
export function generateMotionTokens(): MotionTokens {
  return {
    durations: {
      instant: 0,
      fast: 100,
      normal: 200,
      slow: 300,
      slower: 500,
    },
    easings: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.5, 1.25, 0.75, 1)',
    },
    springs: {
      snappy: {
        mass: 1,
        stiffness: 400,
        damping: 30,
      },
      bouncy: {
        mass: 1,
        stiffness: 300,
        damping: 15,
      },
      gentle: {
        mass: 1,
        stiffness: 150,
        damping: 20,
      },
    },
  };
}

/**
 * iOS standard spacing values for common scenarios
 */
export const IOS_STANDARD_SPACING = {
  // Screen edge padding
  screenHorizontalPadding: 16,
  screenVerticalPadding: 20,

  // List item spacing
  listRowPadding: 16,
  listSectionSpacing: 35,
  listItemSpacing: 0,

  // Card spacing
  cardPadding: 16,
  cardSpacing: 12,

  // Form spacing
  formFieldSpacing: 16,
  formSectionSpacing: 24,
  formLabelSpacing: 8,

  // Button spacing
  buttonPadding: 12,
  buttonGroupSpacing: 8,

  // Navigation
  navBarHorizontalPadding: 16,
  tabBarHorizontalPadding: 0,

  // Modal
  sheetPadding: 16,
  alertPadding: 20,
};

/**
 * Get appropriate spacing for a component type
 */
export function getComponentSpacing(
  componentType: string,
  spacing: SpacingTokens
): { padding: number; gap: number; margin: number } {
  const defaults = {
    padding: spacing.scale['4'], // 16px
    gap: spacing.scale['3'],     // 12px
    margin: spacing.scale['4'],  // 16px
  };

  const componentSpacing: Record<
    string,
    { padding: number; gap: number; margin: number }
  > = {
    list: {
      padding: 0,
      gap: 0,
      margin: spacing.scale['4'],
    },
    section: {
      padding: spacing.scale['4'],
      gap: spacing.scale['2'],
      margin: 0,
    },
    card: {
      padding: spacing.scale['4'],
      gap: spacing.scale['3'],
      margin: spacing.scale['3'],
    },
    button: {
      padding: spacing.scale['3'],
      gap: spacing.scale['2'],
      margin: 0,
    },
    textfield: {
      padding: spacing.scale['3'],
      gap: spacing.scale['2'],
      margin: spacing.scale['4'],
    },
    header: {
      padding: spacing.scale['4'],
      gap: spacing.scale['2'],
      margin: 0,
    },
    form: {
      padding: spacing.scale['4'],
      gap: spacing.scale['4'],
      margin: spacing.scale['5'],
    },
    hstack: {
      padding: 0,
      gap: spacing.scale['2'],
      margin: 0,
    },
    vstack: {
      padding: 0,
      gap: spacing.scale['3'],
      margin: 0,
    },
  };

  return componentSpacing[componentType] ?? defaults;
}

/**
 * Generate a consistent border radius based on content height
 */
export function calculateBorderRadius(
  contentHeight: number,
  style: 'subtle' | 'rounded' | 'pill' = 'rounded'
): number {
  switch (style) {
    case 'subtle':
      return Math.min(4, contentHeight * 0.1);
    case 'rounded':
      return Math.min(12, contentHeight * 0.25);
    case 'pill':
      return contentHeight / 2;
    default:
      return 8;
  }
}

/**
 * Check if spacing follows the 4px grid
 */
export function isOnGrid(value: number, baseUnit: number = 4): boolean {
  return value % baseUnit === 0;
}

/**
 * Snap a value to the nearest grid point
 */
export function snapToGrid(value: number, baseUnit: number = 4): number {
  return Math.round(value / baseUnit) * baseUnit;
}
