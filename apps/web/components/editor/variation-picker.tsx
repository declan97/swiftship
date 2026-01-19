'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, RefreshCw, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { springConfig } from '@/lib/animations';
import type { ComponentNode } from '@swiftship/core';

export interface DesignVariation {
  id: string;
  name: string;
  styleId: string;
  componentTree: ComponentNode;
  generationTime: number;
  isSelected?: boolean;
}

interface VariationPickerProps {
  variations: DesignVariation[];
  selectedVariationId?: string;
  onSelect: (variationId: string) => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
  className?: string;
}

export function VariationPicker({
  variations,
  selectedVariationId,
  onSelect,
  onRegenerate,
  isGenerating = false,
  className,
}: VariationPickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : variations.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < variations.length - 1 ? prev + 1 : 0));
  };

  if (variations.length === 0) {
    return (
      <EmptyVariations
        onGenerate={onRegenerate}
        isGenerating={isGenerating}
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span>Design Variations</span>
          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
            {variations.length}
          </span>
        </div>
        {onRegenerate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="h-7 px-2"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isGenerating && 'animate-spin')} />
            <span className="ml-1.5 text-xs">Regenerate</span>
          </Button>
        )}
      </div>

      {/* Variation carousel */}
      <div className="relative">
        {/* Navigation arrows */}
        {variations.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-6 h-6 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-6 h-6 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Variation cards */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={springConfig.gentle}
            >
              <VariationCard
                variation={variations[currentIndex]}
                isSelected={variations[currentIndex].id === selectedVariationId}
                onSelect={() => onSelect(variations[currentIndex].id)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        {variations.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {variations.map((variation, index) => (
              <button
                key={variation.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface VariationCardProps {
  variation: DesignVariation;
  isSelected: boolean;
  onSelect: () => void;
}

function VariationCard({ variation, isSelected, onSelect }: VariationCardProps) {
  return (
    <motion.button
      className={cn(
        'w-full p-4 rounded-lg border text-left transition-colors',
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Variation preview placeholder */}
      <div className="aspect-[9/16] max-h-[200px] bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
        <div className="text-xs text-muted-foreground text-center p-4">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <span>Preview will appear here</span>
        </div>
      </div>

      {/* Variation info */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{variation.name}</span>
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
          <p className="text-xs text-muted-foreground">
            Style: {variation.styleId}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{(variation.generationTime / 1000).toFixed(1)}s</span>
        </div>
      </div>
    </motion.button>
  );
}

interface EmptyVariationsProps {
  onGenerate?: () => void;
  isGenerating?: boolean;
  className?: string;
}

function EmptyVariations({
  onGenerate,
  isGenerating,
  className,
}: EmptyVariationsProps) {
  return (
    <motion.div
      className={cn(
        'p-6 rounded-lg border border-dashed border-muted-foreground/25 text-center',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig.gentle}
    >
      <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
      <h3 className="text-sm font-medium mb-1">No variations yet</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Generate multiple design options to compare
      </p>
      {onGenerate && (
        <Button
          size="sm"
          onClick={onGenerate}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Variations
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}

/**
 * Grid view of all variations for comparison
 */
export function VariationGrid({
  variations,
  selectedVariationId,
  onSelect,
  className,
}: Omit<VariationPickerProps, 'onRegenerate' | 'isGenerating'>) {
  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {variations.map((variation, index) => (
        <motion.button
          key={variation.id}
          className={cn(
            'p-2 rounded-lg border text-left transition-colors',
            variation.id === selectedVariationId
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          )}
          onClick={() => onSelect(variation.id)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springConfig.gentle, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Mini preview */}
          <div className="aspect-[9/16] bg-muted rounded mb-2 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground">
              {variation.name.charAt(0)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium truncate flex-1">
              {variation.name}
            </span>
            {variation.id === selectedVariationId && (
              <Check className="w-3 h-3 text-primary flex-shrink-0" />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
