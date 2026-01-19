import Link from 'next/link';
import { Sparkles, FolderOpen, Settings } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-4 border-b">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">SwiftShip</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <NavItem href="/projects/new" icon={<Sparkles className="w-4 h-4" />}>
              New Project
            </NavItem>
            <NavItem href="/" icon={<FolderOpen className="w-4 h-4" />}>
              Projects
            </NavItem>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <NavItem href="/settings" icon={<Settings className="w-4 h-4" />}>
            Settings
          </NavItem>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        {icon}
        {children}
      </Link>
    </li>
  );
}
