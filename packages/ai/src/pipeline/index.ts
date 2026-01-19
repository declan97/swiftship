/**
 * AI generation pipeline module.
 * Context-aware generation with streaming and variation support.
 */

// Generator
export {
  type GenerationOptions,
  type GenerationResult,
  type StreamChunk,
  buildEnhancedSystemPrompt,
  buildCreationPrompt,
  buildModificationPrompt,
  ContextAwareGenerator,
  createMockGenerator,
} from './generator.js';

// Variations
export {
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
} from './variations.js';

// Streaming
export {
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
} from './streaming.js';
