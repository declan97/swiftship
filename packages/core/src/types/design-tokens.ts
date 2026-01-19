/**
 * Design token types for the context-aware design system.
 * These tokens define the visual language of generated iOS apps.
 */

/**
 * Color token in OKLCH format for perceptually uniform color manipulation
 */
export interface OklchColor {
  /** Lightness (0-1) */
  l: number;
  /** Chroma (0-0.4) */
  c: number;
  /** Hue (0-360) */
  h: number;
  /** Alpha (0-1) */
  alpha?: number;
}

/**
 * Complete color palette with semantic and functional colors
 */
export interface ColorTokens {
  // Brand colors
  primary: OklchColor;
  secondary: OklchColor;
  accent: OklchColor;

  // Background colors
  background: OklchColor;
  backgroundElevated: OklchColor;
  surface: OklchColor;
  surfaceElevated: OklchColor;

  // Text colors
  textPrimary: OklchColor;
  textSecondary: OklchColor;
  textTertiary: OklchColor;
  textInverse: OklchColor;

  // Semantic colors
  success: OklchColor;
  warning: OklchColor;
  error: OklchColor;
  info: OklchColor;

  // UI colors
  border: OklchColor;
  divider: OklchColor;
  shadow: OklchColor;
  overlay: OklchColor;

  // Interactive states
  primaryHover: OklchColor;
  primaryPressed: OklchColor;
  primaryDisabled: OklchColor;
}

/**
 * Type scale ratio presets
 */
export type TypeScaleRatio =
  | 'minorSecond'   // 1.067
  | 'majorSecond'   // 1.125
  | 'minorThird'    // 1.200
  | 'majorThird'    // 1.250
  | 'perfectFourth' // 1.333
  | 'goldenRatio';  // 1.618

/**
 * Typography tokens defining the type system
 */
export interface TypographyTokens {
  /** Base font size in points */
  baseFontSize: number;
  /** Scale ratio for type hierarchy */
  scaleRatio: TypeScaleRatio;

  /** Font families */
  fonts: {
    display: string;
    heading: string;
    body: string;
    mono: string;
  };

  /** Font weights */
  weights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    heavy: number;
  };

  /** Line heights */
  lineHeights: {
    tight: number;      // 1.1 - headings
    snug: number;       // 1.25 - subheadings
    normal: number;     // 1.4 - body text
    relaxed: number;    // 1.6 - long-form reading
    loose: number;      // 2.0 - spacious
  };

  /** Letter spacing */
  tracking: {
    tighter: number;    // -0.05em
    tight: number;      // -0.025em
    normal: number;     // 0
    wide: number;       // 0.025em
    wider: number;      // 0.05em
    widest: number;     // 0.1em
  };

  /** Computed font sizes based on scale */
  sizes: {
    xs: number;         // scale^-2
    sm: number;         // scale^-1
    base: number;       // baseFontSize
    lg: number;         // scale^1
    xl: number;         // scale^2
    '2xl': number;      // scale^3
    '3xl': number;      // scale^4
    '4xl': number;      // scale^5
    '5xl': number;      // scale^6
  };
}

/**
 * Spacing tokens based on 4px grid
 */
export interface SpacingTokens {
  /** Base unit (typically 4px) */
  baseUnit: number;

  /** Spacing scale */
  scale: {
    '0': number;        // 0
    '0.5': number;      // 2px
    '1': number;        // 4px
    '1.5': number;      // 6px
    '2': number;        // 8px
    '2.5': number;      // 10px
    '3': number;        // 12px
    '4': number;        // 16px
    '5': number;        // 20px
    '6': number;        // 24px
    '8': number;        // 32px
    '10': number;       // 40px
    '12': number;       // 48px
    '16': number;       // 64px
    '20': number;       // 80px
    '24': number;       // 96px
  };

  /** Border radii */
  radii: {
    none: number;       // 0
    sm: number;         // 4px
    md: number;         // 8px
    lg: number;         // 12px
    xl: number;         // 16px
    '2xl': number;      // 24px
    '3xl': number;      // 32px
    full: number;       // 9999px
  };

  /** Border widths */
  borderWidths: {
    none: number;       // 0
    thin: number;       // 1px (hairline on retina)
    normal: number;     // 1px
    medium: number;     // 2px
    thick: number;      // 4px
  };
}

/**
 * Shadow tokens for elevation
 */
export interface ShadowTokens {
  /** No shadow */
  none: ShadowValue;
  /** Subtle shadow for cards */
  sm: ShadowValue;
  /** Default shadow */
  md: ShadowValue;
  /** Elevated shadow for modals */
  lg: ShadowValue;
  /** High elevation shadow */
  xl: ShadowValue;
}

export interface ShadowValue {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: OklchColor;
}

/**
 * Animation/Motion tokens
 */
export interface MotionTokens {
  /** Duration presets in milliseconds */
  durations: {
    instant: number;    // 0ms
    fast: number;       // 100ms
    normal: number;     // 200ms
    slow: number;       // 300ms
    slower: number;     // 500ms
  };

  /** Easing curves */
  easings: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;     // iOS spring animation
  };

  /** Spring animation parameters */
  springs: {
    snappy: { mass: number; stiffness: number; damping: number };
    bouncy: { mass: number; stiffness: number; damping: number };
    gentle: { mass: number; stiffness: number; damping: number };
  };
}

/**
 * Complete design token set
 */
export interface DesignTokens {
  /** Token set name */
  name: string;
  /** Style preset this is based on */
  styleId: string;
  /** Color tokens */
  colors: ColorTokens;
  /** Typography tokens */
  typography: TypographyTokens;
  /** Spacing tokens */
  spacing: SpacingTokens;
  /** Shadow tokens */
  shadows: ShadowTokens;
  /** Motion tokens */
  motion: MotionTokens;
}

/**
 * iOS HIG-specific tokens
 */
export interface IOSTokens {
  /** Safe area insets */
  safeArea: {
    top: number;
    bottom: number;
    leading: number;
    trailing: number;
  };
  /** Standard touch target size */
  minTouchTarget: number;
  /** Standard navigation bar height */
  navBarHeight: number;
  /** Standard tab bar height */
  tabBarHeight: number;
}

/**
 * Default iOS tokens
 */
export const DEFAULT_IOS_TOKENS: IOSTokens = {
  safeArea: {
    top: 59,        // Status bar + notch
    bottom: 34,     // Home indicator
    leading: 16,
    trailing: 16,
  },
  minTouchTarget: 44,
  navBarHeight: 44,
  tabBarHeight: 49,
};
