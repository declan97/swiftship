'use client';

import { useState } from 'react';
import { Smartphone, Moon, Sun, RefreshCw } from 'lucide-react';
import type { ComponentNode } from '@swiftship/core';
import { cn } from '@/lib/utils';

interface PreviewProps {
  componentTree: ComponentNode | null;
  onNodeSelect?: (nodeId: string | null) => void;
  selectedNodeId?: string | null;
}

export function Preview({ componentTree, onNodeSelect, selectedNodeId }: PreviewProps) {
  const [isDark, setIsDark] = useState(false);
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        {componentTree ? (
          <SimulatorPreview
            key={key}
            componentTree={componentTree}
            isDark={isDark}
            onNodeSelect={onNodeSelect}
            selectedNodeId={selectedNodeId}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function SimulatorPreview({
  componentTree,
  isDark,
  onNodeSelect,
  selectedNodeId,
}: {
  componentTree: ComponentNode;
  isDark: boolean;
  onNodeSelect?: (nodeId: string | null) => void;
  selectedNodeId?: string | null;
}) {
  return (
    <div
      style={{
        width: 393 + 24,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        borderRadius: 48,
        padding: 12,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      <div
        style={{
          width: 393,
          height: 852,
          background: isDark ? '#000000' : '#f2f2f7',
          borderRadius: 40,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Status Bar */}
        <StatusBar isDark={isDark} />

        {/* Content */}
        <div
          style={{
            height: 852 - 48 - 34,
            overflow: 'auto',
            background: isDark ? '#000000' : '#f2f2f7',
          }}
        >
          <ComponentPreview
            node={componentTree}
            isDark={isDark}
            onNodeSelect={onNodeSelect}
            selectedNodeId={selectedNodeId}
          />
        </div>

        {/* Home Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 134,
            height: 5,
            background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}

function StatusBar({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? '#ffffff' : '#000000';

  return (
    <div
      style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative',
      }}
    >
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: textColor,
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        9:41
      </span>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 12,
          transform: 'translateX(-50%)',
          width: 126,
          height: 36,
          background: '#000000',
          borderRadius: 18,
        }}
      />
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill={textColor}>
          <rect x="0" y="6" width="3" height="6" rx="1" />
          <rect x="5" y="4" width="3" height="8" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={textColor}>
          <path d="M8 2.4c3.1 0 5.9 1.2 8 3.2l-1.4 1.4C12.8 5.2 10.5 4.2 8 4.2s-4.8 1-6.6 2.8L0 5.6C2.1 3.6 4.9 2.4 8 2.4zm0 3.6c1.9 0 3.6.7 4.9 2l-1.4 1.4C10.5 8.5 9.3 8 8 8s-2.5.5-3.5 1.4L3.1 8c1.3-1.3 3-2 4.9-2zm0 3.6c.9 0 1.8.4 2.4 1l-2.4 2.4-2.4-2.4c.6-.6 1.5-1 2.4-1z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill={textColor}>
          <rect x="0" y="0" width="22" height="12" rx="3" stroke={textColor} strokeWidth="1" fill="none" />
          <rect x="2" y="2" width="17" height="8" rx="1" />
          <path d="M23 4v4a2 2 0 0 0 0-4z" />
        </svg>
      </div>
    </div>
  );
}

function ComponentPreview({
  node,
  isDark,
  onNodeSelect,
  selectedNodeId,
}: {
  node: ComponentNode;
  isDark: boolean;
  onNodeSelect?: (nodeId: string | null) => void;
  selectedNodeId?: string | null;
}) {
  const isSelected = selectedNodeId === node.id;
  const props = node.props || {};

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeSelect?.(node.id);
  };

  const wrapperStyle: React.CSSProperties = isSelected
    ? { outline: '2px solid #007AFF', outlineOffset: 2, borderRadius: 4 }
    : {};

  const renderChildren = () =>
    node.children?.map((child) => (
      <ComponentPreview
        key={child.id}
        node={child}
        isDark={isDark}
        onNodeSelect={onNodeSelect}
        selectedNodeId={selectedNodeId}
      />
    ));

  const content = renderComponentContent(node, isDark, renderChildren);

  return (
    <div style={wrapperStyle} onClick={handleClick}>
      {content}
    </div>
  );
}

function renderComponentContent(
  node: ComponentNode,
  isDark: boolean,
  renderChildren: () => React.ReactNode
): React.ReactNode {
  const props = node.props || {};
  const textColor = isDark ? '#ffffff' : '#000000';
  const secondaryColor = isDark ? '#8e8e93' : '#6d6d72';

  switch (node.type) {
    case 'text':
      return (
        <span
          style={{
            fontSize: getFontSize(props.font as string),
            fontWeight: getFontWeight(props.weight as string),
            color: props.color ? String(props.color) : textColor,
            display: 'block',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {props.content as string}
        </span>
      );

    case 'button':
      return (
        <button
          style={{
            background: props.style === 'borderedProminent' ? '#007AFF' : 'transparent',
            color: props.style === 'borderedProminent' ? '#ffffff' : '#007AFF',
            padding: '12px 20px',
            borderRadius: 12,
            border: props.style === 'bordered' ? '1px solid #007AFF' : 'none',
            fontSize: 17,
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {props.label as string}
        </button>
      );

    case 'icon':
      return (
        <span
          style={{
            fontSize: getIconSize(props.size as string),
            color: props.color ? String(props.color) : '#007AFF',
          }}
        >
          {getIconSymbol(props.name as string)}
        </span>
      );

    case 'spacer':
      return <div style={{ flex: 1, minHeight: props.minLength as number }} />;

    case 'divider':
      return (
        <hr
          style={{
            border: 'none',
            height: 0.5,
            background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
            margin: '8px 0',
          }}
        />
      );

    case 'vstack':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems:
              props.alignment === 'leading'
                ? 'flex-start'
                : props.alignment === 'trailing'
                  ? 'flex-end'
                  : 'center',
            gap: (props.spacing as number) || 8,
          }}
        >
          {renderChildren()}
        </div>
      );

    case 'hstack':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems:
              props.alignment === 'top'
                ? 'flex-start'
                : props.alignment === 'bottom'
                  ? 'flex-end'
                  : 'center',
            gap: (props.spacing as number) || 8,
          }}
        >
          {renderChildren()}
        </div>
      );

    case 'zstack':
      return (
        <div style={{ position: 'relative' }}>
          {renderChildren()}
        </div>
      );

    case 'scrollview':
      return (
        <div style={{ overflow: 'auto', flex: 1 }}>
          {renderChildren()}
        </div>
      );

    case 'list':
      return (
        <div
          style={{
            background: isDark ? '#1c1c1e' : '#ffffff',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {renderChildren()}
        </div>
      );

    case 'section':
      return (
        <div style={{ marginBottom: 20 }}>
          {props.header && (
            <div
              style={{
                padding: '8px 16px',
                fontSize: 13,
                color: secondaryColor,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {props.header as string}
            </div>
          )}
          <div
            style={{
              background: isDark ? '#1c1c1e' : '#ffffff',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {renderChildren()}
          </div>
        </div>
      );

    case 'navigationstack':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {props.title && (
            <div
              style={{
                padding: '12px 16px',
                borderBottom: `0.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 34,
                  fontWeight: 700,
                  color: textColor,
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {props.title as string}
              </h1>
            </div>
          )}
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
            {renderChildren()}
          </div>
        </div>
      );

    case 'navigationlink':
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: isDark ? '#1c1c1e' : '#ffffff',
            borderBottom: `0.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <div style={{ flex: 1 }}>{renderChildren()}</div>
          <span style={{ color: isDark ? '#48484a' : '#c7c7cc', fontSize: 18 }}>›</span>
        </div>
      );

    default:
      return (
        <div
          style={{
            padding: 8,
            background: isDark ? '#3a3a3c' : '#ffecb3',
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          Unknown: {node.type}
          {renderChildren()}
        </div>
      );
  }
}

function EmptyState() {
  return (
    <div className="text-center text-muted-foreground">
      <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p className="text-sm">No preview available</p>
      <p className="text-xs mt-1">Use the chat to generate your app</p>
    </div>
  );
}

function getFontSize(font: string): number {
  const sizes: Record<string, number> = {
    largeTitle: 34,
    title: 28,
    title2: 22,
    title3: 20,
    headline: 17,
    body: 17,
    callout: 16,
    subheadline: 15,
    footnote: 13,
    caption: 12,
    caption2: 11,
  };
  return sizes[font] || 17;
}

function getFontWeight(weight: string): number {
  const weights: Record<string, number> = {
    ultraLight: 100,
    thin: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
    black: 900,
  };
  return weights[weight] || 400;
}

function getIconSize(size: string): number {
  const sizes: Record<string, number> = {
    small: 16,
    medium: 22,
    large: 28,
    extraLarge: 44,
  };
  return sizes[size] || 22;
}

function getIconSymbol(name: string): string {
  const symbols: Record<string, string> = {
    'person.circle': '👤',
    'person.circle.fill': '👤',
    gear: '⚙️',
    star: '⭐',
    'star.fill': '⭐',
    heart: '❤️',
    'heart.fill': '❤️',
    plus: '+',
    'plus.circle': '⊕',
    'plus.circle.fill': '⊕',
    trash: '🗑️',
    checkmark: '✓',
    'checkmark.circle.fill': '✓',
    xmark: '✕',
    magnifyingglass: '🔍',
    house: '🏠',
    'house.fill': '🏠',
    bell: '🔔',
    envelope: '✉️',
    'list.bullet': '☰',
    'doc.text': '📄',
    folder: '📁',
    clock: '🕐',
    calendar: '📅',
    location: '📍',
    bookmark: '🔖',
    lock: '🔒',
    cart: '🛒',
  };
  return symbols[name] || '●';
}
