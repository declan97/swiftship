'use client';

import { useState } from 'react';
import { Copy, Check, Download, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeViewProps {
  code: string;
  fileName?: string;
  onExport?: () => void;
}

export function CodeView({ code, fileName = 'ContentView.swift', onExport }: CodeViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="p-1.5 rounded hover:bg-muted transition-colors"
              title="Export Xcode project"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto">
        {code ? (
          <pre className="p-4 text-sm font-mono leading-relaxed">
            <code>{highlightSwift(code)}</code>
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No code generated yet</p>
              <p className="text-xs mt-1">Use the chat to generate your app</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Swift syntax highlighting
function highlightSwift(code: string): React.ReactNode {
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Process the line for syntax highlighting
    while (remaining.length > 0) {
      // Comments
      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        parts.push(
          <span key={key++} className="text-green-600 dark:text-green-400">
            {commentMatch[1]}
          </span>
        );
        remaining = remaining.slice(commentMatch[1].length);
        continue;
      }

      // String literals
      const stringMatch = remaining.match(/^("(?:[^"\\]|\\.)*")/);
      if (stringMatch) {
        parts.push(
          <span key={key++} className="text-red-600 dark:text-red-400">
            {stringMatch[1]}
          </span>
        );
        remaining = remaining.slice(stringMatch[1].length);
        continue;
      }

      // Keywords
      const keywordMatch = remaining.match(
        /^(import|struct|class|func|var|let|if|else|for|while|return|some|@main|@State|@Binding|@Environment|@Published|@Observable|@ObservedObject|@StateObject|@ViewBuilder)\b/
      );
      if (keywordMatch) {
        parts.push(
          <span key={key++} className="text-purple-600 dark:text-purple-400 font-medium">
            {keywordMatch[1]}
          </span>
        );
        remaining = remaining.slice(keywordMatch[1].length);
        continue;
      }

      // Types
      const typeMatch = remaining.match(
        /^(View|App|Scene|WindowGroup|Text|Button|VStack|HStack|ZStack|List|NavigationStack|NavigationLink|Image|Label|Toggle|TextField|Picker|Slider|ScrollView|TabView|ForEach|Section|Spacer|Divider|Color|Font|String|Int|Double|Bool|Array|Dictionary|Optional|some)\b/
      );
      if (typeMatch) {
        parts.push(
          <span key={key++} className="text-blue-600 dark:text-blue-400">
            {typeMatch[1]}
          </span>
        );
        remaining = remaining.slice(typeMatch[1].length);
        continue;
      }

      // Numbers
      const numberMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numberMatch) {
        parts.push(
          <span key={key++} className="text-orange-600 dark:text-orange-400">
            {numberMatch[1]}
          </span>
        );
        remaining = remaining.slice(numberMatch[1].length);
        continue;
      }

      // Modifiers (dot methods)
      const modifierMatch = remaining.match(/^(\.[a-zA-Z_][a-zA-Z0-9_]*)/);
      if (modifierMatch) {
        parts.push(
          <span key={key++} className="text-cyan-600 dark:text-cyan-400">
            {modifierMatch[1]}
          </span>
        );
        remaining = remaining.slice(modifierMatch[1].length);
        continue;
      }

      // Default: single character
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }

    return (
      <div key={lineIndex} className="min-h-[1.5em]">
        <span className="text-muted-foreground/50 select-none mr-4 inline-block w-8 text-right">
          {lineIndex + 1}
        </span>
        {parts}
      </div>
    );
  });
}
