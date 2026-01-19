'use client';

import { useState } from 'react';
import type { ComponentNode } from '@swiftship/core';
import { Toolbar } from './toolbar';
import { Preview } from './preview';
import { CodeView } from './code-view';
import { Chat } from './chat';
import { cn } from '@/lib/utils';

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
}

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
}: CanvasProps) {
  const [activeView, setActiveView] = useState<ViewMode>('split');

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
      />

      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Preview/Code pane */}
        <div className="flex-1 flex min-w-0">
          {/* Preview */}
          {(activeView === 'preview' || activeView === 'split') && (
            <div className={cn('flex-1 min-w-0', activeView === 'split' && 'border-r')}>
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
