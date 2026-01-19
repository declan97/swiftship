'use client';

import { Monitor, Smartphone, Code2, Columns, Save, Download, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'preview' | 'code' | 'split';

interface ToolbarProps {
  projectName: string;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onSave?: () => void;
  onExport?: () => void;
  isSaving?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function Toolbar({
  projectName,
  activeView,
  onViewChange,
  onSave,
  onExport,
  isSaving = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: ToolbarProps) {
  return (
    <div className="h-12 border-b bg-background flex items-center justify-between px-4">
      {/* Left section: Project name */}
      <div className="flex items-center gap-3">
        <span className="font-semibold">{projectName}</span>
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center section: View toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <ViewButton
          icon={<Smartphone className="w-4 h-4" />}
          label="Preview"
          isActive={activeView === 'preview'}
          onClick={() => onViewChange('preview')}
        />
        <ViewButton
          icon={<Columns className="w-4 h-4" />}
          label="Split"
          isActive={activeView === 'split'}
          onClick={() => onViewChange('split')}
        />
        <ViewButton
          icon={<Code2 className="w-4 h-4" />}
          label="Code"
          isActive={activeView === 'code'}
          onClick={() => onViewChange('code')}
        />
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-2">
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        )}
      </div>
    </div>
  );
}

function ViewButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
        isActive ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
