'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, ChevronRight } from 'lucide-react';
import type { ComponentNode } from '@swiftship/core';
import { Toolbar } from './toolbar';
import { Preview } from './preview';
import { CodeView } from './code-view';
import { Chat } from './chat';
import {
  DesignContextPanel,
  DesignContextIndicator,
  type DesignContextConfig,
} from './design-context-panel';
import { cn } from '@/lib/utils';
import { springConfig } from '@/lib/animations';

type ViewMode = 'preview' | 'code' | 'split';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CanvasProps {
  projectName: string;
  componentTree: ComponentNode | null;
  generatedCode: string;
  messages: Message[];
  isGenerating: boolean;
  isSaving?: boolean;
  onSendMessage: (message: string) => void;
  onSave?: () => void;
  onExport?: () => void;
  onNodeSelect?: (nodeId: string | null) => void;
  selectedNodeId?: string | null;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  // Design context
  designContext?: DesignContextConfig;
  onDesignContextChange?: (context: DesignContextConfig) => void;
  showDesignPanel?: boolean;
  onShowDesignPanelChange?: (show: boolean) => void;
}

/**
 * Available design style options for the style picker
 */
const STYLE_OPTIONS = [
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Magazine-inspired with strong typography and whitespace',
    colorPreview: {
      primary: '#2d2926',
      secondary: '#6b645e',
      accent: '#b87a4b',
      background: '#faf8f5',
    },
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass effects with translucent surfaces',
    colorPreview: {
      primary: '#7c8aed',
      secondary: '#9f8fe6',
      accent: '#5ce6d6',
      background: '#2a2541',
    },
  },
  {
    id: 'swiss',
    name: 'Swiss',
    description: 'Clean grid-based design with bold sans-serif typography',
    colorPreview: {
      primary: '#1a1a1a',
      secondary: '#808080',
      accent: '#e53935',
      background: '#ffffff',
    },
  },
  {
    id: 'neoBrutalism',
    name: 'Neo-Brutalism',
    description: 'Bold, raw aesthetic with hard shadows and vibrant colors',
    colorPreview: {
      primary: '#0d0d0d',
      secondary: '#f5e642',
      accent: '#3dd68c',
      background: '#f5efe6',
    },
  },
  {
    id: 'darkInterface',
    name: 'Dark Interface',
    description: 'Professional dark mode with neon accents',
    colorPreview: {
      primary: '#8b5cf6',
      secondary: '#14b8a6',
      accent: '#ec4899',
      background: '#171520',
    },
  },
  {
    id: 'organic',
    name: 'Organic',
    description: 'Natural, earthy aesthetic with soft curves',
    colorPreview: {
      primary: '#6b5344',
      secondary: '#7a9a7a',
      accent: '#c27c54',
      background: '#f7f2eb',
    },
  },
];

const defaultDesignContext: DesignContextConfig = {
  styleId: 'editorial',
  isDarkMode: false,
};

export function Canvas({
  projectName,
  componentTree,
  generatedCode,
  messages,
  isGenerating,
  isSaving = false,
  onSendMessage,
  onSave,
  onExport,
  onNodeSelect,
  selectedNodeId,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  designContext = defaultDesignContext,
  onDesignContextChange,
  showDesignPanel = false,
  onShowDesignPanelChange,
}: CanvasProps) {
  const [activeView, setActiveView] = useState<ViewMode>('split');
  const [localShowPanel, setLocalShowPanel] = useState(showDesignPanel);

  const isPanelOpen = showDesignPanel ?? localShowPanel;
  const setPanelOpen = onShowDesignPanelChange ?? setLocalShowPanel;

  const selectedStyle = useMemo(
    () => STYLE_OPTIONS.find((s) => s.id === designContext.styleId),
    [designContext.styleId]
  );

  const handleDesignContextChange = (newContext: DesignContextConfig) => {
    onDesignContextChange?.(newContext);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <Toolbar
        projectName={projectName}
        activeView={activeView}
        onViewChange={setActiveView}
        onSave={onSave}
        onExport={onExport}
        isSaving={isSaving}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
      />

      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Design Context Panel (collapsible sidebar) */}
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={springConfig.default}
              className="border-r overflow-hidden"
            >
              <div className="w-[280px] h-full overflow-y-auto p-4">
                <DesignContextPanel
                  config={designContext}
                  onConfigChange={handleDesignContextChange}
                  styles={STYLE_OPTIONS}
                  isCollapsible={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button for design panel */}
        <div className="relative">
          <motion.button
            className={cn(
              'absolute top-4 z-10 flex items-center gap-1 px-2 py-1.5 rounded-r-lg border border-l-0 bg-card text-xs font-medium transition-colors hover:bg-muted',
              isPanelOpen ? 'left-0' : 'left-0'
            )}
            onClick={() => setPanelOpen(!isPanelOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={isPanelOpen ? 'Hide design panel' : 'Show design panel'}
          >
            <Palette className="w-3.5 h-3.5" />
            <motion.div
              animate={{ rotate: isPanelOpen ? 180 : 0 }}
              transition={springConfig.default}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </motion.button>
        </div>

        {/* Preview/Code pane */}
        <div className="flex-1 flex min-w-0">
          {/* Preview */}
          {(activeView === 'preview' || activeView === 'split') && (
            <div className={cn('flex-1 min-w-0 relative', activeView === 'split' && 'border-r')}>
              {/* Style indicator floating badge */}
              {selectedStyle && (
                <div className="absolute top-4 right-4 z-10">
                  <DesignContextIndicator
                    config={designContext}
                    style={selectedStyle}
                    onClick={() => setPanelOpen(!isPanelOpen)}
                  />
                </div>
              )}
              <Preview
                componentTree={componentTree}
                onNodeSelect={onNodeSelect}
                selectedNodeId={selectedNodeId}
              />
            </div>
          )}

          {/* Code */}
          {(activeView === 'code' || activeView === 'split') && (
            <div className="flex-1 min-w-0">
              <CodeView code={generatedCode} onExport={onExport} />
            </div>
          )}
        </div>

        {/* Chat pane */}
        <div className="w-80 min-w-[280px] max-w-[400px]">
          <Chat messages={messages} isGenerating={isGenerating} onSend={onSendMessage} />
        </div>
      </div>
    </div>
  );
}
