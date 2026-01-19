'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Download, Code2, FileCode } from 'lucide-react';
import { Button, MotionButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { springConfig, fadeInUp } from '@/lib/animations';
import { toast } from 'sonner';

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
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-4 py-3 border-b glass"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springConfig.gentle}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <FileCode className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <span className="text-sm font-medium">{fileName}</span>
            <p className="text-xs text-muted-foreground">Swift • SwiftUI</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-9 w-9"
            title="Copy code"
            disabled={!code}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Check className="w-4 h-4 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          {onExport && (
            <MotionButton
              size="sm"
              onClick={onExport}
              className="gap-2"
              disabled={!code}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Xcode</span>
            </MotionButton>
          )}
        </div>
      </motion.div>

      {/* Code */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {code ? (
            <motion.pre
              key="code"
              className="p-4 text-sm font-mono leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <code>{highlightSwift(code)}</code>
            </motion.pre>
          ) : (
            <motion.div
              key="empty"
              className="flex items-center justify-center h-full"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
            >
              <div className="text-center text-muted-foreground">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Code2 className="w-8 h-8 opacity-50" />
                </motion.div>
                <p className="text-sm font-medium">No code generated yet</p>
                <p className="text-xs mt-1 text-muted-foreground/70">
                  Use the chat to generate your app
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          <span key={key++} className="text-emerald-600 dark:text-emerald-400 italic">
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
          <span key={key++} className="text-rose-600 dark:text-rose-400">
            {stringMatch[1]}
          </span>
        );
        remaining = remaining.slice(stringMatch[1].length);
        continue;
      }

      // Keywords
      const keywordMatch = remaining.match(
        /^(import|struct|class|func|var|let|if|else|for|while|return|some|private|public|internal|fileprivate|@main|@State|@Binding|@Environment|@Published|@Observable|@ObservedObject|@StateObject|@ViewBuilder)\b/
      );
      if (keywordMatch) {
        parts.push(
          <span key={key++} className="text-violet-600 dark:text-violet-400 font-semibold">
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
          <span key={key++} className="text-sky-600 dark:text-sky-400">
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
          <span key={key++} className="text-amber-600 dark:text-amber-400">
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
          <span key={key++} className="text-teal-600 dark:text-teal-400">
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
      <motion.div
        key={lineIndex}
        className="min-h-[1.5em] hover:bg-muted/30 transition-colors -mx-4 px-4"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(lineIndex * 0.01, 0.5) }}
      >
        <span className="text-muted-foreground/40 select-none mr-4 inline-block w-8 text-right tabular-nums">
          {lineIndex + 1}
        </span>
        {parts}
      </motion.div>
    );
  });
}
