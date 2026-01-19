import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { generateViewFile } from '@swiftship/codegen';
import type { ComponentNode } from '@swiftship/core';
import {
  SYSTEM_PROMPT,
  buildDesignContext,
  formatDesignContextForPrompt,
  type DesignContextOptions,
} from '@swiftship/ai';

/**
 * Request body for the generate API
 */
interface GenerateRequest {
  prompt: string;
  currentTree?: ComponentNode;
  designContext?: DesignContextOptions;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function ensureUUIDs(node: ComponentNode): ComponentNode {
  const id = node.id && /^[0-9a-f-]{36}$/i.test(node.id) ? node.id : generateUUID();
  return {
    ...node,
    id,
    children: node.children?.map(ensureUUIDs),
  };
}

function extractJSON(text: string): string {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  // Try to find raw JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text.trim();
}

/**
 * Build the enhanced system prompt with design context
 */
function buildEnhancedPrompt(designContextOptions?: DesignContextOptions): string {
  if (!designContextOptions) {
    return SYSTEM_PROMPT;
  }

  const context = buildDesignContext(designContextOptions);
  const contextSection = formatDesignContextForPrompt(context);

  return `${SYSTEM_PROMPT}

${contextSection}`;
}

/**
 * Build the user prompt for generation
 */
function buildUserPrompt(
  prompt: string,
  currentTree?: ComponentNode,
  designContextOptions?: DesignContextOptions
): string {
  const styleName = designContextOptions?.styleId
    ? buildDesignContext(designContextOptions).style.name
    : null;

  if (currentTree) {
    return `The user wants to modify an existing iOS app. Here is the current component tree:

\`\`\`json
${JSON.stringify(currentTree, null, 2)}
\`\`\`

User's modification request: "${prompt}"
${styleName ? `\nMaintain the ${styleName} visual style throughout.` : ''}

Generate the complete updated component tree with the requested changes. Return ONLY the JSON, no explanation.`;
  }

  return `Create an iOS app component tree based on this description:

"${prompt}"
${styleName ? `\nDesign Style: ${styleName}` : ''}

Generate a complete component tree that implements this app. Return ONLY the JSON, no explanation.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, currentTree, designContext } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return mock data for development without API key
      const mockTree = getMockComponentTree(prompt, designContext);
      return NextResponse.json({
        componentTree: mockTree,
        generatedCode: '// Mock code - set ANTHROPIC_API_KEY to enable AI generation',
        message: `I've created a basic layout for your app. (Mock mode - no API key)${designContext?.styleId ? ` Style: ${designContext.styleId}` : ''}`,
        metadata: {
          styleId: designContext?.styleId ?? 'default',
          mock: true,
        },
      });
    }

    const client = new Anthropic({ apiKey });

    // Build prompts with design context
    const systemPrompt = buildEnhancedPrompt(designContext);
    const userPrompt = buildUserPrompt(prompt, currentTree, designContext);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
    }

    // Parse the JSON response
    const jsonText = extractJSON(content.text);
    let componentTree: ComponentNode;

    try {
      componentTree = JSON.parse(jsonText);
      componentTree = ensureUUIDs(componentTree);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response', rawResponse: content.text },
        { status: 500 }
      );
    }

    // Generate Swift code
    let generatedCode = '';
    try {
      generatedCode = generateViewFile('ContentView', componentTree);
    } catch (e) {
      console.error('Code generation error:', e);
      generatedCode = '// Code generation error';
    }

    return NextResponse.json({
      componentTree,
      generatedCode,
      message: "I've updated your app. Check the preview!",
      metadata: {
        styleId: designContext?.styleId ?? 'default',
        inputTokens: message.usage?.input_tokens,
        outputTokens: message.usage?.output_tokens,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Mock component tree for development without API key
 * Now includes style-specific colors based on design context
 */
function getMockComponentTree(
  prompt: string,
  designContext?: DesignContextOptions
): ComponentNode {
  const lowerPrompt = prompt.toLowerCase();

  // Get style-specific colors
  const context = designContext ? buildDesignContext(designContext) : null;
  const primaryColor = context?.style.colorPalette.primary ?? '#007AFF';
  const accentColor = context?.style.colorPalette.accent ?? '#34C759';

  if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
    return {
      id: generateUUID(),
      type: 'navigationstack',
      props: { title: 'Todo List' },
      children: [
        {
          id: generateUUID(),
          type: 'list',
          props: { style: 'insetGrouped' },
          children: [
            {
              id: generateUUID(),
              type: 'section',
              props: { header: 'Tasks' },
              children: [
                {
                  id: generateUUID(),
                  type: 'hstack',
                  props: { spacing: 12 },
                  children: [
                    {
                      id: generateUUID(),
                      type: 'icon',
                      props: { name: 'circle', size: 'medium', color: primaryColor },
                    },
                    {
                      id: generateUUID(),
                      type: 'text',
                      props: { content: 'Buy groceries', font: 'body' },
                    },
                  ],
                },
                {
                  id: generateUUID(),
                  type: 'hstack',
                  props: { spacing: 12 },
                  children: [
                    {
                      id: generateUUID(),
                      type: 'icon',
                      props: { name: 'checkmark.circle.fill', size: 'medium', color: accentColor },
                    },
                    {
                      id: generateUUID(),
                      type: 'text',
                      props: { content: 'Walk the dog', font: 'body', color: 'secondaryLabel' },
                    },
                  ],
                },
                {
                  id: generateUUID(),
                  type: 'hstack',
                  props: { spacing: 12 },
                  children: [
                    {
                      id: generateUUID(),
                      type: 'icon',
                      props: { name: 'circle', size: 'medium', color: primaryColor },
                    },
                    {
                      id: generateUUID(),
                      type: 'text',
                      props: { content: 'Finish project', font: 'body' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: generateUUID(),
          type: 'button',
          props: { label: 'Add Task', style: 'borderedProminent', icon: 'plus' },
        },
      ],
    };
  }

  if (lowerPrompt.includes('note')) {
    return {
      id: generateUUID(),
      type: 'navigationstack',
      props: { title: 'Notes' },
      children: [
        {
          id: generateUUID(),
          type: 'list',
          props: { style: 'plain' },
          children: [
            {
              id: generateUUID(),
              type: 'section',
              props: {},
              children: [
                {
                  id: generateUUID(),
                  type: 'vstack',
                  props: { alignment: 'leading', spacing: 4 },
                  children: [
                    {
                      id: generateUUID(),
                      type: 'text',
                      props: { content: 'Meeting Notes', font: 'headline', weight: 'semibold' },
                    },
                    {
                      id: generateUUID(),
                      type: 'text',
                      props: { content: 'Discussed Q4 roadmap and priorities...', font: 'body', color: 'secondaryLabel', lineLimit: 2 },
                    },
                  ],
                },
                {
                  id: generateUUID(),
                  type: 'vstack',
                  props: { alignment: 'leading', spacing: 4 },
                  children: [
                    {
                      id: generateUUID(),
                      type: 'text',
                      props: { content: 'Shopping List', font: 'headline', weight: 'semibold' },
                    },
                    {
                      id: generateUUID(),
                      type: 'text',
                      props: { content: 'Milk, eggs, bread, coffee...', font: 'body', color: 'secondaryLabel', lineLimit: 2 },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  }

  // Default: simple profile screen
  return {
    id: generateUUID(),
    type: 'navigationstack',
    props: { title: 'Profile' },
    children: [
      {
        id: generateUUID(),
        type: 'vstack',
        props: { alignment: 'center', spacing: 20 },
        children: [
          {
            id: generateUUID(),
            type: 'icon',
            props: { name: 'person.circle.fill', size: 'extraLarge', color: primaryColor },
          },
          {
            id: generateUUID(),
            type: 'text',
            props: { content: 'John Doe', font: 'title', weight: 'bold' },
          },
          {
            id: generateUUID(),
            type: 'text',
            props: { content: 'john@example.com', font: 'subheadline', color: 'secondaryLabel' },
          },
          {
            id: generateUUID(),
            type: 'button',
            props: { label: 'Edit Profile', style: 'bordered' },
          },
        ],
      },
    ],
  };
}
