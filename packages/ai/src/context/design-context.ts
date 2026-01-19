/**
 * Design context builder for AI prompt injection.
 * Combines style presets, anti-patterns, and user preferences.
 */

import {
  type DesignStyle,
  getStyle,
  getAvailableStyles,
  suggestStyleForCategory,
} from './styles.js';
import {
  type AntiPattern,
  getCriticalAntiPatterns,
  getAntiPatternsForStyle,
  formatAntiPatternsForPrompt,
} from './anti-patterns.js';

export interface DesignContextOptions {
  /** Design style preset ID */
  styleId?: string;
  /** App category for style suggestion if no styleId provided */
  appCategory?: string;
  /** Custom brand colors to override palette */
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  /** Additional characteristics to emphasize */
  emphasis?: string[];
  /** Include full anti-pattern list (verbose) or just critical ones */
  verboseAntiPatterns?: boolean;
  /** User's design notes/preferences as free text */
  userNotes?: string;
}

export interface DesignContext {
  style: DesignStyle;
  antiPatterns: AntiPattern[];
  customizations: {
    brandColors?: DesignContextOptions['brandColors'];
    emphasis?: string[];
    userNotes?: string;
  };
}

/**
 * Build a design context from options
 */
export function buildDesignContext(options: DesignContextOptions = {}): DesignContext {
  // Determine style
  let style: DesignStyle;

  if (options.styleId) {
    style = getStyle(options.styleId);
  } else if (options.appCategory) {
    style = suggestStyleForCategory(options.appCategory);
  } else {
    style = getStyle('editorial'); // sensible default
  }

  // Get relevant anti-patterns
  const antiPatterns = options.verboseAntiPatterns
    ? getAntiPatternsForStyle(style.id)
    : getCriticalAntiPatterns();

  // Apply brand color overrides
  if (options.brandColors) {
    style = {
      ...style,
      colorPalette: {
        ...style.colorPalette,
        ...(options.brandColors.primary && { primary: options.brandColors.primary }),
        ...(options.brandColors.secondary && { secondary: options.brandColors.secondary }),
        ...(options.brandColors.accent && { accent: options.brandColors.accent }),
      },
    };
  }

  return {
    style,
    antiPatterns,
    customizations: {
      brandColors: options.brandColors,
      emphasis: options.emphasis,
      userNotes: options.userNotes,
    },
  };
}

/**
 * Format design context as system prompt injection
 */
export function formatDesignContextForPrompt(context: DesignContext): string {
  const { style, antiPatterns, customizations } = context;

  let output = `\n## Design Context: ${style.name}\n\n`;

  // Style description
  output += `**Style Philosophy:** ${style.description}\n\n`;

  // Color palette
  output += `### Color Palette (OKLCH)\n`;
  output += `Use these exact colors for consistency:\n`;
  output += `- Primary: ${style.colorPalette.primary}\n`;
  output += `- Secondary: ${style.colorPalette.secondary}\n`;
  output += `- Accent: ${style.colorPalette.accent}\n`;
  output += `- Background: ${style.colorPalette.background}\n`;
  output += `- Surface: ${style.colorPalette.surface}\n`;
  output += `- Text: ${style.colorPalette.text}\n`;
  output += `- Text Secondary: ${style.colorPalette.textSecondary}\n`;
  output += `- Border: ${style.colorPalette.border}\n\n`;

  // Typography
  output += `### Typography\n`;
  output += `- Display Font: ${style.typography.displayFont}\n`;
  output += `- Body Font: ${style.typography.bodyFont}\n`;
  output += `- Scale: ${style.typography.scale} (`;
  output += getScaleDescription(style.typography.scale);
  output += `)\n`;
  output += `- Weights: display=${style.typography.weights.display}, heading=${style.typography.weights.heading}, body=${style.typography.weights.body}\n\n`;

  // Spacing
  output += `### Spacing (${style.spacing.baseUnit}px base)\n`;
  output += `- Scale: ${style.spacing.scale.join(', ')}\n`;
  output += `- Border Radius: small=${style.spacing.borderRadius.small}, medium=${style.spacing.borderRadius.medium}, large=${style.spacing.borderRadius.large}\n\n`;

  // Characteristics
  output += `### Design Characteristics\n`;
  output += `Follow these principles for this style:\n`;
  for (const char of style.characteristics) {
    output += `- ${char}\n`;
  }
  output += '\n';

  // Style-specific avoidance
  if (style.avoidPatterns.length > 0) {
    output += `### Style-Specific Avoidance\n`;
    for (const avoid of style.avoidPatterns) {
      output += `- Do NOT use: ${avoid}\n`;
    }
    output += '\n';
  }

  // Anti-patterns
  output += formatAntiPatternsForPrompt(antiPatterns);

  // Custom emphasis
  if (customizations.emphasis && customizations.emphasis.length > 0) {
    output += `### Additional Emphasis\n`;
    for (const e of customizations.emphasis) {
      output += `- ${e}\n`;
    }
    output += '\n';
  }

  // User notes
  if (customizations.userNotes) {
    output += `### Designer Notes\n`;
    output += customizations.userNotes + '\n\n';
  }

  return output;
}

/**
 * Get a compact context summary (for conversational use)
 */
export function getCompactContextSummary(context: DesignContext): string {
  const { style } = context;
  return (
    `Style: ${style.name} - ${style.description}. ` +
    `Colors: ${style.colorPalette.primary} primary, ${style.colorPalette.accent} accent. ` +
    `Typography: ${style.typography.displayFont} for display, ${style.typography.scale} scale. ` +
    `Key traits: ${style.characteristics.slice(0, 3).join('; ')}.`
  );
}

/**
 * Helper to describe type scales
 */
function getScaleDescription(scale: string): string {
  const descriptions: Record<string, string> = {
    minorSecond: '1.067 ratio - subtle hierarchy',
    majorSecond: '1.125 ratio - moderate hierarchy',
    minorThird: '1.200 ratio - clear hierarchy',
    majorThird: '1.250 ratio - strong hierarchy',
    perfectFourth: '1.333 ratio - dramatic hierarchy',
    goldenRatio: '1.618 ratio - classical proportions',
  };
  return descriptions[scale] ?? 'custom scale';
}

/**
 * Create a default design context
 */
export function createDefaultContext(): DesignContext {
  return buildDesignContext({ styleId: 'editorial' });
}

/**
 * List available style options for UI
 */
export function listStyleOptions(): Array<{ id: string; name: string; description: string }> {
  return getAvailableStyles().map((id) => {
    const style = getStyle(id);
    return {
      id: style.id,
      name: style.name,
      description: style.description,
    };
  });
}

// Re-export types for convenience
export type { DesignStyle, AntiPattern };
export { getStyle, getAvailableStyles, suggestStyleForCategory };
