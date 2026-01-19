'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Smartphone,
  Download,
  Code2,
  Command,
  Zap,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { CommandPalette, useCommandPalette } from '@/components/shared/command-palette';
import { useState, useEffect, useRef } from 'react';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PLACEHOLDER_TEXT = "Create a fitness tracker app with healthkit integration...";

export default function HomePage() {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();
  const [promptText, setPromptText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing effect for the hero input (only when not focused)
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
    // Clear the placeholder text when user focuses
    if (promptText === PLACEHOLDER_TEXT || isTyping) {
      setPromptText('');
      setIsTyping(false);
    }
  };

  const handleGenerate = () => {
    const prompt = promptText.trim();
    if (!prompt || prompt === PLACEHOLDER_TEXT) return;

    // Generate a project name from the prompt
    const projectName = prompt.length > 30
      ? prompt.slice(0, 30).trim() + '...'
      : prompt;

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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <CommandPalette open={open} onOpenChange={setOpen} />

      {/* Background Effects */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">SwiftShip</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex h-8 gap-2 text-muted-foreground bg-muted/50 border border-transparent hover:border-border/50 transition-all font-normal"
              onClick={() => setOpen(true)}
            >
              <span className="text-xs">Search...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <ThemeToggle />
            <Button size="sm" className="h-8 rounded-full px-4 text-xs font-medium" asChild>
              <Link href="/dashboard/projects/new">
                Start Building
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium animate-in fade-in zoom-in duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 is now live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/40 pb-4">
              Dream it. <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Ship it.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The first AI-powered iOS development environment. <br className="hidden md:block" />
              Describe your app, and export production-ready SwiftUI code.
            </p>

            {/* Magical Input */}
            <div className="relative max-w-2xl mx-auto mt-12 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
              <div className="relative bg-background/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-3 shadow-2xl">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your iOS app idea..."
                  className="h-12 flex-1 bg-transparent font-mono text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {!isFocused && isTyping && (
                  <span className="animate-pulse w-0.5 h-6 bg-primary absolute right-[140px]" />
                )}
                <Button
                  size="lg"
                  className="rounded-xl shadow-lg shadow-primary/20"
                  onClick={handleGenerate}
                  disabled={!promptText.trim() || promptText === PLACEHOLDER_TEXT}
                >
                  Generate
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {['SwiftUI', 'CoreData', 'HealthKit', 'CloudKit', 'MapKit'].map((tech) => (
                <div key={tech} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                  {tech}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Bento Grid Features */}
        <section className="container mx-auto px-4 mb-32">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need to ship.</h2>
            <p className="text-muted-foreground text-lg">From idea to App Store, powered by intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Card 1: Simulator */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 row-span-2 rounded-3xl border bg-card/50 p-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Real-time Simulator</h3>
                </div>
                <p className="text-muted-foreground max-w-md mb-8">
                  Instant preview of your generated SwiftUI code in a browser-based iOS simulator. No Xcode required to iterate.
                </p>
                <div className="flex-1 relative">
                  {/* Mock iPhone UI */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[500px] bg-background border border-border shadow-2xl rounded-[40px] overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute top-0 w-full h-6 bg-black/5 flex justify-center items-center gap-1 z-20">
                      <div className="w-16 h-4 bg-black rounded-b-2xl" />
                    </div>
                    {/* Simulated App Content */}
                    <div className="p-4 pt-12 space-y-4">
                      <div className="h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg p-4 flex flex-col justify-between text-white">
                        <div className="w-8 h-8 rounded-full bg-white/20" />
                        <div className="h-4 w-24 bg-white/20 rounded" />
                      </div>
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-16 rounded-xl bg-muted/50 flex items-center gap-3 p-3">
                            <div className="w-10 h-10 rounded-full bg-muted" />
                            <div className="space-y-1">
                              <div className="h-3 w-24 bg-muted rounded" />
                              <div className="h-2 w-16 bg-muted/50 rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Code Quality */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-3xl border bg-card/50 p-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Clean SwiftUI</h3>
              </div>
              <div className="relative bg-black/40 rounded-xl p-4 font-mono text-xs text-muted-foreground overflow-hidden h-[180px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10" />
                <code className="block text-green-400">struct ContentView: View {'{'}</code>
                <code className="block pl-4 text-blue-400">@State private var</code>
                <code className="block pl-4 text-purple-400">var body: some View {'{'}</code>
                <code className="block pl-8 text-yellow-400">VStack(spacing: 20) {'{'}</code>
                <code className="block pl-12 text-blue-300">Text("Hello World")</code>
                <code className="block pl-12 text-blue-300">.font(.title)</code>
                <code className="block pl-8 text-yellow-400">{'}'}</code>
                <code className="block pl-4 text-purple-400">{'}'}</code>
                <code className="block text-green-400">{'}'}</code>
              </div>
            </motion.div>

            {/* Card 3: Export */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-3xl border bg-card/50 p-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Xcode Ready</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Download a complete, compilable Xcode project structure.
              </p>
              <div className="flex items-center justify-center h-32">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20" />
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                    <Terminal className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: AI Power */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-3 rounded-3xl border bg-card/50 p-8 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Zap className="w-3 h-3" />
                  Powered by GPT-4o
                </div>
                <h3 className="text-2xl font-bold">Intelligent Iteration</h3>
                <p className="text-muted-foreground">
                  Don't just generate once. Chat with the AI to refine your app. <br />
                  "Make the buttons rounded", "Add a dark mode toggle", "Connect to a mock API".
                </p>
              </div>
              <div className="flex-1 w-full max-w-sm bg-background border rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 bg-muted rounded-2xl rounded-tl-none p-3 text-sm">
                    I've updated the layout. Would you like me to add animations?
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-purple-500" />
                  </div>
                  <div className="flex-1 bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 text-sm">
                    Yes, lets make the cards fade in!
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works (Timeline) */}
        <section className="container mx-auto px-4 max-w-4xl mb-32">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            {[
              { icon: Command, title: "Describe", desc: "Type your app idea in plain, natural language." },
              { icon: Cpu, title: "Generate", desc: "Our AI constructs the component tree and logic." },
              { icon: CheckCircle2, title: "Refine", desc: "Preview instantly and iterate on the design." },
              { icon: Layers, title: "Export", desc: "Download the Xcode project and ship it." }
            ].map((step, i) => (
              <div key={i} className="relative flex gap-8 mb-12 last:mb-0 group">
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center shadow-lg group-hover:border-primary/50 transition-colors">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    {step.title}
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                  </h3>
                  <p className="text-muted-foreground text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 rounded-3xl p-12 md:p-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to build?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of developers building apps 10x faster.
              </p>
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20" asChild>
                <Link href="/dashboard/projects/new">
                  Start Building for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="font-semibold text-sm">SwiftShip</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SwiftShip Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Twitter</Link>
            <Link href="#" className="hover:text-foreground">GitHub</Link>
            <Link href="#" className="hover:text-foreground">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
