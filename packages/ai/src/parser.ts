import { z } from 'zod';
import type { ComponentNode } from '@swiftship/core';

/**
 * Schema for validating component trees from AI responses.
 * More lenient than the core schema to handle AI variations.
 */
const ComponentNodeSchema: z.ZodType<ComponentNode, z.ZodTypeDef, unknown> = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.unknown()).default({}),
  children: z.array(z.lazy(() => ComponentNodeSchema)).optional(),
  bindings: z
    .array(
      z.object({
        property: z.string(),
        source: z.enum(['state', 'environment', 'parameter']),
        path: z.string(),
      })
    )
    .optional(),
  modifiers: z
    .array(
      z.object({
        name: z.string(),
        arguments: z.array(z.unknown()).optional(),
      })
    )
    .optional(),
}) as z.ZodType<ComponentNode, z.ZodTypeDef, unknown>;

export interface ParseResult {
  success: boolean;
  componentTree?: ComponentNode;
  error?: string;
}

/**
 * Extract JSON from AI response that may contain markdown or extra text.
 */
function extractJSON(text: string): string {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find raw JSON (object starting with {)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  // Return original text as last resort
  return text.trim();
}

/**
 * Generate a UUID v4.
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Ensure all nodes have valid UUIDs.
 */
function ensureUUIDs(node: ComponentNode): ComponentNode {
  const id = node.id && node.id.match(/^[0-9a-f-]{36}$/i) ? node.id : generateUUID();

  return {
    ...node,
    id,
    children: node.children?.map(ensureUUIDs),
  };
}

/**
 * Parse and validate a component tree from AI response text.
 */
export function parseComponentTree(text: string): ParseResult {
  try {
    // Extract JSON from response
    const jsonText = extractJSON(text);

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return {
        success: false,
        error: `Invalid JSON: ${jsonText.substring(0, 100)}...`,
      };
    }

    // Validate against schema
    const result = ComponentNodeSchema.safeParse(parsed);
    if (!result.success) {
      return {
        success: false,
        error: `Validation error: ${result.error.message}`,
      };
    }

    // Ensure all nodes have valid UUIDs
    const componentTree = ensureUUIDs(result.data);

    return {
      success: true,
      componentTree,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

/**
 * Validate a component tree without parsing from text.
 */
export function validateComponentTree(tree: unknown): ParseResult {
  const result = ComponentNodeSchema.safeParse(tree);
  if (!result.success) {
    return {
      success: false,
      error: `Validation error: ${result.error.message}`,
    };
  }

  return {
    success: true,
    componentTree: ensureUUIDs(result.data),
  };
}
