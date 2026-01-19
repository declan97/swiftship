import React from 'react';

interface SimulatorFrameProps {
  children: React.ReactNode;
  device?: 'iphone15' | 'iphone15pro' | 'iphoneSE';
  theme?: 'light' | 'dark';
  showStatusBar?: boolean;
  showHomeIndicator?: boolean;
  time?: string;
}

const DEVICE_DIMENSIONS = {
  iphone15: { width: 393, height: 852 },
  iphone15pro: { width: 393, height: 852 },
  iphoneSE: { width: 375, height: 667 },
};

/**
 * iPhone simulator frame for previewing iOS apps in the browser.
 */
export function SimulatorFrame({
  children,
  device = 'iphone15',
  theme = 'light',
  showStatusBar = true,
  showHomeIndicator = true,
  time = '9:41',
}: SimulatorFrameProps) {
  const dimensions = DEVICE_DIMENSIONS[device];
  const isDark = theme === 'dark';
  const hasDynamicIsland = device === 'iphone15pro';
  const hasNotch = device === 'iphone15' || device === 'iphone15pro';

  return (
    <div
      className="ios-simulator-frame"
      style={{
        width: dimensions.width + 24,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        borderRadius: 48,
        padding: 12,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      <div
        className="ios-screen"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          background: isDark ? '#000000' : '#f2f2f7',
          borderRadius: 40,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Status Bar */}
        {showStatusBar && (
          <StatusBar time={time} isDark={isDark} hasDynamicIsland={hasDynamicIsland} hasNotch={hasNotch} />
        )}

        {/* Content */}
        <div
          style={{
            height: showStatusBar ? dimensions.height - 48 - (showHomeIndicator ? 34 : 0) : dimensions.height,
            overflow: 'auto',
            background: isDark ? '#000000' : '#f2f2f7',
          }}
        >
          {children}
        </div>

        {/* Home Indicator */}
        {showHomeIndicator && hasNotch && <HomeIndicator isDark={isDark} />}
      </div>
    </div>
  );
}

function StatusBar({
  time,
  isDark,
  hasDynamicIsland,
  hasNotch,
}: {
  time: string;
  isDark: boolean;
  hasDynamicIsland: boolean;
  hasNotch: boolean;
}) {
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
      {/* Time */}
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: textColor,
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {time}
      </span>

      {/* Dynamic Island / Notch */}
      {(hasDynamicIsland || hasNotch) && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 12,
            transform: 'translateX(-50%)',
            width: hasDynamicIsland ? 126 : 150,
            height: hasDynamicIsland ? 36 : 30,
            background: '#000000',
            borderRadius: hasDynamicIsland ? 18 : 16,
          }}
        />
      )}

      {/* Status Icons */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={textColor}>
          <rect x="0" y="6" width="3" height="6" rx="1" />
          <rect x="5" y="4" width="3" height="8" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill={textColor}>
          <path d="M8 2.4c3.1 0 5.9 1.2 8 3.2l-1.4 1.4C12.8 5.2 10.5 4.2 8 4.2s-4.8 1-6.6 2.8L0 5.6C2.1 3.6 4.9 2.4 8 2.4zm0 3.6c1.9 0 3.6.7 4.9 2l-1.4 1.4C10.5 8.5 9.3 8 8 8s-2.5.5-3.5 1.4L3.1 8c1.3-1.3 3-2 4.9-2zm0 3.6c.9 0 1.8.4 2.4 1l-2.4 2.4-2.4-2.4c.6-.6 1.5-1 2.4-1z" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill={textColor}>
          <rect x="0" y="0" width="22" height="12" rx="3" stroke={textColor} strokeWidth="1" fill="none" />
          <rect x="2" y="2" width="17" height="8" rx="1" />
          <path d="M23 4v4a2 2 0 0 0 0-4z" />
        </svg>
      </div>
    </div>
  );
}

function HomeIndicator({ isDark }: { isDark: boolean }) {
  return (
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
  );
}

export default SimulatorFrame;
