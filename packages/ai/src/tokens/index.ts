/**
 * Design token generation utilities.
 * Creates perceptually uniform colors, modular type scales, and consistent spacing.
 */

// Color utilities
export {
  parseOklch,
  formatOklchToCss,
  formatOklchToHex,
  createOklchColor,
  adjustLightness,
  adjustChroma,
  rotateHue,
  createHarmony,
  generateLightnessScale,
  generateInteractiveStates,
  generateColorTokens,
  hasMinimumContrast,
  ensureContrast,
} from './color-generator.js';

// Typography utilities
export {
  SCALE_RATIOS,
  IOS_TEXT_STYLES,
  FONT_WEIGHTS,
  calculateScaleStep,
  generateTypeScale,
  generateTypographyTokens,
  mapToIOSTextStyles,
  getRecommendedLineHeight,
  getRecommendedTracking,
  generateTextStyleSpecs,
  type TextStyleSpec,
} from './typography-scale.js';

// Spacing utilities
export {
  generateSpacingTokens,
  generateShadowTokens,
  generateMotionTokens,
  IOS_STANDARD_SPACING,
  getComponentSpacing,
  calculateBorderRadius,
  isOnGrid,
  snapToGrid,
} from './spacing-system.js';

// Token generation
import type { DesignTokens, OklchColor, TypeScaleRatio } from '@swiftship/core';
import { generateColorTokens, createOklchColor, parseOklch } from './color-generator.js';
import { generateTypographyTokens } from './typography-scale.js';
import { generateSpacingTokens, generateShadowTokens, generateMotionTokens } from './spacing-system.js';

export interface TokenGenerationOptions {
  /** Token set name */
  name: string;
  /** Style preset ID */
  styleId: string;
  /** Primary color (OKLCH string or object) */
  primary: string | OklchColor;
  /** Accent color (OKLCH string or object, optional) */
  accent?: string | OklchColor;
  /** Is dark mode? */
  isDark?: boolean;
  /** Base font size in points */
  baseFontSize?: number;
  /** Type scale ratio */
  scaleRatio?: TypeScaleRatio;
  /** Display font family */
  displayFont?: string;
  /** Body font family */
  bodyFont?: string;
  /** Base spacing unit (4 recommended) */
  baseUnit?: number;
  /** Shadow intensity */
  shadowIntensity?: 'subtle' | 'normal' | 'strong';
}

/**
 * Generate a complete design token set
 */
export function generateDesignTokens(options: TokenGenerationOptions): DesignTokens {
  // Parse colors if strings
  const primaryColor =
    typeof options.primary === 'string'
      ? parseOklch(options.primary)
      : options.primary;

  const accentColor =
    options.accent
      ? typeof options.accent === 'string'
        ? parseOklch(options.accent)
        : options.accent
      : undefined;

  // Generate all token categories
  const colors = generateColorTokens({
    primary: primaryColor,
    accent: accentColor,
    isDark: options.isDark,
  });

  const typography = generateTypographyTokens({
    baseFontSize: options.baseFontSize,
    scaleRatio: options.scaleRatio,
    displayFont: options.displayFont,
    bodyFont: options.bodyFont,
  });

  const spacing = generateSpacingTokens(options.baseUnit);

  const shadowColor = options.isDark
    ? createOklchColor(0, 0, 0, 0.4)
    : createOklchColor(0, 0, 0, 0.15);

  const shadows = generateShadowTokens({
    shadowColor,
    intensity: options.shadowIntensity,
  });

  const motion = generateMotionTokens();

  return {
    name: options.name,
    styleId: options.styleId,
    colors,
    typography,
    spacing,
    shadows,
    motion,
  };
}

/**
 * Generate tokens from a style preset
 */
export function generateTokensFromStyle(
  styleId: string,
  primaryOklch: string,
  isDark: boolean = false
): DesignTokens {
  // Import style presets here to avoid circular dependency
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getStyle } = require('../context/styles.js');
  const style = getStyle(styleId);

  return generateDesignTokens({
    name: `${style.name} ${isDark ? 'Dark' : 'Light'}`,
    styleId,
    primary: primaryOklch,
    isDark,
    baseFontSize: 17,
    scaleRatio: style.typography.scale,
    displayFont: style.typography.displayFont,
    bodyFont: style.typography.bodyFont,
    baseUnit: style.spacing.baseUnit,
    shadowIntensity: styleId === 'neoBrutalism' ? 'strong' : 'normal',
  });
}
