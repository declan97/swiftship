/**
 * OKLCH color palette generation using Culori.
 * Generates perceptually uniform color scales and palettes.
 */

import { oklch, formatHex, formatCss, type Oklch } from 'culori';
import type { OklchColor, ColorTokens } from '@swiftship/core';

/**
 * Convert our OklchColor to Culori's Oklch type
 */
function toOklch(color: OklchColor): Oklch {
  return {
    mode: 'oklch',
    l: color.l,
    c: color.c,
    h: color.h,
    alpha: color.alpha,
  };
}

/**
 * Parse an OKLCH string to our OklchColor type
 */
export function parseOklch(oklchString: string): OklchColor {
  // Handle format: oklch(0.7 0.15 250) or oklch(0.7 0.15 250/0.5)
  const match = oklchString.match(
    /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\/([0-9.]+))?\)/
  );

  if (!match) {
    throw new Error(`Invalid OKLCH string: ${oklchString}`);
  }

  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
    alpha: match[4] ? parseFloat(match[4]) : undefined,
  };
}

/**
 * Format OklchColor to CSS string
 */
export function formatOklchToCss(color: OklchColor): string {
  const culoriColor = toOklch(color);
  return formatCss(culoriColor);
}

/**
 * Format OklchColor to hex (for fallback)
 */
export function formatOklchToHex(color: OklchColor): string {
  const culoriColor = toOklch(color);
  return formatHex(culoriColor) ?? '#000000';
}

/**
 * Create an OklchColor
 */
export function createOklchColor(
  l: number,
  c: number,
  h: number,
  alpha?: number
): OklchColor {
  return { l, c, h, alpha };
}

/**
 * Adjust lightness of a color
 */
export function adjustLightness(color: OklchColor, delta: number): OklchColor {
  return {
    ...color,
    l: Math.max(0, Math.min(1, color.l + delta)),
  };
}

/**
 * Adjust chroma (saturation) of a color
 */
export function adjustChroma(color: OklchColor, delta: number): OklchColor {
  return {
    ...color,
    c: Math.max(0, Math.min(0.4, color.c + delta)),
  };
}

/**
 * Rotate hue of a color
 */
export function rotateHue(color: OklchColor, degrees: number): OklchColor {
  return {
    ...color,
    h: ((color.h + degrees) % 360 + 360) % 360,
  };
}

/**
 * Create a harmonious color based on color theory
 */
export function createHarmony(
  base: OklchColor,
  type: 'complementary' | 'triadic' | 'analogous' | 'split-complementary'
): OklchColor[] {
  switch (type) {
    case 'complementary':
      return [base, rotateHue(base, 180)];
    case 'triadic':
      return [base, rotateHue(base, 120), rotateHue(base, 240)];
    case 'analogous':
      return [rotateHue(base, -30), base, rotateHue(base, 30)];
    case 'split-complementary':
      return [base, rotateHue(base, 150), rotateHue(base, 210)];
  }
}

/**
 * Generate a lightness scale for a color (for tints and shades)
 */
export function generateLightnessScale(
  base: OklchColor,
  steps: number = 10
): OklchColor[] {
  const scale: OklchColor[] = [];
  const stepSize = 1 / (steps + 1);

  for (let i = 1; i <= steps; i++) {
    scale.push({
      ...base,
      l: stepSize * i,
    });
  }

  return scale;
}

/**
 * Generate interactive state colors from a base color
 */
export function generateInteractiveStates(base: OklchColor): {
  hover: OklchColor;
  pressed: OklchColor;
  disabled: OklchColor;
} {
  return {
    hover: adjustLightness(base, base.l > 0.5 ? -0.05 : 0.05),
    pressed: adjustLightness(base, base.l > 0.5 ? -0.1 : 0.1),
    disabled: {
      ...adjustChroma(base, -0.1),
      alpha: 0.5,
    },
  };
}

/**
 * Generate a complete color palette from primary/accent colors
 */
