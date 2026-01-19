'use client';

import { create } from 'zustand';
import { temporal, TemporalState } from 'zundo';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ComponentNode, AppConfig } from '@swiftship/core';
import { useStoreWithEqualityFn } from 'zustand/traditional';

export type EditorView = 'preview' | 'code' | 'split';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Design context configuration for AI generation
 */
export interface DesignContextConfig {
  styleId: string;
  isDarkMode: boolean;
  customColors?: {
    primary?: string;
    accent?: string;
  };
  userNotes?: string;
}

interface EditorState {
  // Project data (tracked for undo/redo)
  projectId: string | null;
  projectName: string;
  componentTree: ComponentNode | null;
  appConfig: AppConfig | null;
  generatedCode: string;

  // Chat state
  messages: Message[];

  // Design context state
  designContext: DesignContextConfig;

  // UI state (NOT tracked for undo/redo)
  activeView: EditorView;
  selectedNodeId: string | null;
  isGenerating: boolean;
  isSaving: boolean;
  error: string | null;
  zoom: number;
  isDarkMode: boolean;
  showDesignPanel: boolean;

  // Actions
  setProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setComponentTree: (tree: ComponentNode | null) => void;
  setAppConfig: (config: AppConfig | null) => void;
  setGeneratedCode: (code: string) => void;
  setActiveView: (view: EditorView) => void;
  setSelectedNodeId: (id: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setZoom: (zoom: number) => void;
  setDarkMode: (dark: boolean) => void;
  setDesignContext: (context: Partial<DesignContextConfig>) => void;
  setShowDesignPanel: (show: boolean) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  reset: () => void;
}

const defaultDesignContext: DesignContextConfig = {
  styleId: 'editorial',
  isDarkMode: false,
};

const initialState = {
  projectId: null,
  projectName: 'Untitled App',
  componentTree: null,
  appConfig: null,
  generatedCode: '',
  activeView: 'split' as EditorView,
  selectedNodeId: null,
  isGenerating: false,
  isSaving: false,
  error: null,
  messages: [] as Message[],
  zoom: 1.0,
  isDarkMode: false,
  designContext: defaultDesignContext,
  showDesignPanel: false,
};

// Create the base store with temporal (undo/redo) middleware
const editorStoreBase = create<EditorState>()(
  persist(
    temporal(
      (set) => ({
        ...initialState,

        setProjectId: (id) => set({ projectId: id }),
        setProjectName: (name) => set({ projectName: name }),
        setComponentTree: (tree) => set({ componentTree: tree }),
        setAppConfig: (config) => set({ appConfig: config }),
        setGeneratedCode: (code) => set({ generatedCode: code }),
        setActiveView: (view) => set({ activeView: view }),
        setSelectedNodeId: (id) => set({ selectedNodeId: id }),
        setIsGenerating: (generating) => set({ isGenerating: generating }),
        setIsSaving: (saving) => set({ isSaving: saving }),
        setError: (error) => set({ error }),
        setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(1.5, zoom)) }),
        setDarkMode: (dark) => set({ isDarkMode: dark }),
        setDesignContext: (context) =>
          set((state) => ({
            designContext: { ...state.designContext, ...context },
          })),
        setShowDesignPanel: (show) => set({ showDesignPanel: show }),
        addMessage: (role, content) =>
          set((state) => ({
            messages: [...state.messages, { role, content }],
          })),
        setMessages: (messages) => set({ messages }),
        clearMessages: () => set({ messages: [] }),
        reset: () => set(initialState),
      }),
      {
        // Only track document-related state for undo/redo
        partialize: (state) => ({
          componentTree: state.componentTree,
          generatedCode: state.generatedCode,
        }),
        limit: 50, // Memory management - max 50 undo states
      }
    ),
    {
      name: 'swiftship-editor-ui',
      storage: createJSONStorage(() => localStorage),
      // Only persist UI preferences and design context, not document state
      partialize: (state) => ({
        zoom: state.zoom,
        isDarkMode: state.isDarkMode,
        activeView: state.activeView,
        designContext: state.designContext,
      }),
    }
  )
);

// Export the main store hook
export const useEditorStore = editorStoreBase;

// Type for the temporal store
type EditorTemporalState = TemporalState<Pick<EditorState, 'componentTree' | 'generatedCode'>>;

// Helper hook to access the temporal store for undo/redo
export function useTemporalStore<T>(
  selector: (state: EditorTemporalState) => T
): T {
  return useStoreWithEqualityFn(useEditorStore.temporal, selector);
}

// Convenience hooks for common temporal operations
export function useCanUndo(): boolean {
  return useTemporalStore((state) => state.pastStates.length > 0);
}

export function useCanRedo(): boolean {
  return useTemporalStore((state) => state.futureStates.length > 0);
}

export function useUndo(): () => void {
  return useTemporalStore((state) => state.undo);
}

export function useRedo(): () => void {
  return useTemporalStore((state) => state.redo);
}

// Clear history (call when loading a new project)
export function clearHistory(): void {
  useEditorStore.temporal.getState().clear();
}
