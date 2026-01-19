import { create } from 'zustand';
import type { ComponentNode, AppConfig } from '@swiftship/core';

export type EditorView = 'preview' | 'code' | 'split';

interface EditorState {
  // Project data
  projectId: string | null;
  projectName: string;
  componentTree: ComponentNode | null;
  appConfig: AppConfig | null;
  generatedCode: string;

  // UI state
  activeView: EditorView;
  selectedNodeId: string | null;
  isGenerating: boolean;
  isSaving: boolean;
  error: string | null;

  // Chat state
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  pendingPrompt: string;

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
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  setPendingPrompt: (prompt: string) => void;
  reset: () => void;
}

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
  messages: [],
  pendingPrompt: '',
};

export const useEditorStore = create<EditorState>((set) => ({
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
  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { role, content }],
    })),
  clearMessages: () => set({ messages: [] }),
  setPendingPrompt: (prompt) => set({ pendingPrompt: prompt }),
  reset: () => set(initialState),
}));
