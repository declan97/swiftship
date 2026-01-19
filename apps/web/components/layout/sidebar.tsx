'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Plus,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { sidebarVariants, springConfig } from '@/lib/animations';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard/projects/new', icon: Plus, label: 'New Project' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  // Keyboard shortcut to toggle sidebar
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onToggle();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onToggle]);

  return (
    <motion.aside
      className="h-screen bg-card border-r flex flex-col"
      variants={sidebarVariants}
      initial={false}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={springConfig.default}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                className="font-semibold text-lg tracking-tight"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                SwiftShip
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
              collapsed={collapsed}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t">
        <NavItem
          href="/dashboard"
          icon={FolderOpen}
          label="Projects"
          isActive={pathname === '/dashboard'}
          collapsed={collapsed}
        />
      </div>
    </motion.aside>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  collapsed: boolean;
}

function NavItem({ href, icon: Icon, label, isActive, collapsed }: NavItemProps) {
  return (
    <Link
      href={href as '/'}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

// Hook to manage sidebar state
export function useSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) {
      setCollapsed(stored === 'true');
    }
  }, []);

  const toggle = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  return { collapsed, toggle };
}
