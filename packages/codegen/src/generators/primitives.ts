/**
 * Generators for primitive components.
 *
 * Each generator takes a component node and produces Swift AST nodes.
 */

import type { ComponentNode } from '@swiftship/core';
import type { TextProps, ButtonProps, ImageProps, IconProps } from '@swiftship/components';
import type { ViewBuilderExpr, ModifierCall, FunctionArgument, SwiftNode } from '../ast/types';

/**
 * Generate Swift AST for a Text component.
 */
export function generateText(node: ComponentNode): ViewBuilderExpr {
  const props = node.props as TextProps;
  const modifiers: ModifierCall[] = [];

  // Font modifier
  if (props.font && props.font !== 'body') {
    modifiers.push({
      name: 'font',
      arguments: [{ value: { kind: 'member-access', base: null, member: props.font } }],
    });
  }

  // Font weight
  if (props.weight) {
    modifiers.push({
      name: 'fontWeight',
      arguments: [{ value: { kind: 'member-access', base: null, member: props.weight } }],
    });
  }

  // Color
  if (props.color) {
    modifiers.push({
      name: 'foregroundStyle',
      arguments: [{ value: parseColor(props.color) }],
    });
  }

  // Alignment
  if (props.alignment) {
    modifiers.push({
      name: 'multilineTextAlignment',
      arguments: [{ value: { kind: 'member-access', base: null, member: props.alignment } }],
    });
  }

  // Line limit
  if (props.lineLimit) {
    modifiers.push({
      name: 'lineLimit',
      arguments: [{ value: { kind: 'int-literal', value: props.lineLimit } }],
    });
  }

  return {
    kind: 'view-builder',
    viewName: 'Text',
    arguments: [{ value: { kind: 'string-literal', value: props.content } }],
    modifiers,
  };
}

/**
 * Generate Swift AST for a Button component.
 */
export function generateButton(node: ComponentNode): ViewBuilderExpr {
  const props = node.props as ButtonProps;
  const modifiers: ModifierCall[] = [];

  // Button style
  if (props.style && props.style !== 'borderedProminent') {
    modifiers.push({
      name: 'buttonStyle',
      arguments: [{ value: { kind: 'member-access', base: null, member: props.style } }],
    });
  }

  // Disabled state
  if (props.isDisabled) {
    modifiers.push({
      name: 'disabled',
      arguments: [{ value: { kind: 'bool-literal', value: true } }],
    });
  }

  // Build the label content
  let labelContent: SwiftNode[];
  if (props.icon) {
    // Label with icon and text
    labelContent = [
      {
        kind: 'view-builder',
        viewName: 'Label',
        arguments: [
          { value: { kind: 'string-literal', value: props.label } },
          { label: 'systemImage', value: { kind: 'string-literal', value: props.icon } },
        ],
      } as ViewBuilderExpr,
    ];
  } else {
    // Text only
    labelContent = [
      {
        kind: 'view-builder',
        viewName: 'Text',
        arguments: [{ value: { kind: 'string-literal', value: props.label } }],
      } as ViewBuilderExpr,
    ];
  }

  // Build button arguments
  const buttonArgs: FunctionArgument[] = [];
  if (props.role && props.role !== 'none') {
    buttonArgs.push({
      label: 'role',
      value: { kind: 'member-access', base: null, member: props.role },
    });
  }

  return {
    kind: 'view-builder',
    viewName: 'Button',
    arguments: buttonArgs,
    trailingClosure: [
      // Action closure would go here (placeholder for now)
      { kind: 'function-call', name: '// TODO: Add action', arguments: [] },
    ],
    modifiers,
  };
}

/**
 * Generate Swift AST for an Image component.
 */
