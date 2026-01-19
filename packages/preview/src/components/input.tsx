import React, { useState } from 'react';

// =============================================================================
// TextField Component
// =============================================================================

export interface IOSTextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  keyboardType?: 'default' | 'email' | 'number' | 'phone' | 'url';
  isDark?: boolean;
  onChange?: (value: string) => void;
}

export function IOSTextField({
  label,
  placeholder,
  value = '',
  keyboardType = 'default',
  isDark = false,
  onChange,
}: IOSTextFieldProps) {
  const inputType =
    keyboardType === 'email' ? 'email' : keyboardType === 'number' ? 'number' : keyboardType === 'phone' ? 'tel' : keyboardType === 'url' ? 'url' : 'text';

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 400,
            color: isDark ? '#8e8e93' : '#6d6d72',
            marginBottom: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {label}
        </label>
      )}
      <input
        type={inputType}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: 17,
          border: 'none',
          borderRadius: 10,
          background: isDark ? '#1c1c1e' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000',
          outline: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// =============================================================================
// SecureField Component
// =============================================================================

export interface IOSSecureFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  isDark?: boolean;
  onChange?: (value: string) => void;
}

export function IOSSecureField({ label, placeholder, value = '', isDark = false, onChange }: IOSSecureFieldProps) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 400,
            color: isDark ? '#8e8e93' : '#6d6d72',
            marginBottom: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {label}
        </label>
      )}
      <input
        type="password"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: 17,
          border: 'none',
          borderRadius: 10,
          background: isDark ? '#1c1c1e' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000',
          outline: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// =============================================================================
// Toggle Component
// =============================================================================

export interface IOSToggleProps {
  label?: string;
  isOn?: boolean;
  isDark?: boolean;
  onChange?: (isOn: boolean) => void;
}

export function IOSToggle({ label, isOn = false, isDark = false, onChange }: IOSToggleProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isDark ? '#1c1c1e' : '#ffffff',
      }}
    >
      {label && (
        <span
          style={{
            fontSize: 17,
            color: isDark ? '#ffffff' : '#000000',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {label}
        </span>
      )}
      <div
        onClick={() => onChange?.(!isOn)}
        style={{
          width: 51,
          height: 31,
          borderRadius: 16,
          background: isOn ? '#34C759' : isDark ? '#39393d' : '#e9e9eb',
          padding: 2,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            width: 27,
            height: 27,
            borderRadius: 14,
            background: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transform: isOn ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.2s',
          }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Picker Component
// =============================================================================

export interface IOSPickerProps {
  label?: string;
  options: Array<{ label: string; value: string }>;
  selectedValue?: string;
  isDark?: boolean;
  onChange?: (value: string) => void;
}

export function IOSPicker({ label, options, selectedValue, isDark = false, onChange }: IOSPickerProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isDark ? '#1c1c1e' : '#ffffff',
      }}
    >
      {label && (
        <span
          style={{
            fontSize: 17,
            color: isDark ? '#ffffff' : '#000000',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {label}
        </span>
      )}
      <select
        value={selectedValue}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          fontSize: 17,
          color: '#007AFF',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// =============================================================================
// Slider Component
// =============================================================================

export interface IOSSliderProps {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  isDark?: boolean;
  onChange?: (value: number) => void;
}

export function IOSSlider({ label, value = 50, min = 0, max = 100, step = 1, isDark = false, onChange }: IOSSliderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 16px',
        background: isDark ? '#1c1c1e' : '#ffffff',
      }}
    >
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: 17,
              color: isDark ? '#ffffff' : '#000000',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 17,
              color: isDark ? '#8e8e93' : '#6d6d72',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {value}
          </span>
        </div>
      )}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange?.(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: '#007AFF',
        }}
      />
    </div>
  );
}

// =============================================================================
// Stepper Component
// =============================================================================

export interface IOSStepperProps {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  isDark?: boolean;
  onChange?: (value: number) => void;
}

export function IOSStepper({ label, value = 0, min = 0, max = 100, step = 1, isDark = false, onChange }: IOSStepperProps) {
  const handleDecrement = () => {
    if (value > min) onChange?.(value - step);
  };

  const handleIncrement = () => {
    if (value < max) onChange?.(value + step);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isDark ? '#1c1c1e' : '#ffffff',
      }}
    >
      {label && (
        <span
          style={{
            fontSize: 17,
            color: isDark ? '#ffffff' : '#000000',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {label}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontSize: 17,
            color: isDark ? '#ffffff' : '#000000',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            minWidth: 32,
            textAlign: 'center',
          }}
        >
          {value}
        </span>
        <div
          style={{
            display: 'flex',
            borderRadius: 8,
            overflow: 'hidden',
            border: `1px solid ${isDark ? '#48484a' : '#c7c7cc'}`,
          }}
        >
          <button
            onClick={handleDecrement}
            disabled={value <= min}
            style={{
              width: 44,
              height: 32,
              border: 'none',
              background: isDark ? '#2c2c2e' : '#ffffff',
              color: value <= min ? (isDark ? '#48484a' : '#c7c7cc') : '#007AFF',
              fontSize: 20,
              cursor: value <= min ? 'not-allowed' : 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            −
          </button>
          <div
            style={{
              width: 1,
              background: isDark ? '#48484a' : '#c7c7cc',
            }}
          />
          <button
            onClick={handleIncrement}
            disabled={value >= max}
            style={{
              width: 44,
              height: 32,
              border: 'none',
              background: isDark ? '#2c2c2e' : '#ffffff',
              color: value >= max ? (isDark ? '#48484a' : '#c7c7cc') : '#007AFF',
              fontSize: 20,
              cursor: value >= max ? 'not-allowed' : 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
