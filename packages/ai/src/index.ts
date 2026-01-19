/**
 * @swiftship/ai
 *
 * AI-powered component tree generation using Claude.
 */

export { AIClient, createAIClient, type AIClientOptions } from './client.js';
export type { GenerationResult as LegacyGenerationResult } from './client.js';
export { parseComponentTree, validateComponentTree, type ParseResult } from './parser.js';
export {
  SYSTEM_PROMPT,
  getBaseSystemPrompt,
  IOS_HIG_CONSTANTS,
  generateCreationPrompt as generateLegacyCreationPrompt,
  generateModificationPrompt as generateLegacyModificationPrompt,
} from './prompts/system.js';

// Design token generation
export {
  // Color utilities
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
  // Typography utilities
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
  // Spacing utilities
  generateSpacingTokens,
  generateShadowTokens,
  generateMotionTokens,
  IOS_STANDARD_SPACING,
  getComponentSpacing,
  calculateBorderRadius,
  isOnGrid,
  snapToGrid,
  // Full token generation
  type TokenGenerationOptions,
  generateDesignTokens,
  generateTokensFromStyle,
} from './tokens/index.js';

// Design context system
export {
  // Types
  type DesignStyle,
  type ColorPalette,
  type TypographyStyle,
  type TypeScale,
  type SpacingStyle,
  type AntiPattern,
  type AntiPatternCategory,
  type DesignContextOptions,
  type DesignContext,
  // Style presets
  DESIGN_STYLES,
  getStyle,
  getAvailableStyles,
  suggestStyleForCategory,
  // Anti-patterns
  ANTI_PATTERNS,
  getAntiPatternsByCategory,
  getCriticalAntiPatterns,
  getAntiPatternsForStyle,
  formatAntiPatternsForPrompt,
  // Context building
  buildDesignContext,
  formatDesignContextForPrompt,
  getCompactContextSummary,
  createDefaultContext,
  listStyleOptions,
} from './context/index.js';

// Generation pipeline
export {
  // Generator
  type GenerationOptions,
  type GenerationResult,
  type StreamChunk,
  buildEnhancedSystemPrompt,
  buildCreationPrompt,
  buildModificationPrompt,
  ContextAwareGenerator,
  createMockGenerator,
  // Variations
  type VariationConfig,
  type VariationResult,
  type VariationGeneratorOptions,
  generateVariations,
  createStyleVariations,
  createThemeVariations,
  createColorVariations,
  createExplorationVariations,
  selectBestVariation,
  compareTreeStructures,
  // Streaming
  type SSEEventType,
  type SSEStartEvent,
  type SSETextEvent,
  type SSEProgressEvent,
  type SSEComponentEvent,
  type SSECompleteEvent,
  type SSEErrorEvent,
  type SSEEvent,
  formatSSEEvent,
  parseSSEEvent,
  SSEEncoder,
  SSEReader,
  createSSEStream,
  createSSEHeaders,
  consumeSSEStream,
} from './pipeline/index.js';
