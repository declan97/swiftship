'use client';

import { useState, useCallback, use } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ComponentNode } from '@swiftship/core';
import { Canvas } from '@/components/editor/canvas';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const projectName = searchParams.get('name') || 'Untitled App';

  const [componentTree, setComponentTree] = useState<ComponentNode | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: message,
          currentTree: componentTree,
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

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message || "I've updated your app. Check the preview!",
        },
      ]);
    } catch (error) {
      console.error('Generation error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }, [componentTree]);

  const handleExport = useCallback(async () => {
    if (!componentTree) return;

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
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export project');
    }
  }, [projectName, componentTree]);

  return (
    <Canvas
      projectName={projectName}
      componentTree={componentTree}
      generatedCode={generatedCode}
      messages={messages}
      isGenerating={isGenerating}
      onSendMessage={handleSendMessage}
      onExport={handleExport}
      onNodeSelect={setSelectedNodeId}
      selectedNodeId={selectedNodeId}
    />
  );
}
