'use client';

import { Sidebar, useSidebar } from '@/components/layout/sidebar';
import { CommandPalette, useCommandPalette } from '@/components/shared/command-palette';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { collapsed, toggle } = useSidebar();
  const { open, setOpen } = useCommandPalette();

  return (
    <div className="flex h-screen bg-background">
      <CommandPalette open={open} onOpenChange={setOpen} />

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">{children}</main>
    </div>
  );
}
