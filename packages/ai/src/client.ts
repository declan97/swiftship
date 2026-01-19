import Anthropic from '@anthropic-ai/sdk';
import type { ComponentNode } from '@swiftship/core';
import { SYSTEM_PROMPT, generateCreationPrompt, generateModificationPrompt } from './prompts/system.js';
import { parseComponentTree } from './parser.js';

export interface GenerationResult {
  success: boolean;
  componentTree?: ComponentNode;
  rawResponse?: string;
  error?: string;
}

export interface AIClientOptions {
  apiKey: string;
  model?: string;
}

/**
 * AI client for generating iOS app component trees.
 */
export class AIClient {
  private client: Anthropic;
  private model: string;

  constructor(options: AIClientOptions) {
    this.client = new Anthropic({
      apiKey: options.apiKey,
    });
    this.model = options.model ?? 'claude-sonnet-4-20250514';
  }

  /**
   * Generate a new component tree from a description.
   */
  async generate(description: string): Promise<GenerationResult> {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: generateCreationPrompt(description),
          },
        ],
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
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Modify an existing component tree based on instructions.
   */
  async modify(currentTree: ComponentNode, instruction: string): Promise<GenerationResult> {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: generateModificationPrompt(currentTree, instruction),
          },
        ],
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
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Chat with context - maintains conversation history.
   */
  async chat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    currentTree?: ComponentNode
  ): Promise<GenerationResult> {
    try {
      // Build the conversation with context
      const contextMessage = currentTree
        ? `Current app structure:\n\`\`\`json\n${JSON.stringify(currentTree, null, 2)}\n\`\`\`\n\n`
        : '';

      const anthropicMessages = messages.map((msg, index) => ({
        role: msg.role as 'user' | 'assistant',
        content:
          index === messages.length - 1 && msg.role === 'user'
            ? contextMessage + msg.content + '\n\nRespond with the updated component tree JSON only.'
            : msg.content,
      }));

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: anthropicMessages,
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
        // If parsing fails, it might be a conversational response
        return {
          success: true,
          rawResponse,
        };
      }

      return {
        success: true,
        componentTree: result.componentTree,
        rawResponse,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Create an AI client with the given API key.
 */
export function createAIClient(apiKey: string, model?: string): AIClient {
  return new AIClient({ apiKey, model });
}
