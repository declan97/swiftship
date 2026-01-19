import React from 'react';
import type { ComponentNode } from '@swiftship/core';

// Import all iOS components
import { IOSText, IOSButton, IOSIcon, IOSSpacer, IOSDivider } from './components/primitives.js';
import { IOSVStack, IOSHStack, IOSZStack, IOSScrollView, IOSList, IOSGrid, IOSSection } from './components/layout.js';
import { IOSNavigationStack, IOSNavigationLink, IOSTabView, IOSSheet, IOSAlert } from './components/navigation.js';
import { IOSTextField, IOSSecureField, IOSToggle, IOSPicker, IOSSlider, IOSStepper } from './components/input.js';

export interface RendererProps {
  node: ComponentNode;
  isDark?: boolean;
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

/**
 * Renders a ComponentNode tree as iOS-styled React components.
 */
export function ComponentRenderer({ node, isDark = false, onNodeClick, selectedNodeId }: RendererProps) {
  const isSelected = selectedNodeId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick?.(node.id);
  };

  const wrapperStyle: React.CSSProperties = isSelected
    ? {
        outline: '2px solid #007AFF',
        outlineOffset: 2,
        borderRadius: 4,
      }
    : {};

  const renderChildren = () =>
    node.children?.map((child) => (
      <ComponentRenderer
        key={child.id}
        node={child}
        isDark={isDark}
        onNodeClick={onNodeClick}
        selectedNodeId={selectedNodeId}
      />
    ));

  const props = node.props || {};

  // Render based on component type
  const renderComponent = () => {
    switch (node.type) {
      // Primitives
      case 'text':
        return (
          <IOSText
            content={props.content as string}
            font={props.font as any}
            weight={props.weight as any}
            color={props.color as string}
            alignment={props.alignment as any}
            lineLimit={props.lineLimit as number}
            isDark={isDark}
          />
        );

      case 'button':
        return (
          <IOSButton
            label={props.label as string}
            style={props.style as any}
            role={props.role as any}
            icon={props.icon as string}
            iconPosition={props.iconPosition as any}
            isDisabled={props.isDisabled as boolean}
            isLoading={props.isLoading as boolean}
            isDark={isDark}
          />
        );

      case 'icon':
        return (
          <IOSIcon
            name={props.name as string}
            size={props.size as any}
            weight={props.weight as any}
            color={props.color as string}
            isDark={isDark}
          />
        );

      case 'spacer':
        return <IOSSpacer minLength={props.minLength as number} />;

      case 'divider':
        return <IOSDivider isDark={isDark} />;

      case 'image':
        // Simple image placeholder
        return (
          <div
            style={{
              width: (props.width as number) || 100,
              height: (props.height as number) || 100,
              background: isDark ? '#2c2c2e' : '#e5e5ea',
              borderRadius: (props.cornerRadius as number) || 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 32 }}>🖼️</span>
          </div>
        );

      // Layout
      case 'vstack':
        return (
          <IOSVStack alignment={props.alignment as any} spacing={props.spacing as number}>
            {renderChildren()}
          </IOSVStack>
        );

      case 'hstack':
        return (
          <IOSHStack alignment={props.alignment as any} spacing={props.spacing as number}>
            {renderChildren()}
          </IOSHStack>
        );

      case 'zstack':
        return <IOSZStack alignment={props.alignment as any}>{renderChildren()}</IOSZStack>;

      case 'scrollview':
        return (
          <IOSScrollView axes={props.axes as any} showsIndicators={props.showsIndicators as boolean}>
            {renderChildren()}
          </IOSScrollView>
        );

      case 'list':
        return (
          <IOSList style={props.style as any} showsRowSeparators={props.showsRowSeparators as boolean} isDark={isDark}>
            {renderChildren()}
          </IOSList>
        );

      case 'grid':
        return (
          <IOSGrid
            columns={props.columns as number}
            spacing={props.spacing as number}
            columnSpacing={props.columnSpacing as number}
            rowSpacing={props.rowSpacing as number}
          >
            {renderChildren()}
          </IOSGrid>
        );

      case 'section':
        return (
          <IOSSection header={props.header as string} footer={props.footer as string} isDark={isDark}>
            {renderChildren()}
          </IOSSection>
        );

      // Navigation
      case 'navigationstack':
        return (
          <IOSNavigationStack title={props.title as string} isDark={isDark}>
            {renderChildren()}
          </IOSNavigationStack>
        );

      case 'navigationlink':
        return (
          <IOSNavigationLink isDark={isDark}>
            {renderChildren()}
          </IOSNavigationLink>
        );

      case 'tabview':
        return (
          <IOSTabView
            tabs={(props.tabs as any[]) || []}
            selectedIndex={props.selectedIndex as number}
            isDark={isDark}
          >
            {renderChildren()}
          </IOSTabView>
        );

      case 'sheet':
        return (
          <IOSSheet isPresented={props.isPresented as boolean} isDark={isDark}>
            {renderChildren()}
          </IOSSheet>
        );

      case 'alert':
        return (
          <IOSAlert
            title={props.title as string}
            message={props.message as string}
            isPresented={props.isPresented !== false}
            isDark={isDark}
            actions={props.actions as any[]}
          />
        );

      // Input
      case 'textfield':
        return (
          <IOSTextField
            label={props.label as string}
            placeholder={props.placeholder as string}
            value={props.value as string}
            keyboardType={props.keyboardType as any}
            isDark={isDark}
          />
        );

      case 'securefield':
        return (
          <IOSSecureField
            label={props.label as string}
            placeholder={props.placeholder as string}
            value={props.value as string}
            isDark={isDark}
          />
        );

      case 'toggle':
        return (
          <IOSToggle label={props.label as string} isOn={props.isOn as boolean} isDark={isDark} />
        );

      case 'picker':
        return (
          <IOSPicker
            label={props.label as string}
            options={(props.options as any[]) || []}
            selectedValue={props.selectedValue as string}
            isDark={isDark}
          />
        );

      case 'slider':
        return (
          <IOSSlider
            label={props.label as string}
            value={props.value as number}
            min={props.min as number}
            max={props.max as number}
            step={props.step as number}
            isDark={isDark}
          />
        );

      case 'stepper':
        return (
          <IOSStepper
            label={props.label as string}
            value={props.value as number}
            min={props.min as number}
            max={props.max as number}
            step={props.step as number}
            isDark={isDark}
          />
        );

      // Unknown component
      default:
        return (
          <div
            style={{
              padding: 8,
              background: isDark ? '#3a3a3c' : '#ffecb3',
              borderRadius: 4,
              fontSize: 12,
              color: isDark ? '#ffffff' : '#000000',
            }}
          >
            Unknown: {node.type}
            {renderChildren()}
          </div>
        );
    }
  };

  return (
    <div style={wrapperStyle} onClick={handleClick}>
      {renderComponent()}
    </div>
  );
}

export default ComponentRenderer;
