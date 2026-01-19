'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Sun,
  Moon,
  Monitor,
  Download,
  Code2,
  Smartphone,
  Search,
  Settings,
  Home,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { commandPaletteVariants, backdropVariants } from '@/lib/animations';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [search, setSearch] = React.useState('');

  // Reset search when closing
  React.useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => onOpenChange(false)}
          />

          {/* Command Dialog */}
          <motion.div
            className="fixed left-1/2 top-[15%] -translate-x-1/2 z-50 w-full max-w-xl"
            variants={commandPaletteVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5">
              <Command
                className="bg-transparent"
                loop
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onOpenChange(false);
                  }
                }}
              >
                {/* Search Input */}
                <div className="flex items-center border-b border-white/5 px-4">
                  <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground/50" />
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Type a command or search..."
                    className="flex h-14 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground/50 text-foreground disabled:cursor-not-allowed disabled:opacity-50 font-medium tracking-tight"
                  />
                  <div className="flex gap-1">
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      ESC
                    </kbd>
                  </div>
                </div>

                {/* Command List */}
                <Command.List className="max-h-[360px] overflow-y-auto p-2 scrollbar-none">
                  <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Search className="w-6 h-6 opacity-20" />
                      </div>
                    </div>
                    No results found for "{search}".
                  </Command.Empty>

                  {/* Navigation */}
                  <Command.Group heading="Navigation" className="px-2 py-2 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold select-none">
                    <CommandItem
                      onSelect={() => runCommand(() => router.push('/'))}
                      icon={<Home />}
                      shortcut="⌘H"
                    >
                      Home
                    </CommandItem>
                    <CommandItem
                      onSelect={() => runCommand(() => router.push('/dashboard/projects/new'))}
                      icon={<Plus />}
                      shortcut="⌘N"
                    >
                      New Project
                    </CommandItem>
                  </Command.Group>

                  {/* Theme */}
                  <Command.Group heading="Theme" className="px-2 py-2 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold select-none">
                    <CommandItem
                      onSelect={() => runCommand(() => setTheme('light'))}
                      icon={<Sun />}
                      active={theme === 'light'}
                    >
                      Light Mode
                    </CommandItem>
                    <CommandItem
                      onSelect={() => runCommand(() => setTheme('dark'))}
                      icon={<Moon />}
                      active={theme === 'dark'}
                    >
                      Dark Mode
                    </CommandItem>
                    <CommandItem
                      onSelect={() => runCommand(() => setTheme('system'))}
                      icon={<Monitor />}
                      active={theme === 'system'}
                    >
                      System Theme
                    </CommandItem>
                  </Command.Group>

                  {/* Editor Actions */}
                  <Command.Group heading="Editor" className="px-2 py-2 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold select-none">
                    <CommandItem
                      onSelect={() => runCommand(() => console.log('Toggle preview'))}
                      icon={<Smartphone />}
                      shortcut="⌘P"
                    >
                      Toggle Preview
                    </CommandItem>
                    <CommandItem
                      onSelect={() => runCommand(() => console.log('Toggle code'))}
                      icon={<Code2 />}
                      shortcut="⌘⇧C"
                    >
                      Toggle Code View
                    </CommandItem>
                    <CommandItem
                      onSelect={() => runCommand(() => console.log('Export'))}
                      icon={<Download />}
                      shortcut="⌘E"
                    >
                      Export Xcode Project
                    </CommandItem>
                  </Command.Group>
                </Command.List>

                {/* Footer */}
                <div className="border-t border-white/5 bg-white/[0.02] px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">↵</kbd>
                      to select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">↓</kbd>
                      <kbd className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">↑</kbd>
                      to navigate
                    </span>
                  </div>
                </div>
              </Command>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface CommandItemProps {
  children: React.ReactNode;
  onSelect: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  active?: boolean;
}

function CommandItem({ children, onSelect, icon, shortcut, active }: CommandItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-3 text-sm outline-none transition-all duration-200',
        'data-[selected=true]:bg-white/10 data-[selected=true]:text-white',
        'text-muted-foreground',
        'group'
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 mr-3 group-data-[selected=true]:bg-white/20 transition-colors">
        {icon && <span className="h-3.5 w-3.5 opacity-70 group-data-[selected=true]:opacity-100">{icon}</span>}
      </div>
      <span className="flex-1 font-medium tracking-tight">{children}</span>

      {active && (
        <span className="mr-3 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
      )}

      {shortcut && (
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded bg-white/5 border border-white/10 px-1.5 font-mono text-[10px] font-medium opacity-70 group-data-[selected=true]:opacity-100 sm:flex">
          {shortcut}
        </kbd>
      )}

      {/* Selection Glow Indicator */}
      <motion.div
        layoutId="command-glow"
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-lg bg-primary opacity-0 group-data-[selected=true]:opacity-100 shadow-[0_0_12px_var(--primary)] text-primary"
        transition={{ duration: 0.15 }}
      />
    </Command.Item>
  );
}

// Hook to manage command palette state
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return { open, setOpen };
}
