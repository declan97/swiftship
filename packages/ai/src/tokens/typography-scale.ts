/**
 * Modular typography scale generator.
 * Creates harmonious type hierarchies based on mathematical ratios.
 */

import type { TypeScaleRatio, TypographyTokens } from '@swiftship/core';

/**
 * Scale ratio values
 */
export const SCALE_RATIOS: Record<TypeScaleRatio, number> = {
  minorSecond: 1.067,
  majorSecond: 1.125,
  minorThird: 1.200,
  majorThird: 1.250,
  perfectFourth: 1.333,
  goldenRatio: 1.618,
};

/**
 * iOS system font sizes for reference
 */
export const IOS_TEXT_STYLES = {
  largeTitle: 34,
  title1: 28,
  title2: 22,
  title3: 20,
  headline: 17,
  body: 17,
  callout: 16,
  subheadline: 15,
  footnote: 13,
  caption1: 12,
  caption2: 11,
};

/**
 * Standard font weights
 */
export const FONT_WEIGHTS = {
  ultraLight: 100,
  thin: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 800,
  black: 900,
};

/**
 * Calculate a size at a specific step on the scale
 */
export function calculateScaleStep(
  baseSize: number,
  ratio: number,
  step: number
): number {
  const size = baseSize * Math.pow(ratio, step);
  // Round to nearest 0.5 for cleaner values
  return Math.round(size * 2) / 2;
}

/**
 * Generate a complete type scale from base size and ratio
 */
export function generateTypeScale(
  baseFontSize: number,
  scaleRatio: TypeScaleRatio
): TypographyTokens['sizes'] {
  const ratio = SCALE_RATIOS[scaleRatio];

  return {
    xs: calculateScaleStep(baseFontSize, ratio, -2),
    sm: calculateScaleStep(baseFontSize, ratio, -1),
    base: baseFontSize,
    lg: calculateScaleStep(baseFontSize, ratio, 1),
    xl: calculateScaleStep(baseFontSize, ratio, 2),
    '2xl': calculateScaleStep(baseFontSize, ratio, 3),
    '3xl': calculateScaleStep(baseFontSize, ratio, 4),
    '4xl': calculateScaleStep(baseFontSize, ratio, 5),
    '5xl': calculateScaleStep(baseFontSize, ratio, 6),
  };
}

/**
 * Generate complete typography tokens
 */
export function generateTypographyTokens(options: {
  baseFontSize?: number;
  scaleRatio?: TypeScaleRatio;
  displayFont?: string;
  bodyFont?: string;
}): TypographyTokens {
  const {
    baseFontSize = 17, // iOS body text default
    scaleRatio = 'majorSecond',
    displayFont = 'SF Pro Display',
    bodyFont = 'SF Pro Text',
  } = options;

  const sizes = generateTypeScale(baseFontSize, scaleRatio);

  return {
    baseFontSize,
    scaleRatio,
    fonts: {
      display: displayFont,
      heading: displayFont,
      body: bodyFont,
      mono: 'SF Mono',
    },
    weights: {
      light: FONT_WEIGHTS.light,
      regular: FONT_WEIGHTS.regular,
      medium: FONT_WEIGHTS.medium,
      semibold: FONT_WEIGHTS.semibold,
      bold: FONT_WEIGHTS.bold,
      heavy: FONT_WEIGHTS.heavy,
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.4,
      relaxed: 1.6,
      loose: 2.0,
    },
    tracking: {
      tighter: -0.05,
      tight: -0.025,
      normal: 0,
      wide: 0.025,
      wider: 0.05,
      widest: 0.1,
    },
    sizes,
  };
}

/**
 * Map our scale sizes to iOS text styles
 */
export function mapToIOSTextStyles(sizes: TypographyTokens['sizes']): {
  largeTitle: number;
  title: number;
  title2: number;
  title3: number;
  headline: number;
  body: number;
  callout: number;
  subheadline: number;
  footnote: number;
  caption: number;
  caption2: number;
} {
  return {
    largeTitle: sizes['5xl'],
    title: sizes['3xl'],
    title2: sizes['2xl'],
    title3: sizes.xl,
    headline: sizes.lg,
    body: sizes.base,
    callout: sizes.base,
    subheadline: sizes.sm,
    footnote: sizes.sm,
    caption: sizes.xs,
    caption2: sizes.xs,
  };
}

/**
 * Get recommended line height for a font size
 */
