import React from 'react';

// =============================================================================
// NavigationStack Component
// =============================================================================

export interface IOSNavigationStackProps {
  children: React.ReactNode;
  title?: string;
  isDark?: boolean;
}

export function IOSNavigationStack({ children, title, isDark = false }: IOSNavigationStackProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: isDark ? '#000000' : '#f2f2f7',
      }}
    >
      {/* Navigation Bar */}
      {title && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: `0.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
            background: isDark ? 'rgba(28,28,30,0.94)' : 'rgba(249,249,249,0.94)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 700,
              color: isDark ? '#ffffff' : '#000000',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            {title}
          </h1>
        </div>
      )}
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

// =============================================================================
// NavigationLink Component
// =============================================================================

export interface IOSNavigationLinkProps {
  children: React.ReactNode;
  destination?: React.ReactNode;
  isDark?: boolean;
  onClick?: () => void;
}

export function IOSNavigationLink({ children, isDark = false, onClick }: IOSNavigationLinkProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isDark ? '#1c1c1e' : '#ffffff',
        cursor: 'pointer',
        borderBottom: `0.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <div style={{ flex: 1 }}>{children}</div>
      <span style={{ color: isDark ? '#48484a' : '#c7c7cc', fontSize: 18 }}>›</span>
    </div>
  );
}

// =============================================================================
// TabView Component
// =============================================================================

export interface IOSTabViewProps {
  children: React.ReactNode;
  tabs: Array<{ title: string; icon: string }>;
  selectedIndex?: number;
  isDark?: boolean;
  onSelect?: (index: number) => void;
}

export function IOSTabView({ children, tabs, selectedIndex = 0, isDark = false, onSelect }: IOSTabViewProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>

      {/* Tab Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '8px 0 24px 0',
          borderTop: `0.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
          background: isDark ? 'rgba(28,28,30,0.94)' : 'rgba(249,249,249,0.94)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => onSelect?.(index)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              opacity: index === selectedIndex ? 1 : 0.5,
            }}
          >
            <span style={{ fontSize: 24 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: index === selectedIndex ? '#007AFF' : isDark ? '#8e8e93' : '#8e8e93',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {tab.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Sheet Component (Modal)
// =============================================================================

export interface IOSSheetProps {
  children: React.ReactNode;
  isPresented: boolean;
  isDark?: boolean;
  onDismiss?: () => void;
}

export function IOSSheet({ children, isPresented, isDark = false, onDismiss }: IOSSheetProps) {
  if (!isPresented) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '90%',
          background: isDark ? '#2c2c2e' : '#ffffff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'auto',
        }}
      >
        {/* Drag indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <div
            style={{
              width: 36,
              height: 5,
              borderRadius: 3,
              background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// Alert Component
// =============================================================================

export interface IOSAlertProps {
  title: string;
  message?: string;
  isPresented: boolean;
  isDark?: boolean;
  actions?: Array<{ label: string; role?: 'cancel' | 'destructive'; onClick?: () => void }>;
  onDismiss?: () => void;
}

export function IOSAlert({ title, message, isPresented, isDark = false, actions = [], onDismiss }: IOSAlertProps) {
  if (!isPresented) return null;

  const defaultActions = actions.length > 0 ? actions : [{ label: 'OK', onClick: onDismiss }];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 40,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 270,
          background: isDark ? 'rgba(44,44,46,0.95)' : 'rgba(255,255,255,0.95)',
          borderRadius: 14,
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ padding: '20px 16px 16px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 600,
              textAlign: 'center',
              color: isDark ? '#ffffff' : '#000000',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {title}
          </h3>
          {message && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 13,
                textAlign: 'center',
                color: isDark ? '#ebebf5' : '#000000',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {message}
            </p>
          )}
        </div>
        <div
          style={{
            borderTop: `0.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
            display: 'flex',
            flexDirection: defaultActions.length > 2 ? 'column' : 'row',
          }}
        >
          {defaultActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                fontSize: 17,
                fontWeight: action.role === 'cancel' ? 600 : 400,
                color: action.role === 'destructive' ? '#FF3B30' : '#007AFF',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                borderLeft:
                  index > 0 && defaultActions.length <= 2
                    ? `0.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`
                    : 'none',
                borderTop:
                  index > 0 && defaultActions.length > 2
                    ? `0.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`
                    : 'none',
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
