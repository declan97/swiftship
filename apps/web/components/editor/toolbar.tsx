'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Code2, Columns, Save, Download, Undo2, Redo2, Loader2 } from 'lucide-react';
import { Button, MotionButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { springConfig } from '@/lib/animations';

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
    <motion.div
      className="h-14 border-b glass sticky top-0 z-10 flex items-center justify-between px-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig.gentle}
    >
      {/* Left section: Project name */}
      <div className="flex items-center gap-3">
        <motion.span
          className="font-semibold truncate max-w-[200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {projectName}
        </motion.span>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-10 w-10"
            title="Undo (⌘Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-10 w-10"
            title="Redo (⌘⇧Z)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center section: View toggle */}
      <motion.div
        className="flex items-center gap-1 bg-muted rounded-lg p-1"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springConfig.default, delay: 0.15 }}
      >
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
      </motion.div>

      {/* Right section: Actions */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...springConfig.gentle, delay: 0.2 }}
      >
        {onSave && (
          <Button
            variant="ghost"
            size="touch"
            onClick={onSave}
            disabled={isSaving}
            className="gap-2"
          >
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="save"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Save className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
          </Button>
        )}
        {onExport && (
          <MotionButton size="touch" className="gap-2" onClick={onExport}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </MotionButton>
        )}
      </motion.div>
    </motion.div>
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
    <motion.button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-1.5 px-3 min-h-[36px] rounded-md text-sm font-medium transition-colors',
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-background shadow-sm rounded-md"
          layoutId="activeViewIndicator"
          transition={springConfig.default}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </span>
    </motion.button>
  );
}
