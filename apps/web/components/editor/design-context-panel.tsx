'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Type,
  Layout,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { springConfig } from '@/lib/animations';
import { StylePicker, type StyleOption } from './style-picker';

export interface DesignContextConfig {
  styleId: string;
  isDarkMode: boolean;
  customColors?: {
    primary?: string;
    accent?: string;
  };
  emphasis?: string[];
  userNotes?: string;
}

interface DesignContextPanelProps {
  config: DesignContextConfig;
  onConfigChange: (config: DesignContextConfig) => void;
  styles: StyleOption[];
  className?: string;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

export function DesignContextPanel({
  config,
  onConfigChange,
  styles,
  className,
  isCollapsible = true,
  defaultExpanded = true,
}: DesignContextPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeSection, setActiveSection] = useState<'style' | 'colors' | 'options'>('style');

  const selectedStyle = useMemo(
    () => styles.find((s) => s.id === config.styleId),
    [styles, config.styleId]
  );

  const handleStyleChange = (styleId: string) => {
    onConfigChange({ ...config, styleId });
  };

  const handleDarkModeToggle = () => {
    onConfigChange({ ...config, isDarkMode: !config.isDarkMode });
  };

  return (
    <motion.div
      className={cn('rounded-lg border bg-card', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig.gentle}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3',
          isCollapsible && 'cursor-pointer hover:bg-muted/50'
        )}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium">Design Context</span>
          {selectedStyle && !isExpanded && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {selectedStyle.name}
            </span>
          )}
        </div>
        {isCollapsible && (
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={springConfig.default}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springConfig.default}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Section tabs */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <SectionTab
                  icon={<Palette className="w-3.5 h-3.5" />}
                  label="Style"
                  isActive={activeSection === 'style'}
                  onClick={() => setActiveSection('style')}
                />
                <SectionTab
                  icon={<Type className="w-3.5 h-3.5" />}
                  label="Colors"
                  isActive={activeSection === 'colors'}
                  onClick={() => setActiveSection('colors')}
                />
                <SectionTab
                  icon={<Layout className="w-3.5 h-3.5" />}
                  label="Options"
                  isActive={activeSection === 'options'}
                  onClick={() => setActiveSection('options')}
                />
              </div>

              {/* Section content */}
              <AnimatePresence mode="wait">
                {activeSection === 'style' && (
                  <motion.div
                    key="style"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={springConfig.gentle}
                  >
                    <StylePicker
                      styles={styles}
                      selectedStyleId={config.styleId}
                      onStyleSelect={handleStyleChange}
                    />
                  </motion.div>
                )}

                {activeSection === 'colors' && (
                  <motion.div
                    key="colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={springConfig.gentle}
                    className="space-y-4"
                  >
                    {/* Dark mode toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        {config.isDarkMode ? (
                          <Moon className="w-4 h-4" />
                        ) : (
                          <Sun className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {config.isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDarkModeToggle}
                        className="h-7"
                      >
                        Switch
                      </Button>
                    </div>

                    {/* Color preview from selected style */}
                    {selectedStyle && (
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Style Colors
                        </span>
                        <div className="flex gap-2">
                          <ColorSwatch
                            color={selectedStyle.colorPreview.primary}
                            label="Primary"
                          />
                          <ColorSwatch
                            color={selectedStyle.colorPreview.secondary}
                            label="Secondary"
                          />
                          <ColorSwatch
                            color={selectedStyle.colorPreview.accent}
                            label="Accent"
                          />
                          <ColorSwatch
                            color={selectedStyle.colorPreview.background}
                            label="Background"
                          />
                        </div>
                      </div>
                    )}

                    {/* Custom color override (future feature) */}
                    <div className="p-3 rounded-lg border border-dashed border-muted-foreground/25">
                      <span className="text-xs text-muted-foreground">
                        Custom color overrides coming soon
                      </span>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'options' && (
                  <motion.div
                    key="options"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={springConfig.gentle}
                    className="space-y-4"
                  >
                    {/* Design notes */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Design Notes (optional)
                      </label>
                      <textarea
                        value={config.userNotes ?? ''}
                        onChange={(e) =>
                          onConfigChange({ ...config, userNotes: e.target.value })
                        }
                        placeholder="Any specific design preferences or requirements..."
                        className="w-full h-24 px-3 py-2 text-sm rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Style characteristics */}
                    {selectedStyle && (
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {selectedStyle.name} Style Traits
                        </span>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Magazine-inspired typography</li>
                          <li>• Generous whitespace</li>
                          <li>• Warm color palette</li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SectionTabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function SectionTab({ icon, label, isActive, onClick }: SectionTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors',
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-background shadow-sm rounded-md"
          layoutId="activeSectionIndicator"
          transition={springConfig.default}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </button>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 rounded-md border"
        style={{ backgroundColor: color }}
        title={label}
      />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * Minimal floating design context indicator
 */
export function DesignContextIndicator({
  config,
  style,
  onClick,
  className,
}: {
  config: DesignContextConfig;
  style?: StyleOption;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card/80 backdrop-blur-sm text-sm',
        onClick && 'hover:bg-muted/50 cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {style && (
        <div className="flex -space-x-1">
          <div
            className="w-3 h-3 rounded-full border border-background"
            style={{ backgroundColor: style.colorPreview.primary }}
          />
          <div
            className="w-3 h-3 rounded-full border border-background"
            style={{ backgroundColor: style.colorPreview.accent }}
          />
        </div>
      )}
      <span className="text-xs font-medium">
        {style?.name ?? 'No style'}
        {config.isDarkMode && ' (Dark)'}
      </span>
      {onClick && <ChevronDown className="w-3 h-3 text-muted-foreground" />}
    </motion.button>
  );
}
