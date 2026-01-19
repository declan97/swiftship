/**
 * @swiftship/ai
 *
 * AI-powered component tree generation using Claude.
 */

export { AIClient, createAIClient, type GenerationResult, type AIClientOptions } from './client.js';
export { parseComponentTree, validateComponentTree, type ParseResult } from './parser.js';
export { SYSTEM_PROMPT, generateCreationPrompt, generateModificationPrompt } from './prompts/system.js';
