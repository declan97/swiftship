import React from 'react';

// iOS font sizes mapping
const FONT_SIZES: Record<string, { size: number; lineHeight: number; weight: number }> = {
  largeTitle: { size: 34, lineHeight: 41, weight: 400 },
  title: { size: 28, lineHeight: 34, weight: 400 },
  title2: { size: 22, lineHeight: 28, weight: 400 },
  title3: { size: 20, lineHeight: 25, weight: 400 },
  headline: { size: 17, lineHeight: 22, weight: 600 },
  body: { size: 17, lineHeight: 22, weight: 400 },
  callout: { size: 16, lineHeight: 21, weight: 400 },
  subheadline: { size: 15, lineHeight: 20, weight: 400 },
  footnote: { size: 13, lineHeight: 18, weight: 400 },
  caption: { size: 12, lineHeight: 16, weight: 400 },
  caption2: { size: 11, lineHeight: 13, weight: 400 },
};

const FONT_WEIGHTS: Record<string, number> = {
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

// iOS semantic colors
const SEMANTIC_COLORS: Record<string, { light: string; dark: string }> = {
  label: { light: '#000000', dark: '#ffffff' },
  secondaryLabel: { light: '#3c3c4399', dark: '#ebebf599' },
  tertiaryLabel: { light: '#3c3c434d', dark: '#ebebf54d' },
  systemBlue: { light: '#007AFF', dark: '#0A84FF' },
  systemGreen: { light: '#34C759', dark: '#30D158' },
  systemRed: { light: '#FF3B30', dark: '#FF453A' },
  systemOrange: { light: '#FF9500', dark: '#FF9F0A' },
  systemYellow: { light: '#FFCC00', dark: '#FFD60A' },
  systemPink: { light: '#FF2D55', dark: '#FF375F' },
  systemPurple: { light: '#AF52DE', dark: '#BF5AF2' },
  systemTeal: { light: '#5AC8FA', dark: '#64D2FF' },
  systemIndigo: { light: '#5856D6', dark: '#5E5CE6' },
};

function resolveColor(color: string | undefined, isDark: boolean): string | undefined {
  if (!color) return undefined;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  const semantic = SEMANTIC_COLORS[color];
  return semantic ? (isDark ? semantic.dark : semantic.light) : color;
}

// =============================================================================
// Text Component
// =============================================================================

export interface IOSTextProps {
  content: string;
  font?: keyof typeof FONT_SIZES;
  weight?: keyof typeof FONT_WEIGHTS;
  color?: string;
  alignment?: 'leading' | 'center' | 'trailing';
  lineLimit?: number;
  isDark?: boolean;
}

export function IOSText({
  content,
  font = 'body',
  weight,
  color,
  alignment = 'leading',
  lineLimit,
  isDark = false,
}: IOSTextProps) {
  const fontStyle = FONT_SIZES[font] || FONT_SIZES.body;
  const finalWeight = weight ? FONT_WEIGHTS[weight] : fontStyle.weight;
  const textAlign = alignment === 'leading' ? 'left' : alignment === 'trailing' ? 'right' : 'center';
  const resolvedColor = resolveColor(color, isDark) ?? (isDark ? '#ffffff' : '#000000');

  return (
    <span
      style={{
        fontSize: fontStyle.size,
        lineHeight: `${fontStyle.lineHeight}px`,
        fontWeight: finalWeight,
        color: resolvedColor,
        textAlign,
        display: 'block',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        ...(lineLimit
          ? {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: lineLimit,
              WebkitBoxOrient: 'vertical' as const,
            }
          : {}),
      }}
    >
      {content}
    </span>
  );
}

// =============================================================================
// Button Component
// =============================================================================

export interface IOSButtonProps {
  label: string;
  style?: 'bordered' | 'borderedProminent' | 'borderless' | 'plain';
  role?: 'none' | 'cancel' | 'destructive';
  icon?: string;
  iconPosition?: 'leading' | 'trailing';
  isDisabled?: boolean;
  isLoading?: boolean;
  isDark?: boolean;
  onClick?: () => void;
}

export function IOSButton({
  label,
  style = 'borderedProminent',
  role = 'none',
  icon,
  isDisabled = false,
  isDark = false,
  onClick,
}: IOSButtonProps) {
  const baseColor = role === 'destructive' ? '#FF3B30' : '#007AFF';

  const styles: Record<string, React.CSSProperties> = {
    borderedProminent: {
      background: baseColor,
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: 12,
      border: 'none',
    },
    bordered: {
      background: 'transparent',
      color: baseColor,
      padding: '12px 20px',
      borderRadius: 12,
      border: `1px solid ${baseColor}`,
    },
    borderless: {
      background: 'transparent',
      color: baseColor,
      padding: '8px 12px',
      border: 'none',
    },
    plain: {
      background: 'transparent',
      color: baseColor,
      padding: '8px 12px',
      border: 'none',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        ...styles[style],
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        fontSize: 17,
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        transition: 'transform 0.1s, opacity 0.1s',
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

// =============================================================================
// Icon Component (SF Symbol approximation)
// =============================================================================

export interface IOSIconProps {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  weight?: keyof typeof FONT_WEIGHTS;
  color?: string;
  isDark?: boolean;
}

const ICON_SIZES = {
  small: 16,
  medium: 22,
  large: 28,
  extraLarge: 44,
};

// Map common SF Symbol names to unicode/emoji approximations
const SF_SYMBOL_MAP: Record<string, string> = {
  'person.circle': '👤',
  'person.circle.fill': '👤',
  gear: '⚙️',
  'gearshape.fill': '⚙️',
  star: '⭐',
  'star.fill': '⭐',
  heart: '❤️',
  'heart.fill': '❤️',
  plus: '+',
  'plus.circle': '⊕',
  'plus.circle.fill': '⊕',
  minus: '−',
  trash: '🗑️',
  'trash.fill': '🗑️',
  pencil: '✏️',
  checkmark: '✓',
  'checkmark.circle': '✓',
  'checkmark.circle.fill': '✓',
  xmark: '✕',
  'xmark.circle': '✕',
  magnifyingglass: '🔍',
  house: '🏠',
  'house.fill': '🏠',
  bell: '🔔',
  'bell.fill': '🔔',
  envelope: '✉️',
  'envelope.fill': '✉️',
  phone: '📞',
  'phone.fill': '📞',
  camera: '📷',
  'camera.fill': '📷',
  photo: '🖼️',
  'photo.fill': '🖼️',
  'square.and.arrow.up': '↑',
  'square.and.arrow.down': '↓',
  'arrow.right': '→',
  'arrow.left': '←',
  'arrow.up': '↑',
  'arrow.down': '↓',
  'chevron.right': '›',
  'chevron.left': '‹',
  'chevron.up': '︿',
  'chevron.down': '﹀',
  'list.bullet': '☰',
  'square.grid.2x2': '⊞',
  'doc.text': '📄',
  folder: '📁',
  'folder.fill': '📁',
  clock: '🕐',
  'clock.fill': '🕐',
  calendar: '📅',
  location: '📍',
  'location.fill': '📍',
  map: '🗺️',
  'map.fill': '🗺️',
  bookmark: '🔖',
  'bookmark.fill': '🔖',
  tag: '🏷️',
  'tag.fill': '🏷️',
  lock: '🔒',
  'lock.fill': '🔒',
  'lock.open': '🔓',
  key: '🔑',
  'key.fill': '🔑',
  shield: '🛡️',
  'shield.fill': '🛡️',
  cart: '🛒',
  'cart.fill': '🛒',
  creditcard: '💳',
  'creditcard.fill': '💳',
  'dollarsign.circle': '💲',
  gift: '🎁',
  'gift.fill': '🎁',
  airplane: '✈️',
  car: '🚗',
  'car.fill': '🚗',
};

export function IOSIcon({ name, size = 'medium', color, isDark = false }: IOSIconProps) {
  const iconSize = ICON_SIZES[size];
  const resolvedColor = resolveColor(color, isDark) ?? (isDark ? '#ffffff' : '#007AFF');
  const symbol = SF_SYMBOL_MAP[name] || '●';

  return (
    <span
      style={{
        fontSize: iconSize,
        color: resolvedColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: iconSize,
        height: iconSize,
      }}
    >
      {symbol}
    </span>
  );
}

// =============================================================================
// Spacer Component
// =============================================================================

export interface IOSSpacerProps {
  minLength?: number;
}

export function IOSSpacer({ minLength }: IOSSpacerProps) {
  return <div style={{ flex: 1, minHeight: minLength, minWidth: minLength }} />;
}

// =============================================================================
// Divider Component
// =============================================================================

export interface IOSDividerProps {
  isDark?: boolean;
}

export function IOSDivider({ isDark = false }: IOSDividerProps) {
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
}
