import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { generateViewFile } from '@swiftship/codegen';
import type { ComponentNode } from '@swiftship/core';

// System prompt for Claude
const SYSTEM_PROMPT = `You are an expert iOS developer and SwiftUI specialist. Your task is to generate component trees that represent native iOS apps.

## Component Library
You MUST only use components from this catalog:

### Primitives
- **text**: Display text with font, weight, color, alignment, lineLimit
  - fonts: largeTitle, title, title2, title3, headline, body, callout, subheadline, footnote, caption, caption2
  - weights: ultraLight, thin, light, regular, medium, semibold, bold, heavy, black
- **button**: Tappable control with label, style (bordered/borderedProminent/borderless/plain), role (none/cancel/destructive)
- **icon**: SF Symbol with name, size (small/medium/large/extraLarge), color
- **spacer**: Flexible space with optional minLength
- **divider**: Visual separator line

### Layout
- **vstack**: Vertical stack with alignment (leading/center/trailing) and spacing
- **hstack**: Horizontal stack with alignment (top/center/bottom) and spacing
- **scrollview**: Scrollable container with axes (vertical/horizontal/both)
- **list**: Scrollable list with style (automatic/plain/grouped/insetGrouped)
- **section**: List section with optional header/footer strings

### Navigation
- **navigationstack**: Navigation container with title

## Output Format
Respond with ONLY valid JSON. No markdown, no explanation, just the component tree.

The structure MUST follow this exact schema:
{
  "id": "uuid-string",
  "type": "component-type",
  "props": { ... component-specific props ... },
  "children": [ ... nested components ... ]
}

## Rules
1. ALWAYS start with a layout container (vstack, navigationstack, list)
2. Generate valid UUID v4 strings for every "id" field
3. Use iOS design patterns: proper spacing (8, 16, 20), semantic colors
4. Use SF Symbols for icons (e.g., "plus", "trash", "gear", "person.circle")`;

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function ensureUUIDs(node: any): any {
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

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentTree } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return mock data for development without API key
      return NextResponse.json({
        componentTree: getMockComponentTree(prompt),
        generatedCode: '// Mock code - set ANTHROPIC_API_KEY to enable AI generation',
        message: "I've created a basic layout for your app. (Mock mode - no API key)",
      });
    }

    const client = new Anthropic({ apiKey });

    // Build the prompt
    let userPrompt = '';
    if (currentTree) {
      userPrompt = `The user wants to modify an existing iOS app. Here is the current component tree:

\`\`\`json
${JSON.stringify(currentTree, null, 2)}
\`\`\`

User's modification request: "${prompt}"

Generate the complete updated component tree with the requested changes. Return ONLY the JSON, no explanation.`;
    } else {
      userPrompt = `Create an iOS app component tree based on this description:

"${prompt}"

Generate a complete component tree that implements this app. Return ONLY the JSON, no explanation.`;
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
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
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Mock component tree for development without API key
function getMockComponentTree(prompt: string): ComponentNode {
  const lowerPrompt = prompt.toLowerCase();

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
                    { id: generateUUID(), type: 'icon', props: { name: 'circle', size: 'medium', color: '#007AFF' } },
                    { id: generateUUID(), type: 'text', props: { content: 'Buy groceries', font: 'body' } },
                  ],
                },
                {
                  id: generateUUID(),
                  type: 'hstack',
                  props: { spacing: 12 },
                  children: [
                    { id: generateUUID(), type: 'icon', props: { name: 'checkmark.circle.fill', size: 'medium', color: '#34C759' } },
                    { id: generateUUID(), type: 'text', props: { content: 'Walk the dog', font: 'body', color: 'secondaryLabel' } },
                  ],
                },
                {
                  id: generateUUID(),
                  type: 'hstack',
                  props: { spacing: 12 },
                  children: [
                    { id: generateUUID(), type: 'icon', props: { name: 'circle', size: 'medium', color: '#007AFF' } },
                    { id: generateUUID(), type: 'text', props: { content: 'Finish project', font: 'body' } },
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
          { id: generateUUID(), type: 'icon', props: { name: 'person.circle.fill', size: 'extraLarge', color: '#007AFF' } },
          { id: generateUUID(), type: 'text', props: { content: 'John Doe', font: 'title', weight: 'bold' } },
          { id: generateUUID(), type: 'text', props: { content: 'john@example.com', font: 'subheadline', color: 'secondaryLabel' } },
          { id: generateUUID(), type: 'button', props: { label: 'Edit Profile', style: 'bordered' } },
        ],
      },
    ],
  };
}