export function generateImage(node: ComponentNode): ViewBuilderExpr {
  const props = node.props as ImageProps;
  const modifiers: ModifierCall[] = [];

  // Content mode
  modifiers.push({
    name: props.contentMode === 'fill' ? 'scaledToFill' : 'scaledToFit',
  });

  // Corner radius
  if (props.cornerRadius && props.cornerRadius > 0) {
    modifiers.push({
      name: 'clipShape',
      arguments: [
        {
          value: {
            kind: 'function-call',
            name: 'RoundedRectangle',
            arguments: [{ label: 'cornerRadius', value: { kind: 'int-literal', value: props.cornerRadius } }],
          },
        },
      ],
    });
  }

  // Size constraints
  if (props.width || props.height) {
    const frameArgs: FunctionArgument[] = [];
    if (props.width) {
      frameArgs.push({ label: 'width', value: { kind: 'int-literal', value: props.width } });
    }
    if (props.height) {
      frameArgs.push({ label: 'height', value: { kind: 'int-literal', value: props.height } });
    }
    modifiers.push({ name: 'frame', arguments: frameArgs });
  }

  // Build based on source type
  if (props.source.type === 'system') {
    return {
      kind: 'view-builder',
      viewName: 'Image',
      arguments: [{ label: 'systemName', value: { kind: 'string-literal', value: props.source.name } }],
      modifiers,
    };
  } else if (props.source.type === 'asset') {
    return {
      kind: 'view-builder',
      viewName: 'Image',
      arguments: [{ value: { kind: 'string-literal', value: props.source.name } }],
      modifiers,
    };
  } else {
    // URL - use AsyncImage
    return {
      kind: 'view-builder',
      viewName: 'AsyncImage',
      arguments: [
        {
          label: 'url',
          value: {
            kind: 'function-call',
            name: 'URL',
            arguments: [{ label: 'string', value: { kind: 'string-literal', value: props.source.url } }],
          },
        },
      ],
      modifiers,
    };
  }
}

/**
 * Generate Swift AST for an Icon (SF Symbol) component.
 */
export function generateIcon(node: ComponentNode): ViewBuilderExpr {
  const props = node.props as IconProps;
  const modifiers: ModifierCall[] = [];

  // Size mapping
  const sizeMap: Record<string, number> = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48,
  };

  // Font size based on size prop
  const fontSize = sizeMap[props.size] || 24;
  modifiers.push({
    name: 'font',
    arguments: [
      {
        value: {
          kind: 'function-call',
          name: '.system',
          arguments: [{ label: 'size', value: { kind: 'int-literal', value: fontSize } }],
        },
      },
    ],
  });

  // Font weight
  if (props.weight && props.weight !== 'regular') {
    modifiers.push({
      name: 'fontWeight',
      arguments: [{ value: { kind: 'member-access', base: null, member: props.weight } }],
    });
  }

  // Color
  if (props.color) {
    modifiers.push({
      name: 'foregroundStyle',
      arguments: [{ value: parseColor(props.color) }],
    });
  }

  // Symbol rendering mode
  if (props.renderingMode && props.renderingMode !== 'monochrome') {
    modifiers.push({
      name: 'symbolRenderingMode',
      arguments: [{ value: { kind: 'member-access', base: null, member: props.renderingMode } }],
    });
  }

  return {
    kind: 'view-builder',
    viewName: 'Image',
    arguments: [{ label: 'systemName', value: { kind: 'string-literal', value: props.name } }],
    modifiers,
  };
}

/**
 * Generate Swift AST for a Spacer component.
 */
export function generateSpacer(node: ComponentNode): ViewBuilderExpr {
  const props = node.props as { minLength?: number };
  const modifiers: ModifierCall[] = [];

  if (props.minLength) {
    modifiers.push({
      name: 'frame',
      arguments: [{ label: 'minHeight', value: { kind: 'int-literal', value: props.minLength } }],
    });
  }

  return {
    kind: 'view-builder',
    viewName: 'Spacer',
    modifiers,
  };
}

/**
 * Generate Swift AST for a Divider component.
 */
export function generateDivider(): ViewBuilderExpr {
  return {
    kind: 'view-builder',
    viewName: 'Divider',
  };
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Parse a color string to Swift AST.
 * Supports: hex (#RRGGBB), semantic names (primary, secondary, etc.)
 */
function parseColor(color: string): SwiftNode {
  // Semantic colors
  const semanticColors = ['primary', 'secondary', 'accentColor', 'red', 'green', 'blue', 'orange', 'yellow', 'pink', 'purple', 'gray', 'white', 'black'];

  if (semanticColors.includes(color)) {
    return { kind: 'member-access', base: null, member: color };
  }

  // Hex color
  if (color.startsWith('#')) {
    // Convert to Color(hex:) initializer
    return {
      kind: 'function-call',
      name: 'Color',
      arguments: [{ label: 'hex', value: { kind: 'string-literal', value: color } }],
    };
  }

  // Default to identifier
  return { kind: 'identifier', name: color };
}
