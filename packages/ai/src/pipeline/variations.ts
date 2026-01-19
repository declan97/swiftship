/**
 * Parallel design variation generation.
 * Generates multiple design options simultaneously.
 */

import type { ComponentNode } from '@swiftship/core';
import type { DesignContext } from '../context/design-context.js';
import { buildDesignContext } from '../context/design-context.js';
import { getAvailableStyles } from '../context/styles.js';
import type { GenerationOptions, GenerationResult } from './generator.js';

export interface VariationConfig {
  /** Unique identifier for this variation */
  id: string;
  /** Display name for the variation */
  name: string;
  /** Design context to use */
  designContext: DesignContext;
  /** Optional prompt modifier */
  promptModifier?: string;
}

export interface VariationResult {
  config: VariationConfig;
  result: GenerationResult;
  /** Generation time in milliseconds */
  generationTime: number;
}

export interface VariationGeneratorOptions {
  /** Base prompt from user */
  basePrompt: string;
  /** Current tree for modifications */
  currentTree?: ComponentNode;
  /** Style variations to generate */
  variations: VariationConfig[];
  /** Generator function */
  generator: (options: GenerationOptions) => Promise<GenerationResult>;
  /** Maximum concurrent generations */
  concurrency?: number;
  /** Callback for progress updates */
  onProgress?: (completed: number, total: number) => void;
}

/**
 * Generate multiple design variations in parallel
 */
export async function generateVariations(
  options: VariationGeneratorOptions
): Promise<VariationResult[]> {
  const {
    basePrompt,
    currentTree,
    variations,
    generator,
    concurrency = 3,
    onProgress,
  } = options;

  const results: VariationResult[] = [];
  let completed = 0;

  // Process in batches based on concurrency
  for (let i = 0; i < variations.length; i += concurrency) {
    const batch = variations.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(async (config) => {
        const startTime = Date.now();

        // Apply prompt modifier if provided
        const prompt = config.promptModifier
          ? `${basePrompt}\n\nAdditional requirement: ${config.promptModifier}`
          : basePrompt;

        const result = await generator({
          prompt,
          designContext: config.designContext,
          currentTree,
        });

        const generationTime = Date.now() - startTime;
        completed++;
        onProgress?.(completed, variations.length);

        return {
          config,
          result,
          generationTime,
        };
      })
    );

    results.push(...batchResults);
  }

  return results;
}

/**
 * Create variation configs for different style presets
 */
export function createStyleVariations(
  styleIds?: string[]
): VariationConfig[] {
  const ids = styleIds ?? getAvailableStyles().slice(0, 3);

  return ids.map((styleId) => {
    const context = buildDesignContext({ styleId });
    return {
      id: `style-${styleId}`,
      name: context.style.name,
      designContext: context,
    };
  });
}

/**
 * Create variation configs for light/dark modes
 */
export function createThemeVariations(
  baseStyleId: string
): VariationConfig[] {
  const lightContext = buildDesignContext({ styleId: baseStyleId });

  // For dark mode, we'll note this in the context
  // The actual dark mode colors would be handled by the token system
  const darkContext = buildDesignContext({
    styleId: baseStyleId,
    emphasis: ['Use dark mode color scheme', 'Dark background with light text'],
  });

  return [
    {
      id: 'theme-light',
      name: `${lightContext.style.name} (Light)`,
      designContext: lightContext,
    },
    {
      id: 'theme-dark',
      name: `${lightContext.style.name} (Dark)`,
      designContext: darkContext,
      promptModifier: 'Use a dark color scheme with a dark background and light text',
    },
  ];
}

/**
 * Create variation configs for different color schemes
 */
export function createColorVariations(
  baseStyleId: string,
  colors: Array<{ name: string; primary: string; accent?: string }>
): VariationConfig[] {
  return colors.map((color) => {
    const context = buildDesignContext({
      styleId: baseStyleId,
      brandColors: {
        primary: color.primary,
        accent: color.accent,
      },
    });

    return {
      id: `color-${color.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: color.name,
      designContext: context,
    };
  });
}

/**
 * Create a set of diverse variations for exploration
 */
export function createExplorationVariations(
  basePrompt: string
): VariationConfig[] {
  // Select diverse styles
  const diverseStyles = ['editorial', 'glassmorphism', 'neoBrutalism'];

  return diverseStyles.map((styleId) => {
    const context = buildDesignContext({ styleId });
    return {
      id: `explore-${styleId}`,
      name: context.style.name,
      designContext: context,
      promptModifier: getStyleGuidance(styleId),
    };
  });
}

/**
 * Get style-specific guidance for the AI
 */
function getStyleGuidance(styleId: string): string {
  const guidance: Record<string, string> = {
    editorial:
      'Emphasize typography hierarchy with generous whitespace. Use a serif font for display text.',
    glassmorphism:
      'Create depth with translucent surfaces and soft shadows. Use frosted glass effects.',
    swiss:
      'Use a strict grid layout with bold sans-serif typography. Limit colors to black, white, and one accent.',
    neoBrutalism:
      'Create bold, raw aesthetic with hard shadows and bright colors. Use thick borders and offset elements.',
    darkInterface:
      'Design for dark mode with subtle gradients and neon accent colors. Create depth through elevation.',
    organic:
      'Use soft, rounded shapes with earthy colors. Create an inviting, natural feel.',
  };

  return guidance[styleId] ?? '';
}

/**
 * Select the best variation from results based on criteria
 */
export function selectBestVariation(
  results: VariationResult[],
  criteria: 'fastest' | 'first-success' | 'preferred-style',
  preferredStyleId?: string
): VariationResult | null {
  const successful = results.filter((r) => r.result.success);

  if (successful.length === 0) return null;

  switch (criteria) {
    case 'fastest':
      return successful.reduce((best, current) =>
        current.generationTime < best.generationTime ? current : best
      );

    case 'first-success':
      return successful[0];

    case 'preferred-style':
      if (preferredStyleId) {
        const preferred = successful.find(
          (r) => r.config.designContext.style.id === preferredStyleId
        );
        if (preferred) return preferred;
      }
      return successful[0];

    default:
      return successful[0];
  }
}

/**
 * Compare two component trees for structural differences
 */
export function compareTreeStructures(
  tree1: ComponentNode,
  tree2: ComponentNode
): {
  sameStructure: boolean;
  differences: string[];
} {
  const differences: string[] = [];

  function compare(
    node1: ComponentNode | undefined,
    node2: ComponentNode | undefined,
    path: string
  ): void {
    if (!node1 && !node2) return;

    if (!node1) {
      differences.push(`${path}: missing in first tree`);
      return;
    }

    if (!node2) {
      differences.push(`${path}: missing in second tree`);
      return;
    }

    if (node1.type !== node2.type) {
      differences.push(`${path}: type differs (${node1.type} vs ${node2.type})`);
    }

    const children1 = node1.children ?? [];
    const children2 = node2.children ?? [];

    if (children1.length !== children2.length) {
      differences.push(
        `${path}: child count differs (${children1.length} vs ${children2.length})`
      );
    }

    const maxChildren = Math.max(children1.length, children2.length);
    for (let i = 0; i < maxChildren; i++) {
      compare(children1[i], children2[i], `${path}[${i}]`);
    }
  }

  compare(tree1, tree2, 'root');

  return {
    sameStructure: differences.length === 0,
    differences,
  };
}
