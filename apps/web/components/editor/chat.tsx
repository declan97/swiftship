'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles, User, Bot, Lightbulb } from 'lucide-react';
import { Button, MotionButton } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { springConfig, staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  messages: Message[];
  isGenerating: boolean;
  onSend: (message: string) => void;
}

const SUGGESTIONS = [
  'Create a todo app with a list and add button',
  'Build a settings screen with toggles',
  'Design a profile page with avatar and stats',
  'Make a weather app with current conditions',
];

export function Chat({ messages, isGenerating, onSend }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isGenerating) {
      onSend(suggestion);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <motion.div
        className="px-4 py-3 border-b glass"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springConfig.gentle}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Describe your app or ask for changes</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              className="py-8"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Lightbulb className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-sm font-medium">Start by describing your app idea</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try one of these suggestions or write your own
                </p>
              </div>

              <motion.div
                className="space-y-2"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {SUGGESTIONS.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    variants={staggerItem}
                    className="w-full p-3 text-left text-sm rounded-lg border bg-card hover:bg-accent hover:border-primary/20 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={springConfig.gentle}
                className={cn('flex gap-3', message.role === 'user' ? 'flex-row-reverse' : '')}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-md'
                      : 'bg-muted rounded-tl-md'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Generating indicator */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Generating...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.form
        onSubmit={handleSubmit}
        className="p-4 border-t glass"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springConfig.gentle, delay: 0.1 }}
      >
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your app..."
            disabled={isGenerating}
            rows={1}
            className="flex-1 resize-none min-h-[44px] max-h-[120px]"
          />
          <MotionButton
            type="submit"
            size="icon"
            disabled={!input.trim() || isGenerating}
            className="h-11 w-11 shrink-0"
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Send className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </MotionButton>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Enter</kbd> to
          send, <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Shift+Enter</kbd>{' '}
          for new line
        </p>
      </motion.form>
    </div>
  );
}
