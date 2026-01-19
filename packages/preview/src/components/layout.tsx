import React from 'react';

// =============================================================================
// VStack Component
// =============================================================================

export interface IOSVStackProps {
  children: React.ReactNode;
  alignment?: 'leading' | 'center' | 'trailing';
  spacing?: number;
}

export function IOSVStack({ children, alignment = 'center', spacing = 8 }: IOSVStackProps) {
  const alignItems = alignment === 'leading' ? 'flex-start' : alignment === 'trailing' ? 'flex-end' : 'center';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems,
        gap: spacing,
      }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// HStack Component
// =============================================================================

export interface IOSHStackProps {
  children: React.ReactNode;
  alignment?: 'top' | 'center' | 'bottom' | 'firstTextBaseline' | 'lastTextBaseline';
  spacing?: number;
}

export function IOSHStack({ children, alignment = 'center', spacing = 8 }: IOSHStackProps) {
  const alignItems =
    alignment === 'top'
      ? 'flex-start'
      : alignment === 'bottom'
        ? 'flex-end'
        : alignment === 'firstTextBaseline' || alignment === 'lastTextBaseline'
          ? 'baseline'
          : 'center';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems,
        gap: spacing,
      }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// ZStack Component
// =============================================================================

export interface IOSZStackProps {
  children: React.ReactNode;
  alignment?:
    | 'topLeading'
    | 'top'
    | 'topTrailing'
    | 'leading'
    | 'center'
    | 'trailing'
    | 'bottomLeading'
    | 'bottom'
    | 'bottomTrailing';
}

export function IOSZStack({ children, alignment = 'center' }: IOSZStackProps) {
  const alignmentMap: Record<string, { justifyContent: string; alignItems: string }> = {
    topLeading: { justifyContent: 'flex-start', alignItems: 'flex-start' },
    top: { justifyContent: 'flex-start', alignItems: 'center' },
    topTrailing: { justifyContent: 'flex-start', alignItems: 'flex-end' },
    leading: { justifyContent: 'center', alignItems: 'flex-start' },
    center: { justifyContent: 'center', alignItems: 'center' },
    trailing: { justifyContent: 'center', alignItems: 'flex-end' },
    bottomLeading: { justifyContent: 'flex-end', alignItems: 'flex-start' },
    bottom: { justifyContent: 'flex-end', alignItems: 'center' },
    bottomTrailing: { justifyContent: 'flex-end', alignItems: 'flex-end' },
  };

  const { justifyContent, alignItems } = alignmentMap[alignment] || alignmentMap.center;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent,
        alignItems,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          style={{
            position: index === 0 ? 'relative' : 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent,
            alignItems,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// ScrollView Component
// =============================================================================

export interface IOSScrollViewProps {
  children: React.ReactNode;
  axes?: 'vertical' | 'horizontal' | 'both';
  showsIndicators?: boolean;
}

export function IOSScrollView({ children, axes = 'vertical', showsIndicators = true }: IOSScrollViewProps) {
  const overflowX = axes === 'horizontal' || axes === 'both' ? 'auto' : 'hidden';
  const overflowY = axes === 'vertical' || axes === 'both' ? 'auto' : 'hidden';

  return (
    <div
      style={{
        overflowX,
        overflowY,
        flex: 1,
        ...(showsIndicators ? {} : { scrollbarWidth: 'none', msOverflowStyle: 'none' }),
      }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// List Component
// =============================================================================

export interface IOSListProps {
  children: React.ReactNode;
  style?: 'automatic' | 'plain' | 'grouped' | 'insetGrouped' | 'sidebar';
  showsRowSeparators?: boolean;
  isDark?: boolean;
}

export function IOSList({ children, style = 'automatic', isDark = false }: IOSListProps) {
  const isInset = style === 'insetGrouped';
  const isGrouped = style === 'grouped' || style === 'insetGrouped';

  return (
    <div
      style={{
        background: isGrouped ? (isDark ? '#000000' : '#f2f2f7') : isDark ? '#1c1c1e' : '#ffffff',
        borderRadius: isInset ? 12 : 0,
        margin: isInset ? '0 16px' : 0,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// Grid Component (LazyVGrid approximation)
// =============================================================================

export interface IOSGridProps {
  children: React.ReactNode;
  columns?: number;
  spacing?: number;
  columnSpacing?: number;
  rowSpacing?: number;
}

export function IOSGrid({ children, columns = 2, spacing = 8, columnSpacing, rowSpacing }: IOSGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: columnSpacing ?? spacing,
        rowGap: rowSpacing ?? spacing,
      }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// Section Component
// =============================================================================

export interface IOSSectionProps {
  children: React.ReactNode;
  header?: string;
  footer?: string;
  isDark?: boolean;
}

export function IOSSection({ children, header, footer, isDark = false }: IOSSectionProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      {header && (
        <div
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 400,
            color: isDark ? '#8e8e93' : '#6d6d72',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {header}
        </div>
      )}
      <div
        style={{
          background: isDark ? '#1c1c1e' : '#ffffff',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 400,
            color: isDark ? '#8e8e93' : '#6d6d72',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
