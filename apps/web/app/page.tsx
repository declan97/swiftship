'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Sparkles,
  Smartphone,
  Download,
  Code2,
  Command,
  Zap,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  ChevronRight,
  GitCommit,
  Box,
  Braces
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { CommandPalette, useCommandPalette } from '@/components/shared/command-palette';
import { useState, useEffect, useRef } from 'react';

const PLACEHOLDER_TEXT = "Generate a crypto wallet with FaceID auth...";

export default function HomePage() {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();
  const [promptText, setPromptText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing effect
  useEffect(() => {
    if (isFocused || promptText !== '') return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < PLACEHOLDER_TEXT.length) {
        setPromptText(PLACEHOLDER_TEXT.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    if (promptText === PLACEHOLDER_TEXT || isTyping) {
      setPromptText('');
      setIsTyping(false);
    }
  };

  const handleGenerate = () => {
    const prompt = promptText.trim();
    if (!prompt || prompt === PLACEHOLDER_TEXT) return;

    const projectName = prompt.length > 30 ? prompt.slice(0, 30).trim() + '...' : prompt;
    const newId = `new-${Date.now()}`;
    router.push(`/dashboard/projects/${newId}?name=${encodeURIComponent(projectName)}&prompt=${encodeURIComponent(prompt)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-white font-sans">
      <CommandPalette open={open} onOpenChange={setOpen} />

      {/* Grid Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Terminal className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-tight font-mono">SwiftShip<span className="text-muted-foreground">_v2</span></span>
          </Link>

          <nav className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono hidden md:inline-block">Status: <span className="text-emerald-500">Operational</span></span>
            <div className="h-4 w-px bg-border hidden md:block" />
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex h-8 gap-2 text-muted-foreground font-mono text-xs"
              onClick={() => setOpen(true)}
            >
              <Command className="w-3 h-3" />
              <span>CMD+K</span>
            </Button>
            <ThemeToggle />
            <Button size="sm" className="h-8 rounded-md px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/dashboard/projects/new">
                Start Building
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-24">
        {/* Terminal Hero Section */}
        <section className="container mx-auto px-4 mb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              {/* Terminal Window */}
              <div className="rounded-xl border border-border bg-[#0D0D10] shadow-2xl overflow-hidden ring-1 ring-white/5">
                {/* Terminal Header */}
                <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex-1 text-center text-xs font-mono text-muted-foreground opacity-50">
                    ship — -zsh — 80x24
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="p-8 md:p-12 space-y-10">
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                      Ship Native. <br />
                      <span className="text-muted-foreground">Fast.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg font-light">
                      The component-first iOS builder for serious developers.
                    </p>
                  </div>

                  {/* Command Input Area */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center gap-3 bg-black/40 border border-white/10 p-4 rounded-lg">
                      <ChevronRight className="w-5 h-5 text-green-500" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none font-mono text-lg text-white placeholder:text-muted-foreground/50"
                        placeholder="Type a command..."
                      />
                      {isTyping && !isFocused && <span className="w-2.5 h-5 bg-white/50 animate-pulse" />}
                      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span>⏎</span>
                        <span>to run</span>
                      </div>
                    </div>
                  </div>

                  {/* TTY Output Simulation */}
                  <div className="font-mono text-sm space-y-1 text-muted-foreground/60">
                    <div className="flex gap-2">
                      <span className="text-green-500">✔</span>
                      <span>v2.0.4 initialized</span>
                      <span className="text-muted-foreground/30">12ms</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-500">✔</span>
                      <span>Context loaded: 43 components</span>
                      <span className="text-muted-foreground/30">45ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dense Feature Grid */}
        <section className="container mx-auto px-4 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/20 border border-border/20 rounded-lg overflow-hidden">
            {[
              {
                icon: Box,
                title: "Component Architecture",
                desc: "No hallucinations. Real, validated SwiftUI components that always compile.",
                metric: "100% Type Safe"
              },
              {
                icon: Zap,
                title: "Instant Preview",
                desc: "Browser-based simulator running compiled Swift logic via WASM/JS bridge.",
                metric: "<50ms Latency"
              },
              {
                icon: GitCommit,
                title: "Clean Export",
                desc: "Eject to Xcode anytime. The output is indistinguishable from hand-written code.",
                metric: "Zero Lock-in"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 group hover:bg-muted/5 transition-colors">
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded text-primary">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted p-1 rounded">
                    {feature.metric}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code/Architecture Demo */}
        <section className="container mx-auto px-4 mb-32">
          <div className="border border-border rounded-xl bg-[#0D0D10] overflow-hidden grid md:grid-cols-2">
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-border flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-primary mb-6">
                <Braces className="w-3 h-3" />
                <span>Architecture_v1</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Native. By Default.</h2>
              <p className="text-muted-foreground mb-8">
                SwiftShip doesn't guess. It constructs a validated component tree, ensuring structure and state are perfect before generating a single line of Swift.
              </p>

              <div className="space-y-3">
                {['Automatic Imports', 'State Management', 'View Modifiers', 'Accessibility Labels'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#050505] p-6 font-mono text-xs overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <div className="text-[10px] text-muted-foreground">MainView.swift</div>
              </div>
              <div className="text-purple-400">import</div> <span className="text-white">SwiftUI</span>
              <br /><br />
              <span className="text-purple-400">struct</span> <span className="text-yellow-400">MainView</span>: <span className="text-purple-400">View</span> {'{'}
              <br />
              &nbsp;&nbsp;<span className="text-purple-400">@State private var</span> <span className="text-blue-400">isLoading</span> = <span className="text-orange-400">false</span>
              <br /><br />
              &nbsp;&nbsp;<span className="text-purple-400">var</span> body: <span className="text-purple-400">some View</span> {'{'}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-400">ZStack</span> {'{'}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">Color</span>.black.ignoresSafeArea()
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-400">VStack</span>(spacing: <span className="text-orange-400">20</span>) {'{'}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-400">Text</span>(<span className="text-green-400">"Deploy Ready"</span>)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.font(.title.bold())
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.foregroundStyle(.white)
              <br />
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}
              <br />
                 &nbsp;&nbsp;&nbsp;&nbsp;{'}'}
              <br />
                 &nbsp;&nbsp;{'}'}
              <br />
                 {'}'}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 text-center pb-20">
          <div className="inline-block p-px bg-gradient-to-r from-transparent via-border to-transparent mb-8 w-full max-w-sm" />
          <h2 className="text-3xl font-bold mb-6">Start Shipping.</h2>
          <Button size="lg" className="h-12 px-8 font-mono text-sm" asChild>
            <Link href="/dashboard/projects/new">
              Initialize Project <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-60">
            <span className="font-mono text-xs text-muted-foreground">© 2026 SwiftShip LexCorp.</span>
          </div>
          <div className="flex gap-6 text-xs font-mono text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-primary transition-colors">API</Link>
            <Link href="#" className="hover:text-primary transition-colors">Keybase</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
