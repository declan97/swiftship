'use client';

import { useEffect, useCallback, use, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from 'sonner';
import type { ComponentNode } from '@swiftship/core';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Canvas } from '@/components/editor/canvas';
import {
  useEditorStore,
  useCanUndo,
  useCanRedo,
  useUndo,
  useRedo,
  clearHistory,
} from '@/lib/stores/editor';

// Cross-platform undo/redo detection
function isUndoEvent(e: KeyboardEvent): boolean {
  return (e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey;
}

function isRedoEvent(e: KeyboardEvent): boolean {
  return (
    ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) ||
    (e.ctrlKey && e.key === 'y')
  );
}

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlProjectName = searchParams.get('name');
  const urlInitialPrompt = searchParams.get('prompt');

  // Track if we've already sent the initial prompt
  const initialPromptSentRef = useRef(false);

  // Zustand store
  const {
    projectName,
    componentTree,
    generatedCode,
    messages,
    isGenerating,
    isSaving,
    selectedNodeId,
    designContext,
    showDesignPanel,
    setProjectId,
    setProjectName,
    setComponentTree,
    setGeneratedCode,
    setMessages,
    addMessage,
    setIsGenerating,
    setIsSaving,
    setSelectedNodeId,
    setDesignContext,
    setShowDesignPanel,
  } = useEditorStore();

  // Undo/redo hooks
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const undo = useUndo();
  const redo = useRedo();

  // Check if this is a new project (temporary ID)
  const isNewProject = id.startsWith('new-');

  // Convex queries and mutations
  const project = useQuery(
    api.projects.get,
    isNewProject ? 'skip' : { id: id as Id<'projects'> }
  );
  const convexMessages = useQuery(
    api.projects.getMessages,
    isNewProject ? 'skip' : { projectId: id as Id<'projects'> }
  );
  const createProject = useMutation(api.projects.create);
  const updateComponentTree = useMutation(api.projects.updateComponentTree);
  const updateGeneratedCode = useMutation(api.projects.updateGeneratedCode);
  const addMessageMutation = useMutation(api.messages.add);

  // Hydrate store when project loads from Convex
  useEffect(() => {
    if (project && !isNewProject) {
      setProjectId(id);
      setProjectName(project.name);
      if (project.componentTree) {
        setComponentTree(project.componentTree as ComponentNode);
      }
      if (project.generatedCode) {
        setGeneratedCode(project.generatedCode);
      }
      // Clear undo history when loading a new project
      clearHistory();
    } else if (isNewProject && urlProjectName) {
      setProjectId(id);
      setProjectName(urlProjectName);
      setComponentTree(null);
      setGeneratedCode('');
      setMessages([]);
      clearHistory();
    }
  }, [project?._id, isNewProject, urlProjectName]);

  // Sync messages from Convex
  useEffect(() => {
    if (convexMessages && !isNewProject) {
      setMessages(
        convexMessages.map((m) => ({ role: m.role, content: m.content }))
      );
    }
  }, [convexMessages, isNewProject]);

  // Debounced auto-save for component tree
  const debouncedSaveTree = useDebouncedCallback(
    async (tree: ComponentNode, projectId: string) => {
      if (projectId.startsWith('new-')) return;

      setIsSaving(true);
      try {
        await updateComponentTree({
          id: projectId as Id<'projects'>,
          componentTree: tree,
        });
      } catch (error) {
        console.error('Failed to save component tree:', error);
        toast.error('Failed to save');
      } finally {
        setIsSaving(false);
      }
    },
    1000,
    { leading: false, trailing: true }
  );

  // Debounced auto-save for generated code
  const debouncedSaveCode = useDebouncedCallback(
    async (code: string, projectId: string) => {
      if (projectId.startsWith('new-')) return;

      try {
        await updateGeneratedCode({
          id: projectId as Id<'projects'>,
          generatedCode: code,
        });
      } catch (error) {
        console.error('Failed to save code:', error);
      }
    },
    1000,
    { leading: false, trailing: true }
  );

  // Auto-save when component tree changes
  useEffect(() => {
    if (componentTree && id && !isNewProject) {
      debouncedSaveTree(componentTree, id);
    }
  }, [componentTree, id, isNewProject]);

  // Auto-save when generated code changes
  useEffect(() => {
    if (generatedCode && id && !isNewProject) {
      debouncedSaveCode(generatedCode, id);
    }
  }, [generatedCode, id, isNewProject]);

  // Flush pending saves on unmount
  useEffect(() => {
    return () => {
      debouncedSaveTree.flush();
      debouncedSaveCode.flush();
    };
  }, []);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (isUndoEvent(e)) {
        e.preventDefault();
        if (canUndo) undo();
      } else if (isRedoEvent(e)) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // Handle sending messages
  const handleSendMessage = useCallback(
    async (message: string) => {
      addMessage('user', message);
      setIsGenerating(true);

      // Save message to Convex if not a new project
      if (!isNewProject) {
        try {
          await addMessageMutation({
            projectId: id as Id<'projects'>,
            role: 'user',
            content: message,
          });
        } catch (error) {
          console.error('Failed to save message:', error);
        }
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: message,
            currentTree: componentTree,
            designContext: {
              styleId: designContext.styleId,
              isDarkMode: designContext.isDarkMode,
              customColors: designContext.customColors,
              userNotes: designContext.userNotes,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate');
        }

        const data = await response.json();

        if (data.componentTree) {
          setComponentTree(data.componentTree);
        }

        if (data.generatedCode) {
          setGeneratedCode(data.generatedCode);
        }

        const assistantMessage =
          data.message || "I've updated your app. Check the preview!";
        addMessage('assistant', assistantMessage);

        // Save assistant message to Convex
        if (!isNewProject) {
          try {
            await addMessageMutation({
              projectId: id as Id<'projects'>,
              role: 'assistant',
              content: assistantMessage,
            });
          } catch (error) {
            console.error('Failed to save message:', error);
          }
        }

        // If this is a new project and we got a component tree, create the project
        if (isNewProject && data.componentTree) {
          try {
            const newProjectId = await createProject({
              name: projectName,
              description: message,
            });
            // Update the component tree in the new project
            await updateComponentTree({
              id: newProjectId,
              componentTree: data.componentTree,
            });
            if (data.generatedCode) {
              await updateGeneratedCode({
                id: newProjectId,
                generatedCode: data.generatedCode,
              });
            }
            // Navigate to the new project
            router.replace(`/dashboard/projects/${newProjectId}`);
            toast.success('Project created!');
          } catch (error) {
            console.error('Failed to create project:', error);
            toast.error('Failed to save project');
          }
        }
      } catch (error) {
        console.error('Generation error:', error);
        addMessage(
          'assistant',
          'Sorry, something went wrong. Please try again.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [componentTree, id, isNewProject, projectName, designContext]
  );

  // Auto-send initial prompt from URL (for new projects)
  useEffect(() => {
    if (
      isNewProject &&
      urlInitialPrompt &&
      !initialPromptSentRef.current &&
      !isGenerating &&
      messages.length === 0
    ) {
      initialPromptSentRef.current = true;
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        handleSendMessage(urlInitialPrompt);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isNewProject, urlInitialPrompt, isGenerating, messages.length, handleSendMessage]);

  // Handle export
  const handleExport = useCallback(async () => {
    if (!componentTree) {
      toast.error('Nothing to export yet');
      return;
    }

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          componentTree,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export');
      }

      // Download the ZIP file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Project exported!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export project');
    }
  }, [projectName, componentTree]);

  // Handle save (for new projects)
  const handleSave = useCallback(async () => {
    if (!isNewProject) {
      // For existing projects, auto-save handles it
      toast.success('All changes saved');
      return;
    }

    if (!componentTree) {
      toast.error('Generate something first before saving');
      return;
    }

    setIsSaving(true);
    try {
      const newProjectId = await createProject({
        name: projectName,
      });
      await updateComponentTree({
        id: newProjectId,
        componentTree,
      });
      if (generatedCode) {
        await updateGeneratedCode({
          id: newProjectId,
          generatedCode,
        });
      }
      router.replace(`/dashboard/projects/${newProjectId}`);
      toast.success('Project saved!');
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  }, [isNewProject, componentTree, generatedCode, projectName]);

  // Loading state for existing projects
  if (!isNewProject && project === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  // Not found state
  if (!isNewProject && project === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-muted-foreground">Project not found</div>
        <button
          onClick={() => router.push('/dashboard/projects/new')}
          className="text-primary hover:underline"
        >
          Create a new project
        </button>
      </div>
    );
  }

  return (
    <Canvas
      projectName={projectName}
      componentTree={componentTree}
      generatedCode={generatedCode}
      messages={messages}
      isGenerating={isGenerating}
      isSaving={isSaving}
      onSendMessage={handleSendMessage}
      onSave={handleSave}
      onExport={handleExport}
      onNodeSelect={setSelectedNodeId}
      selectedNodeId={selectedNodeId}
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={undo}
      onRedo={redo}
      designContext={designContext}
      onDesignContextChange={setDesignContext}
      showDesignPanel={showDesignPanel}
      onShowDesignPanelChange={setShowDesignPanel}
    />
  );
}
