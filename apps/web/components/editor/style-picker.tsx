'use client';

import { motion } from 'motion/react';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { springConfig } from '@/lib/animations';

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  colorPreview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

interface StylePickerProps {
  styles: StyleOption[];
  selectedStyleId: string;
  onStyleSelect: (styleId: string) => void;
  className?: string;
}

export function StylePicker({
  styles,
  selectedStyleId,
  onStyleSelect,
  className,
}: StylePickerProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Palette className="w-4 h-4" />
        <span>Design Style</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {styles.map((style, index) => (
          <StyleCard
            key={style.id}
            style={style}
            isSelected={style.id === selectedStyleId}
            onSelect={() => onStyleSelect(style.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

interface StyleCardProps {
  style: StyleOption;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function StyleCard({ style, isSelected, onSelect, index }: StyleCardProps) {
  return (
    <motion.button
      className={cn(
        'relative p-3 rounded-lg border text-left transition-colors',
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
      onClick={onSelect}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springConfig.gentle, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Color preview */}
      <div className="flex gap-1 mb-2">
        <ColorDot color={style.colorPreview.primary} label="Primary" />
        <ColorDot color={style.colorPreview.secondary} label="Secondary" />
        <ColorDot color={style.colorPreview.accent} label="Accent" />
        <ColorDot color={style.colorPreview.background} label="Background" hasBorder />
      </div>

      {/* Style info */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{style.name}</span>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-primary-foreground" />
            </motion.div>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {style.description}
        </p>
      </div>
    </motion.button>
  );
}

function ColorDot({
  color,
  label,
  hasBorder,
}: {
  color: string;
  label: string;
  hasBorder?: boolean;
}) {
  return (
    <div
      className={cn(
        'w-5 h-5 rounded-full',
        hasBorder && 'border border-border'
      )}
      style={{ backgroundColor: color }}
      title={label}
    />
  );
}

/**
 * Compact style picker for tight spaces
 */
export function CompactStylePicker({
  styles,
  selectedStyleId,
  onStyleSelect,
  className,
}: StylePickerProps) {
  const selectedStyle = styles.find((s) => s.id === selectedStyleId);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">Style:</span>
      <div className="flex gap-1">
        {styles.map((style) => (
          <motion.button
            key={style.id}
            className={cn(
              'relative w-8 h-8 rounded-lg border transition-colors',
              style.id === selectedStyleId
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
            onClick={() => onStyleSelect(style.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={style.name}
          >
            {/* Mini color preview */}
            <div className="absolute inset-1 rounded overflow-hidden grid grid-cols-2 gap-px">
              <div style={{ backgroundColor: style.colorPreview.primary }} />
              <div style={{ backgroundColor: style.colorPreview.accent }} />
              <div style={{ backgroundColor: style.colorPreview.secondary }} />
              <div style={{ backgroundColor: style.colorPreview.background }} />
            </div>
            {style.id === selectedStyleId && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-2 h-2 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      {selectedStyle && (
        <span className="text-sm font-medium">{selectedStyle.name}</span>
      )}
    </div>
  );
}