export function generateColorTokens(options: {
  primary: OklchColor;
  accent?: OklchColor;
  isDark?: boolean;
}): ColorTokens {
  const { primary, isDark = false } = options;

  // Generate accent via split-complementary if not provided
  const accent =
    options.accent ??
    rotateHue(adjustChroma(primary, 0.05), 150);

  // Generate secondary as desaturated primary
  const secondary = adjustChroma(primary, -0.08);

  // Background colors based on theme
  const background = isDark
    ? createOklchColor(0.15, 0.02, primary.h)
    : createOklchColor(0.98, 0.005, primary.h);

  const backgroundElevated = isDark
    ? createOklchColor(0.18, 0.02, primary.h)
    : createOklchColor(0.96, 0.005, primary.h);

  const surface = isDark
    ? createOklchColor(0.20, 0.02, primary.h)
    : createOklchColor(0.95, 0.01, primary.h);

  const surfaceElevated = isDark
    ? createOklchColor(0.25, 0.02, primary.h)
    : createOklchColor(0.99, 0.005, primary.h);

  // Text colors
  const textPrimary = isDark
    ? createOklchColor(0.95, 0.01, primary.h)
    : createOklchColor(0.20, 0.02, primary.h);

  const textSecondary = isDark
    ? createOklchColor(0.70, 0.02, primary.h)
    : createOklchColor(0.45, 0.02, primary.h);

  const textTertiary = isDark
    ? createOklchColor(0.55, 0.01, primary.h)
    : createOklchColor(0.60, 0.01, primary.h);

  const textInverse = isDark
    ? createOklchColor(0.15, 0.02, primary.h)
    : createOklchColor(0.95, 0.01, primary.h);

  // Semantic colors (fixed across themes)
  const success = createOklchColor(0.65, 0.18, 145);
  const warning = createOklchColor(0.75, 0.18, 85);
  const error = createOklchColor(0.60, 0.22, 25);
  const info = createOklchColor(0.65, 0.18, 250);

  // UI colors
  const border = isDark
    ? createOklchColor(0.30, 0.02, primary.h)
    : createOklchColor(0.85, 0.01, primary.h);

  const divider = isDark
    ? createOklchColor(0.25, 0.01, primary.h)
    : createOklchColor(0.90, 0.005, primary.h);

  const shadow = createOklchColor(0.0, 0, 0, 0.15);

  const overlay = createOklchColor(0.0, 0, 0, isDark ? 0.6 : 0.4);

  // Interactive states
  const { hover, pressed, disabled } = generateInteractiveStates(primary);

  return {
    primary,
    secondary,
    accent,
    background,
    backgroundElevated,
    surface,
    surfaceElevated,
    textPrimary,
    textSecondary,
    textTertiary,
    textInverse,
    success,
    warning,
    error,
    info,
    border,
    divider,
    shadow,
    overlay,
    primaryHover: hover,
    primaryPressed: pressed,
    primaryDisabled: disabled,
  };
}

/**
 * Check if a color has sufficient contrast against another
 * Simplified check based on lightness difference
 */
export function hasMinimumContrast(
  foreground: OklchColor,
  background: OklchColor,
  minDifference: number = 0.4
): boolean {
  return Math.abs(foreground.l - background.l) >= minDifference;
}

/**
 * Ensure a text color has minimum contrast against background
 */
export function ensureContrast(
  foreground: OklchColor,
  background: OklchColor,
  minDifference: number = 0.4
): OklchColor {
  if (hasMinimumContrast(foreground, background, minDifference)) {
    return foreground;
  }

  // Adjust lightness to meet contrast
  const direction = background.l > 0.5 ? -1 : 1;
  let adjusted = { ...foreground };
  let attempts = 0;

  while (!hasMinimumContrast(adjusted, background, minDifference) && attempts < 10) {
    adjusted = adjustLightness(adjusted, direction * 0.05);
    attempts++;
  }

  return adjusted;
}
