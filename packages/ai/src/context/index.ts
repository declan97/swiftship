/**
 * Design context module for context-aware AI generation.
 */

export {
  type DesignStyle,
  type ColorPalette,
  type TypographyStyle,
  type TypeScale,
  type SpacingStyle,
  DESIGN_STYLES,
  getStyle,
  getAvailableStyles,
  suggestStyleForCategory,
} from './styles.js';

export {
  type AntiPattern,
  type AntiPatternCategory,
  ANTI_PATTERNS,
  getAntiPatternsByCategory,
  getCriticalAntiPatterns,
  getAntiPatternsForStyle,
  formatAntiPatternsForPrompt,
} from './anti-patterns.js';

export {
  type DesignContextOptions,
  type DesignContext,
  buildDesignContext,
  formatDesignContextForPrompt,
  getCompactContextSummary,
  createDefaultContext,
  listStyleOptions,
} from './design-context.js';
