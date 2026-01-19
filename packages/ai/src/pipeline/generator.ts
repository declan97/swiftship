/**
 * Context-aware design generation pipeline.
 * 2-stage pipeline: Structure+Style → Polish+Variations
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ComponentNode } from '@swiftship/core';
import type { DesignContext } from '../context/design-context.js';
import { formatDesignContextForPrompt } from '../context/design-context.js';
import { parseComponentTree } from '../parser.js';

export interface GenerationOptions {
  /** User's app description/prompt */
  prompt: string;
  /** Design context with style, colors, typography */
  designContext: DesignContext;
  /** Current component tree (for modifications) */
  currentTree?: ComponentNode;
  /** Model to use */
  model?: string;
  /** Max tokens for response */
  maxTokens?: number;
}

export interface GenerationResult {
  success: boolean;
  componentTree?: ComponentNode;
  rawResponse?: string;
  error?: string;
  /** Generation metadata */
  metadata?: {
    model: string;
    styleId: string;
    inputTokens?: number;
    outputTokens?: number;
  };
}

/**
 * Build the enhanced system prompt with design context
 */
export function buildEnhancedSystemPrompt(
  basePrompt: string,
  designContext: DesignContext
): string {
  const contextSection = formatDesignContextForPrompt(designContext);

  return `${basePrompt}

${contextSection}

## Additional Design Requirements

Based on the design context above:
1. Use ONLY the colors from the provided palette
2. Follow the typography scale and font recommendations
3. Use spacing values from the provided scale
4. Adhere to the style characteristics listed
5. Avoid ALL patterns in the anti-pattern list
6. Create a distinctive, memorable design - not generic "AI slop"

Remember: You're creating a ${designContext.style.name} style interface.
This means: ${designContext.style.characteristics.slice(0, 3).join(', ')}.`;
}

/**
 * Build the user prompt for initial generation
 */
export function buildCreationPrompt(
  description: string,
  designContext: DesignContext
): string {
  return `Create an iOS app component tree based on this description:

"${description}"

Design Style: ${designContext.style.name}
Key Visual Traits:
${designContext.style.characteristics.map((c) => `- ${c}`).join('\n')}

Generate a complete component tree that:
1. Implements the requested functionality
2. Uses the ${designContext.style.name} visual style
3. Follows iOS HIG guidelines
4. Has distinctive, memorable design choices

Return ONLY valid JSON, no explanation.`;
}

/**
 * Build the user prompt for modifications
 */
export function buildModificationPrompt(
  instruction: string,
  currentTree: ComponentNode,
  designContext: DesignContext
): string {
  return `Modify this iOS app component tree:

Current structure:
\`\`\`json
${JSON.stringify(currentTree, null, 2)}
\`\`\`

User's modification request: "${instruction}"

Design Style: ${designContext.style.name}
Maintain the visual consistency with:
${designContext.style.characteristics.slice(0, 3).map((c) => `- ${c}`).join('\n')}

Generate the complete updated component tree with changes.
Return ONLY valid JSON, no explanation.`;
}

/**
 * Context-aware design generator
 */
export class ContextAwareGenerator {
  private client: Anthropic;
  private model: string;
  private baseSystemPrompt: string;

  constructor(options: {
    apiKey: string;
    model?: string;
    baseSystemPrompt: string;
  }) {
    this.client = new Anthropic({ apiKey: options.apiKey });
    this.model = options.model ?? 'claude-sonnet-4-20250514';
    this.baseSystemPrompt = options.baseSystemPrompt;
  }

  /**
   * Generate a new component tree with design context
   */
  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const { prompt, designContext, maxTokens = 4096 } = options;

    try {
      const systemPrompt = buildEnhancedSystemPrompt(
        this.baseSystemPrompt,
        designContext
      );

      const userPrompt = options.currentTree
        ? buildModificationPrompt(prompt, options.currentTree, designContext)
        : buildCreationPrompt(prompt, designContext);

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        return {
          success: false,
          error: 'Unexpected response type from AI',
        };
      }

      const rawResponse = content.text;
      const result = parseComponentTree(rawResponse);

      if (!result.success) {
        return {
          success: false,
          rawResponse,
          error: result.error,
        };
      }

      return {
        success: true,
        componentTree: result.componentTree,
        rawResponse,
        metadata: {
          model: this.model,
          styleId: designContext.style.id,
          inputTokens: message.usage?.input_tokens,
          outputTokens: message.usage?.output_tokens,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate with streaming response
   */
  async *generateStream(
    options: GenerationOptions
  ): AsyncGenerator<StreamChunk, GenerationResult> {
    const { prompt, designContext, maxTokens = 4096 } = options;

    const systemPrompt = buildEnhancedSystemPrompt(
      this.baseSystemPrompt,
      designContext
    );

    const userPrompt = options.currentTree
      ? buildModificationPrompt(prompt, options.currentTree, designContext)
      : buildCreationPrompt(prompt, designContext);

    let rawResponse = '';

    try {
      const stream = await this.client.messages.stream({
        model: this.model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          const text = event.delta.text;
          rawResponse += text;
          yield { type: 'text', text };
        }
      }

      // Parse final response
      const result = parseComponentTree(rawResponse);

      if (!result.success) {
        return {
          success: false,
          rawResponse,
          error: result.error,
        };
      }

      yield { type: 'complete', componentTree: result.componentTree };

      return {
        success: true,
        componentTree: result.componentTree,
        rawResponse,
        metadata: {
          model: this.model,
          styleId: designContext.style.id,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export interface StreamChunk {
  type: 'text' | 'complete' | 'error';
  text?: string;
  componentTree?: ComponentNode;
  error?: string;
}

/**
 * Create a mock generator for testing without API key
 */
export function createMockGenerator(): {
  generate: (options: GenerationOptions) => Promise<GenerationResult>;
} {
  return {
    async generate(options: GenerationOptions): Promise<GenerationResult> {
      // Return a simple mock component tree
      const mockTree: ComponentNode = {
        id: crypto.randomUUID(),
        type: 'navigationstack',
        props: { title: 'Mock App' },
        children: [
          {
            id: crypto.randomUUID(),
            type: 'vstack',
            props: { alignment: 'center', spacing: 20 },
            children: [
              {
                id: crypto.randomUUID(),
                type: 'text',
                props: {
                  content: `Mock: ${options.prompt.slice(0, 50)}...`,
                  font: 'title',
                  weight: 'bold',
                },
              },
              {
                id: crypto.randomUUID(),
                type: 'text',
                props: {
                  content: `Style: ${options.designContext.style.name}`,
                  font: 'body',
                  color: 'secondaryLabel',
                },
              },
            ],
          },
        ],
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        componentTree: mockTree,
        rawResponse: JSON.stringify(mockTree, null, 2),
        metadata: {
          model: 'mock',
          styleId: options.designContext.style.id,
        },
      };
    },
  };
}
