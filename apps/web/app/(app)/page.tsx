'use client';

import Link from 'next/link';
import { Plus, Folder, Calendar, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Mock data for MVP - will be replaced with Convex queries
const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Todo App',
    description: 'A simple todo list application',
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Weather App',
    description: 'Weather forecast with location',
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    name: 'Notes App',
    description: 'Simple note-taking app',
    updatedAt: new Date('2024-01-10'),
  },
];

export default function DashboardPage() {
  const [projects] = useState(MOCK_PROJECTS);

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold">Projects</h1>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </header>

      {/* Projects grid */}
      <div className="p-6">
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: { id: string; name: string; description?: string; updatedAt: Date };
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative border rounded-xl bg-card hover:shadow-md transition-shadow">
      <Link href={`/projects/${project.id}`} className="block p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(project.updatedAt)}</span>
        </div>
      </Link>

      {/* Menu button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute top-12 right-4 bg-popover border rounded-lg shadow-lg py-1 z-10">
          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Folder className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
      <p className="text-muted-foreground mb-6">Create your first iOS app with AI</p>
      <Link
        href="/projects/new"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Project
      </Link>
    </div>
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
