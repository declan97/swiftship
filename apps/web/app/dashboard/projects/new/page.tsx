'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);

    // Navigate to editor with name and optional prompt (description)
    const newId = `new-${Date.now()}`;
    const params = new URLSearchParams({ name });
    if (description.trim()) {
      params.set('prompt', description.trim());
    }
    router.push(`/dashboard/projects/${newId}?${params.toString()}`);
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="h-14 border-b flex items-center gap-4 px-6">
        <Link href="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-semibold">New Project</h1>
      </header>

      {/* Form */}
      <div className="max-w-xl mx-auto p-6">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Create a new iOS app</h2>
          <p className="text-muted-foreground mt-2">
            Give your project a name, then use AI to build it
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My iOS App"
              className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your app..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || isCreating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Create Project
              </>
            )}
          </button>
        </form>

        {/* Quick start templates */}
        <div className="mt-12">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Or start from a template</h3>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.name}
                onClick={() => {
                  setName(template.name);
                  setDescription(template.description);
                }}
                className="p-4 border rounded-lg text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-2xl mb-2 block">{template.icon}</span>
                <span className="font-medium block">{template.name}</span>
                <span className="text-xs text-muted-foreground">{template.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TEMPLATES = [
  {
    name: 'Todo App',
    description: 'Task list with add/delete',
    icon: '✅',
  },
  {
    name: 'Notes App',
    description: 'Simple note-taking',
    icon: '📝',
  },
  {
    name: 'Weather App',
    description: 'Current weather display',
    icon: '🌤️',
  },
  {
    name: 'Settings Screen',
    description: 'iOS-style settings',
    icon: '⚙️',
  },
];