export function getRecommendedLineHeight(fontSize: number): number {
  // Larger text needs tighter line height
  if (fontSize >= 32) return 1.1;
  if (fontSize >= 24) return 1.2;
  if (fontSize >= 20) return 1.25;
  if (fontSize >= 16) return 1.4;
  return 1.5; // Small text needs more space
}

/**
 * Get recommended letter spacing for a font size
 */
export function getRecommendedTracking(fontSize: number): number {
  // Large display text often needs tighter tracking
  if (fontSize >= 48) return -0.02;
  if (fontSize >= 32) return -0.01;
  if (fontSize >= 24) return 0;
  return 0.01; // Small text benefits from slightly wider tracking
}

/**
 * Generate a complete text style specification
 */
export interface TextStyleSpec {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: string;
}

/**
 * Generate text style specs for common use cases
 */
export function generateTextStyleSpecs(tokens: TypographyTokens): {
  displayLarge: TextStyleSpec;
  displayMedium: TextStyleSpec;
  displaySmall: TextStyleSpec;
  headlineLarge: TextStyleSpec;
  headlineMedium: TextStyleSpec;
  headlineSmall: TextStyleSpec;
  titleLarge: TextStyleSpec;
  titleMedium: TextStyleSpec;
  titleSmall: TextStyleSpec;
  bodyLarge: TextStyleSpec;
  bodyMedium: TextStyleSpec;
  bodySmall: TextStyleSpec;
  labelLarge: TextStyleSpec;
  labelMedium: TextStyleSpec;
  labelSmall: TextStyleSpec;
} {
  const { sizes, fonts, weights } = tokens;

  return {
    displayLarge: {
      fontSize: sizes['5xl'],
      fontWeight: weights.bold,
      lineHeight: 1.1,
      letterSpacing: -0.02,
      fontFamily: fonts.display,
    },
    displayMedium: {
      fontSize: sizes['4xl'],
      fontWeight: weights.bold,
      lineHeight: 1.1,
      letterSpacing: -0.015,
      fontFamily: fonts.display,
    },
    displaySmall: {
      fontSize: sizes['3xl'],
      fontWeight: weights.semibold,
      lineHeight: 1.15,
      letterSpacing: -0.01,
      fontFamily: fonts.display,
    },
    headlineLarge: {
      fontSize: sizes['2xl'],
      fontWeight: weights.semibold,
      lineHeight: 1.2,
      letterSpacing: 0,
      fontFamily: fonts.heading,
    },
    headlineMedium: {
      fontSize: sizes.xl,
      fontWeight: weights.semibold,
      lineHeight: 1.25,
      letterSpacing: 0,
      fontFamily: fonts.heading,
    },
    headlineSmall: {
      fontSize: sizes.lg,
      fontWeight: weights.semibold,
      lineHeight: 1.3,
      letterSpacing: 0,
      fontFamily: fonts.heading,
    },
    titleLarge: {
      fontSize: sizes.lg,
      fontWeight: weights.medium,
      lineHeight: 1.3,
      letterSpacing: 0,
      fontFamily: fonts.body,
    },
    titleMedium: {
      fontSize: sizes.base,
      fontWeight: weights.medium,
      lineHeight: 1.4,
      letterSpacing: 0.01,
      fontFamily: fonts.body,
    },
    titleSmall: {
      fontSize: sizes.sm,
      fontWeight: weights.medium,
      lineHeight: 1.4,
      letterSpacing: 0.01,
      fontFamily: fonts.body,
    },
    bodyLarge: {
      fontSize: sizes.lg,
      fontWeight: weights.regular,
      lineHeight: 1.5,
      letterSpacing: 0.01,
      fontFamily: fonts.body,
    },
    bodyMedium: {
      fontSize: sizes.base,
      fontWeight: weights.regular,
      lineHeight: 1.5,
      letterSpacing: 0.02,
      fontFamily: fonts.body,
    },
    bodySmall: {
      fontSize: sizes.sm,
      fontWeight: weights.regular,
      lineHeight: 1.5,
      letterSpacing: 0.02,
      fontFamily: fonts.body,
    },
    labelLarge: {
      fontSize: sizes.base,
      fontWeight: weights.medium,
      lineHeight: 1.2,
      letterSpacing: 0.02,
      fontFamily: fonts.body,
    },
    labelMedium: {
      fontSize: sizes.sm,
      fontWeight: weights.medium,
      lineHeight: 1.2,
      letterSpacing: 0.03,
      fontFamily: fonts.body,
    },
    labelSmall: {
      fontSize: sizes.xs,
      fontWeight: weights.medium,
      lineHeight: 1.2,
      letterSpacing: 0.04,
      fontFamily: fonts.body,
    },
  };
}
