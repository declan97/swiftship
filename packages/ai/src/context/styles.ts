/**
 * Design style presets for context-aware iOS app generation.
 * Each style defines a cohesive visual language to avoid generic "AI slop".
 */

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  colorPalette: ColorPalette;
  typography: TypographyStyle;
  spacing: SpacingStyle;
  characteristics: string[];
  avoidPatterns: string[];
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface TypographyStyle {
  displayFont: string;
  bodyFont: string;
  scale: TypeScale;
  weights: {
    display: string;
    heading: string;
    body: string;
    caption: string;
  };
}

export type TypeScale =
  | 'minorSecond'     // 1.067
  | 'majorSecond'     // 1.125
  | 'minorThird'      // 1.200
  | 'majorThird'      // 1.250
  | 'perfectFourth'   // 1.333
  | 'goldenRatio';    // 1.618

export interface SpacingStyle {
  baseUnit: number;
  scale: number[];
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    full: number;
  };
}

/**
 * Design style presets - each creates a distinct visual identity
 */
export const DESIGN_STYLES: Record<string, DesignStyle> = {
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    description: 'Magazine-inspired with strong typography hierarchy and generous whitespace',
    colorPalette: {
      primary: 'oklch(0.25 0.02 260)',      // Near black
      secondary: 'oklch(0.45 0.01 260)',    // Dark gray
      accent: 'oklch(0.55 0.18 30)',        // Terracotta
      background: 'oklch(0.98 0.005 90)',   // Warm off-white
      surface: 'oklch(0.95 0.01 90)',       // Cream
      text: 'oklch(0.20 0.02 260)',         // Very dark
      textSecondary: 'oklch(0.50 0.01 260)',// Medium gray
      border: 'oklch(0.85 0.01 90)',        // Light warm gray
      success: 'oklch(0.60 0.15 145)',      // Sage green
      warning: 'oklch(0.75 0.15 80)',       // Amber
      error: 'oklch(0.55 0.20 25)',         // Burnt sienna
    },
    typography: {
      displayFont: 'Georgia',
      bodyFont: 'SF Pro Text',
      scale: 'perfectFourth',
      weights: {
        display: 'regular',
        heading: 'semibold',
        body: 'regular',
        caption: 'medium',
      },
    },
    spacing: {
      baseUnit: 8,
      scale: [4, 8, 16, 24, 32, 48, 64, 96],
      borderRadius: {
        small: 4,
        medium: 8,
        large: 12,
        full: 9999,
      },
    },
    characteristics: [
      'Large display typography with serif fonts',
      'Generous negative space',
      'Subtle warm color palette',
      'Minimal decorative elements',
      'Strong visual hierarchy through type size',
      'Article-style layouts with clear sections',
    ],
    avoidPatterns: [
      'Rounded pill buttons',
      'Gradient backgrounds',
      'Card-heavy layouts',
      'Bright saturated colors',
    ],
  },

  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass effects with translucent surfaces and soft shadows',
    colorPalette: {
      primary: 'oklch(0.70 0.15 250)',      // Soft blue
      secondary: 'oklch(0.65 0.12 290)',    // Lavender
      accent: 'oklch(0.80 0.20 180)',       // Cyan
      background: 'oklch(0.25 0.05 270)',   // Deep purple-gray
      surface: 'oklch(0.35 0.04 260/0.6)',  // Translucent
      text: 'oklch(0.95 0.01 260)',         // Off-white
      textSecondary: 'oklch(0.75 0.02 260)',// Light gray
      border: 'oklch(0.50 0.03 260/0.3)',   // Subtle border
      success: 'oklch(0.72 0.16 160)',      // Mint
      warning: 'oklch(0.80 0.16 85)',       // Soft yellow
      error: 'oklch(0.65 0.20 20)',         // Coral
    },
    typography: {
      displayFont: 'SF Pro Display',
      bodyFont: 'SF Pro Text',
      scale: 'majorSecond',
      weights: {
        display: 'bold',
        heading: 'semibold',
        body: 'regular',
        caption: 'regular',
      },
    },
    spacing: {
      baseUnit: 8,
      scale: [4, 8, 12, 16, 24, 32, 40, 56],
      borderRadius: {
        small: 12,
        medium: 20,
        large: 28,
        full: 9999,
      },
    },
    characteristics: [
      'Frosted glass card effects',
      'Soft multi-layer shadows',
      'Translucent overlays',
      'Subtle blur backgrounds',
      'Floating card elements',
      'Smooth corner radii (16-28pt)',
    ],
    avoidPatterns: [
      'Hard edges and sharp corners',
      'Solid opaque backgrounds',
      'Flat design without depth',
      'High contrast borders',
    ],
  },

  swiss: {
    id: 'swiss',
    name: 'Swiss',
    description: 'Clean, grid-based design with bold sans-serif typography',
    colorPalette: {
      primary: 'oklch(0.15 0.01 260)',      // Almost black
      secondary: 'oklch(0.60 0 0)',          // Pure gray
      accent: 'oklch(0.60 0.25 25)',        // Bold red
      background: 'oklch(1.0 0 0)',          // Pure white
      surface: 'oklch(0.97 0 0)',           // Near white
      text: 'oklch(0.10 0 0)',              // Black
      textSecondary: 'oklch(0.55 0 0)',     // Medium gray
      border: 'oklch(0.88 0 0)',            // Light gray
      success: 'oklch(0.55 0.18 145)',      // Forest green
      warning: 'oklch(0.70 0.18 70)',       // Mustard
      error: 'oklch(0.55 0.25 25)',         // Same as accent
    },
    typography: {
      displayFont: 'Helvetica Neue',
      bodyFont: 'Helvetica Neue',
      scale: 'majorThird',
      weights: {
        display: 'bold',
        heading: 'bold',
        body: 'regular',
        caption: 'medium',
      },
    },
    spacing: {
      baseUnit: 8,
      scale: [8, 16, 24, 32, 48, 64, 80, 120],
      borderRadius: {
        small: 0,
        medium: 0,
        large: 4,
        full: 9999,
      },
    },
    characteristics: [
      'Strict grid-based layouts',
      'Bold sans-serif headlines',
      'High contrast black and white',
      'Red as primary accent',
      'Minimal decorative elements',
      'Strong horizontal and vertical alignment',
    ],
    avoidPatterns: [
      'Rounded corners on containers',
      'Gradient anything',
      'Decorative illustrations',
      'Multiple accent colors',
    ],
  },

  neoBrutalism: {
    id: 'neoBrutalism',
    name: 'Neo-Brutalism',
    description: 'Bold, raw aesthetic with hard shadows and vibrant colors',
    colorPalette: {
      primary: 'oklch(0.10 0 0)',           // Pure black
      secondary: 'oklch(0.85 0.20 95)',     // Bright yellow
      accent: 'oklch(0.65 0.25 145)',       // Vibrant green
      background: 'oklch(0.95 0.03 95)',    // Warm cream
      surface: 'oklch(1.0 0 0)',            // White
      text: 'oklch(0.10 0 0)',              // Black
      textSecondary: 'oklch(0.40 0 0)',     // Dark gray
      border: 'oklch(0.10 0 0)',            // Black borders
      success: 'oklch(0.65 0.25 145)',      // Same as accent
      warning: 'oklch(0.85 0.20 70)',       // Orange
      error: 'oklch(0.60 0.28 25)',         // Hot red
    },
    typography: {
      displayFont: 'SF Pro Display',
      bodyFont: 'SF Pro Text',
      scale: 'perfectFourth',
      weights: {
        display: 'black',
        heading: 'bold',
        body: 'medium',
        caption: 'semibold',
      },
    },
    spacing: {
      baseUnit: 8,
      scale: [4, 8, 16, 20, 28, 40, 56, 80],
      borderRadius: {
        small: 0,
        medium: 8,
        large: 16,
        full: 9999,
      },
    },
    characteristics: [
      'Hard drop shadows (4-8px offset)',
      'Bold black borders (2-4px)',
      'Vibrant, saturated colors',
      'Chunky elements',
      'Offset/stacked layers',
      'Raw, unpolished aesthetic',
    ],
    avoidPatterns: [
      'Subtle shadows',
      'Muted colors',
      'Thin borders',
      'Elegant refinement',
    ],
  },

  darkInterface: {
    id: 'darkInterface',
    name: 'Dark Interface',
    description: 'Professional dark mode with subtle gradients and neon accents',
    colorPalette: {
      primary: 'oklch(0.60 0.22 270)',      // Electric purple
      secondary: 'oklch(0.55 0.20 200)',    // Teal
      accent: 'oklch(0.75 0.25 340)',       // Hot pink
      background: 'oklch(0.15 0.02 260)',   // Deep dark
      surface: 'oklch(0.20 0.02 260)',      // Elevated dark
      text: 'oklch(0.95 0.01 260)',         // Off-white
      textSecondary: 'oklch(0.65 0.02 260)',// Muted
      border: 'oklch(0.30 0.02 260)',       // Subtle border
      success: 'oklch(0.70 0.20 160)',      // Neon green
      warning: 'oklch(0.80 0.20 85)',       // Amber
      error: 'oklch(0.65 0.25 25)',         // Red
    },
    typography: {
      displayFont: 'SF Pro Display',
      bodyFont: 'SF Pro Text',
      scale: 'majorSecond',
      weights: {
        display: 'semibold',
        heading: 'semibold',
        body: 'regular',
        caption: 'regular',
      },
    },
    spacing: {
      baseUnit: 4,
      scale: [4, 8, 12, 16, 20, 24, 32, 48],
      borderRadius: {
        small: 8,
        medium: 12,
        large: 16,
        full: 9999,
      },
    },
    characteristics: [
      'Dark background with subtle gradients',
      'Neon accent colors',
      'Glow effects on interactive elements',
      'High contrast text',
      'Subtle surface elevation',
      'Compact, information-dense layouts',
    ],
    avoidPatterns: [
      'Pure black backgrounds (#000)',
      'Low contrast text',
      'Bright white surfaces',
      'Colorful backgrounds',
    ],
  },

  organic: {
    id: 'organic',
    name: 'Organic',
    description: 'Natural, earthy aesthetic with soft curves and warm tones',
    colorPalette: {
      primary: 'oklch(0.45 0.10 70)',       // Earth brown
      secondary: 'oklch(0.55 0.12 145)',    // Sage
      accent: 'oklch(0.60 0.15 55)',        // Terracotta
      background: 'oklch(0.96 0.02 90)',    // Warm off-white
      surface: 'oklch(0.93 0.03 85)',       // Sand
      text: 'oklch(0.30 0.05 70)',          // Dark brown
      textSecondary: 'oklch(0.50 0.04 70)', // Medium brown
      border: 'oklch(0.80 0.04 85)',        // Light tan
      success: 'oklch(0.55 0.15 145)',      // Forest green
      warning: 'oklch(0.70 0.15 70)',       // Ochre
      error: 'oklch(0.55 0.18 30)',         // Clay red
    },
    typography: {
      displayFont: 'Georgia',
      bodyFont: 'SF Pro Text',
      scale: 'minorThird',
      weights: {
        display: 'regular',
        heading: 'medium',
        body: 'regular',
        caption: 'regular',
      },
    },
    spacing: {
      baseUnit: 8,
      scale: [4, 8, 16, 24, 32, 48, 64, 96],
      borderRadius: {
        small: 16,
        medium: 24,
        large: 32,
        full: 9999,
      },
    },
    characteristics: [
      'Soft, rounded shapes',
      'Earth tone color palette',
      'Organic blob decorations',
      'Generous padding',
      'Warm, inviting feel',
      'Asymmetric layouts',
    ],
    avoidPatterns: [
      'Sharp corners',
      'Cool colors (blue, purple)',
      'Grid-locked layouts',
      'High contrast elements',
    ],
  },
};

