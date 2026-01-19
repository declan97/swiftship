'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Folder, Calendar, MoreHorizontal, Trash2, Grid, List, Search } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedCard } from '@/components/ui/card';
import { NoProjectsEmptyState } from '@/components/shared/empty-state';
import { SkeletonProjectCard } from '@/components/shared/skeleton';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { staggerContainer, staggerItem, springConfig } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

// Prevent static generation since this page uses Convex
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const projects = useQuery(api.projects.list);
  const deleteProject = useMutation(api.projects.remove);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const isLoading = projects === undefined;

  const filteredProjects = (projects ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProject = async (projectId: Id<'projects'>) => {
    try {
      await deleteProject({ id: projectId });
      toast.success('Project deleted');
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="h-16 border-b glass sticky top-0 z-20 flex items-center justify-between px-6">
        <motion.h1
          className="text-xl font-semibold"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springConfig.gentle}
        >
          Projects
        </motion.h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <ThemeToggle />

          <Button asChild size="touch">
            <Link href="/dashboard/projects/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </Button>
        </div>
      </header>

      {/* Mobile search */}
      <div className="sm:hidden p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            )}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonProjectCard key={i} />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          searchQuery ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">
                No projects found for &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="link"
                onClick={() => setSearchQuery('')}
                className="mt-2"
              >
                Clear search
              </Button>
            </motion.div>
          ) : (
            <NoProjectsEmptyState onCreateProject={() => router.push('/dashboard/projects/new')} />
          )
        ) : (
          <motion.div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            )}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                viewMode={viewMode}
                onDelete={() => handleDeleteProject(project._id)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  viewMode,
  onDelete,
}: {
  project: { _id: Id<'projects'>; name: string; description?: string; updatedAt: number };
  viewMode: 'grid' | 'list';
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (viewMode === 'list') {
    return (
      <motion.div variants={staggerItem}>
        <AnimatedCard className="p-4">
          <Link href={`/dashboard/projects/${project._id}`} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Folder className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(new Date(project.updatedAt))}</span>
            </div>
          </Link>
        </AnimatedCard>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerItem} className="relative group">
      <AnimatedCard className="overflow-hidden">
        {/* Preview thumbnail placeholder */}
        <div className="h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <Folder className="w-12 h-12 text-muted-foreground/50" />
        </div>

        <Link href={`/dashboard/projects/${project._id}`} className="block p-4">
          <h3 className="font-medium truncate">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatDate(new Date(project.updatedAt))}</span>
          </div>
        </Link>
      </AnimatedCard>

      {/* Menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>

      {/* Dropdown menu */}
      {showMenu && (
        <motion.div
          className="absolute top-12 right-2 bg-popover border rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={springConfig.default}
        >
          <button
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors min-h-[40px]"
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString();
}