/**
 * Get a style by ID with fallback to editorial
 */
export function getStyle(styleId: string): DesignStyle {
  return DESIGN_STYLES[styleId] ?? DESIGN_STYLES.editorial;
}

/**
 * Get all available style IDs
 */
export function getAvailableStyles(): string[] {
  return Object.keys(DESIGN_STYLES);
}

/**
 * Get a style suitable for a given app category
 */
export function suggestStyleForCategory(category: string): DesignStyle {
  const categoryMap: Record<string, string> = {
    finance: 'swiss',
    banking: 'darkInterface',
    productivity: 'swiss',
    social: 'glassmorphism',
    health: 'organic',
    wellness: 'organic',
    news: 'editorial',
    magazine: 'editorial',
    entertainment: 'neoBrutalism',
    gaming: 'neoBrutalism',
    utility: 'darkInterface',
    developer: 'darkInterface',
    creative: 'glassmorphism',
    art: 'editorial',
    music: 'darkInterface',
    photo: 'glassmorphism',
    travel: 'organic',
    food: 'organic',
    shopping: 'neoBrutalism',
    ecommerce: 'neoBrutalism',
  };

  const normalizedCategory = category.toLowerCase().trim();
  const styleId = categoryMap[normalizedCategory] ?? 'editorial';
  return getStyle(styleId);
}
