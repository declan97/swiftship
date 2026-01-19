# ✨ feat: Premium UI/UX Redesign

> Transform SwiftShip into a world-class design tool with a beautiful, sleek, and seamless user experience inspired by Linear, Lovable, Bolt, v0.dev, Slack, and other top-tier products.

**Type:** Enhancement
**Priority:** High
**Complexity:** Large
**Date:** 2026-01-19
**Deepened:** 2026-01-19

---

## Enhancement Summary

**Research agents used:** 10 parallel agents
- Frontend Design Skill Analysis
- TypeScript Reviewer
- Performance Oracle
- Accessibility Reviewer
- Code Simplicity Reviewer
- Architecture Strategist
- Security Sentinel
- Motion/Animation Best Practices
- shadcn/ui Theming Research
- Command Palette Implementation

### Key Improvements from Research

1. **Typography Overhaul**: Replace Inter (flagged as "AI slop") with JetBrains Mono + Satoshi for a distinctive "Terminal Meets Tomorrow" aesthetic
2. **Accessibility Fixes**: Critical gaps identified - touch targets need 44px minimum (currently 28-32px), color contrast borderline
3. **Performance Optimization**: Bundle impact ~70-150kb; recommend `motion/mini` (~4kb), CSS animations where possible
4. **Security Patterns**: DOMPurify for AI responses, path sanitization for ZIP export, CSP headers
5. **Simplified Architecture**: Consider reducing from 4 phases to 2, from 20+ files to 8-10 core files

### Critical Warnings

- **Inter font is overused** - Every AI tool uses it, making SwiftShip look generic
- **Touch targets too small** - 28-32px fails WCAG; buttons need 44px minimum
- **Motion library heavy** - Use `motion/mini` or CSS animations instead of full library
- **Color contrast borderline** - oklch values need verification for WCAG AA

---

## Overview

SwiftShip is an AI-powered iOS app generator that currently has a functional but basic UI. This redesign will elevate the visual design, interaction patterns, and overall user experience to match the quality expectations of modern developer tools.

**Target Inspiration:**
- **Linear** - Dark mode excellence, keyboard-first, glassmorphism
- **Lovable/Bolt/v0.dev** - AI-native interfaces, progressive disclosure, live preview
- **Slack** - Rich chat experience, notification patterns
- **Vercel** - Gradient accents, typography, loading states

---

## Problem Statement

### Current State
The existing SwiftShip UI is functional but lacks:
1. **Visual polish** - Generic Tailwind styling without distinctive personality
2. **Micro-interactions** - No animations, hover effects feel basic
3. **Loading states** - Simple spinners without progressive feedback
4. **Empty states** - Minimal placeholder content
5. **Error handling** - Uses `alert()` instead of proper toast notifications
6. **Dark mode refinement** - Functional but not optimized for contrast/aesthetics
7. **Mobile responsiveness** - Sidebar always visible, panels don't collapse
8. **Keyboard shortcuts** - No command palette or keyboard navigation

### Impact
- Users may perceive the tool as unfinished or unreliable
- First impressions don't convey the power of the underlying technology
- Compares unfavorably to competitors like Lovable and Bolt
- Missed opportunity to build brand recognition through distinctive design

---

## Proposed Solution

A comprehensive UI/UX overhaul across 4 phases:

1. **Design Foundation** - Theme system, typography, colors, spacing
2. **Component Library** - shadcn/ui integration, custom components
3. **Page Redesigns** - Landing, dashboard, editor experiences
4. **Polish & Delight** - Animations, micro-interactions, loading states

---

## Technical Approach

### Architecture

```
apps/web/
├── app/
│   ├── globals.css          # Theme variables, base styles
│   ├── layout.tsx           # Root with theme provider
│   └── (app)/               # App routes
├── components/
│   ├── ui/                  # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── toast.tsx
│   │   ├── command.tsx      # Command palette
│   │   └── ...
│   ├── editor/              # Editor-specific components
│   │   ├── canvas.tsx       # Redesigned main canvas
│   │   ├── preview.tsx      # Enhanced iOS preview
│   │   ├── chat.tsx         # Rich chat experience
│   │   └── code-view.tsx    # Improved syntax highlighting
│   ├── layout/              # Layout components
│   │   ├── sidebar.tsx      # Collapsible sidebar
│   │   ├── header.tsx       # Top navigation
│   │   └── mobile-nav.tsx   # Mobile drawer
│   └── shared/              # Shared components
│       ├── empty-state.tsx
│       ├── loading-skeleton.tsx
│       ├── animated-card.tsx
│       └── gradient-text.tsx
├── lib/
│   ├── animations.ts        # Motion variants
│   └── theme.ts             # Theme utilities
└── hooks/
    ├── use-theme.ts
    ├── use-keyboard-shortcuts.ts
    └── use-command-palette.ts
```

### Color System (oklch-based)

```css
/* globals.css */
:root {
  /* Brand Colors */
  --color-brand-50: oklch(0.98 0.01 250);
  --color-brand-100: oklch(0.95 0.03 250);
  --color-brand-500: oklch(0.60 0.18 250);  /* Primary */
  --color-brand-600: oklch(0.52 0.20 250);  /* Hover */
  --color-brand-900: oklch(0.25 0.08 250);

  /* Semantic Tokens */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(0.99 0 0);
  --muted: oklch(0.96 0.005 250);
  --muted-foreground: oklch(0.45 0.01 250);
  --border: oklch(0.92 0.005 250);

  /* Accent Gradient */
  --gradient-start: oklch(0.60 0.18 250);
  --gradient-end: oklch(0.65 0.16 200);
}

.dark {
  --background: oklch(0.12 0.005 250);
  --foreground: oklch(0.95 0 0);
  --card: oklch(0.16 0.01 250);
  --muted: oklch(0.20 0.01 250);
  --muted-foreground: oklch(0.65 0.01 250);
  --border: oklch(0.25 0.01 250);
}
```

### Typography Scale

```css
/* Font configuration - UPDATED based on research */
/* WARNING: Inter is flagged as "AI slop" - every AI tool uses it */
--font-sans: "Satoshi", system-ui, sans-serif;      /* Distinctive alternative */
--font-display: "Space Grotesk", "Satoshi", sans-serif;  /* Bold display font */
--font-mono: "JetBrains Mono", ui-monospace, monospace;

/* Type scale using clamp() for fluid sizing */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
--text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
--text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem);
```

#### Research Insight: Typography
**From Frontend Design Agent:**
> "Inter is the default font for literally every AI-generated interface. Using it signals 'this was made by an AI' before users even interact."

**Recommended alternatives:**
- **Satoshi** - Modern geometric sans with personality
- **Space Grotesk** - Technical feel without being cold
- **JetBrains Mono** - Excellent for code, maintains "developer tool" vibe

**Font loading strategy:**
```tsx
// Use next/font for optimal loading
import { Space_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'  // Prevent FOIT
});

const satoshi = localFont({
  src: './fonts/Satoshi-Variable.woff2',
  variable: '--font-sans',
  display: 'swap'
});
```

---

## Implementation Phases

### Phase 1: Design Foundation (Days 1-2)

**Objective:** Establish the design system that all components will build on.

#### Tasks

- [ ] **1.1 Install Motion library**
  ```bash
  pnpm add motion
  ```
  - File: `apps/web/package.json`

- [ ] **1.2 Create theme system**
  - File: `apps/web/app/globals.css`
  - Implement oklch-based color variables
  - Add gradient definitions
  - Set up typography scale
  - Configure custom scrollbar styles
  - Add reduced-motion media queries

- [ ] **1.3 Set up theme provider**
  - File: `apps/web/components/providers/theme-provider.tsx`
  - Implement system/light/dark mode toggle
  - Add localStorage persistence
  - Add flash-prevention script

- [ ] **1.4 Configure fonts**
  - File: `apps/web/app/layout.tsx`
  - Add Cal Sans (local) for headings
  - Configure Inter with variable font
  - Add JetBrains Mono for code

- [ ] **1.5 Create animation library**
  - File: `apps/web/lib/animations.ts`
  - Define reusable Motion variants
  - Create stagger patterns
  - Set up spring configurations

#### Research Insight: Motion Library

**From Performance Oracle:**
> "Full Motion library adds ~15kb gzipped. For simple animations, use `motion/mini` (~4kb) or CSS animations."

**Recommended approach:**
```bash
# Use mini bundle for smaller footprint
pnpm add motion
# Import from mini bundle
import { animate } from 'motion/mini'
```

**CSS-first animation patterns (no JS needed):**
```css
/* Stagger children with CSS */
.stagger > * {
  animation: fadeIn 0.3s ease-out both;
}
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 50ms; }
.stagger > *:nth-child(3) { animation-delay: 100ms; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Motion patterns (when needed):**
```tsx
// New import path in 2025+
import { motion, AnimatePresence } from 'motion/react';

// Optimized spring config
const springConfig = { stiffness: 400, damping: 30 };

// Page transition with AnimatePresence
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: 'spring', ...springConfig }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Deliverable:** Theme system with dark mode, typography, and animation primitives.

---

### Phase 2: Component Library (Days 3-5)

**Objective:** Build/customize shadcn/ui components with our design language.

#### Tasks

- [ ] **2.1 Initialize shadcn/ui**
  ```bash
  pnpm dlx shadcn-ui@latest init
  ```
  - File: `apps/web/components.json`
  - Configure with new theme

- [ ] **2.2 Install core components**
  ```bash
  pnpm dlx shadcn-ui@latest add button card input textarea toast sonner dialog command tooltip
  ```
  - Files: `apps/web/components/ui/*.tsx`

- [ ] **2.3 Customize button component**
  - File: `apps/web/components/ui/button.tsx`
  - Add gradient variant
  - Add loading state with spinner
  - Add success/error states
  - Implement press animation

- [ ] **2.4 Create command palette**
  - File: `apps/web/components/shared/command-palette.tsx`
  - Keyboard shortcut: `Cmd+K`
  - Actions: New project, switch view, toggle theme, export
  - Search across projects

#### Research Insight: Command Palette (cmdk)

**From Command Palette Research Agent:**

**Installation and setup:**
```bash
pnpm add cmdk
```

**Production-ready implementation:**
```tsx
'use client';
import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Global keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <motion.div
            className="fixed left-1/2 top-1/4 -translate-x-1/2 z-50 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
          >
            <Command
              className="rounded-xl border bg-card shadow-2xl overflow-hidden"
              loop
            >
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search commands..."
                className="w-full px-4 py-3 text-lg border-b bg-transparent outline-none"
              />
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Projects">
                  <CommandItem onSelect={() => { /* navigate */ }}>
                    <PlusIcon /> New Project
                    <kbd className="ml-auto">⌘N</kbd>
                  </CommandItem>
                </Command.Group>

                <Command.Group heading="View">
                  <CommandItem onSelect={() => { /* toggle */ }}>
                    <SunIcon /> Toggle Theme
                    <kbd className="ml-auto">⌘T</kbd>
                  </CommandItem>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                 data-[selected=true]:bg-accent text-sm"
    >
      {children}
    </Command.Item>
  );
}
```

**Accessibility requirements:**
- `aria-label` on Command.Input
- `role="listbox"` on Command.List (handled by cmdk)
- Focus trap when open
- Escape to close

- [ ] **2.5 Create toast notification system**
  - File: `apps/web/components/providers/toast-provider.tsx`
  - Replace all `alert()` calls
  - Success, error, loading, promise variants
  - Dismissible with animations

- [ ] **2.6 Create empty state component**
  - File: `apps/web/components/shared/empty-state.tsx`
  - Animated illustration
  - Primary and secondary CTAs
  - Customizable messaging

- [ ] **2.7 Create loading skeleton component**
  - File: `apps/web/components/shared/skeleton.tsx`
  - Shimmer animation
  - Variants for text, card, list, code

- [ ] **2.8 Create animated card component**
  - File: `apps/web/components/shared/animated-card.tsx`
  - Stagger-in on mount
  - Hover lift effect
  - Focus ring styling

**Deliverable:** Complete component library with animations and variants.

---

### Phase 3: Page Redesigns (Days 6-10)

**Objective:** Apply new design system to all pages with enhanced UX.

#### 3.1 Landing Page Redesign

- [ ] **3.1.1 Hero section**
  - File: `apps/web/app/page.tsx`
  - Gradient text headline
  - Animated illustration/mockup
  - Primary CTA with hover animation
  - Trust indicators (GitHub stars, users count)

- [ ] **3.1.2 Features section**
  - Staggered card animations on scroll
  - Icon animations on hover
  - Gradient accents on feature cards

- [ ] **3.1.3 How it works section**
  - Step-by-step with connecting lines
  - Progress animation as user scrolls

- [ ] **3.1.4 Footer**
  - Clean layout with links
  - Social icons
  - Newsletter signup (optional)

#### 3.2 Dashboard Redesign

- [ ] **3.2.1 Collapsible sidebar**
  - File: `apps/web/components/layout/sidebar.tsx`
  - Icon-only collapsed state
  - Tooltip on collapsed icons
  - Keyboard toggle (Cmd+B)
  - Mobile drawer variant

- [ ] **3.2.2 Project cards**
  - File: `apps/web/app/(app)/page.tsx`
  - Preview thumbnail
  - Last edited timestamp
  - Dropdown menu with animations
  - Hover state with shadow lift

- [ ] **3.2.3 Empty dashboard state**
  - Animated illustration
  - Quick start templates
  - Getting started checklist

- [ ] **3.2.4 Search and filter**
  - Search bar with command palette trigger
  - Sort by: recent, name, created
  - Grid/list view toggle

#### 3.3 Editor Redesign

- [ ] **3.3.1 Toolbar enhancement**
  - File: `apps/web/components/editor/toolbar.tsx`
  - Breadcrumb navigation
  - Undo/redo with tooltips
  - View mode toggle with active indicator
  - Export dropdown with format options

- [ ] **3.3.2 Preview panel**
  - File: `apps/web/components/editor/preview.tsx`
  - Refined iPhone frame with subtle shadow
  - Device selector (iPhone 15, iPad mini)
  - Scale slider for preview size
  - Fullscreen mode

- [ ] **3.3.3 Code view**
  - File: `apps/web/components/editor/code-view.tsx`
  - Improved syntax highlighting
  - Line numbers with proper alignment
  - Copy button with success feedback
  - File tabs for multi-file projects

- [ ] **3.3.4 Chat panel**
  - File: `apps/web/components/editor/chat.tsx`
  - Message bubbles with timestamps
  - Typing indicator during generation
  - Progressive loading states
  - Suggested prompts
  - Code blocks with syntax highlighting in responses

- [ ] **3.3.5 Generation loading states**
  - File: `apps/web/components/editor/generation-loader.tsx`
  - Animated SVG or Lottie
  - Progressive status: "Understanding...", "Building...", "Finalizing..."
  - Estimated time remaining
  - Cancel button

- [ ] **3.3.6 Split view improvements**
  - Resizable panels with drag handle
  - Minimum widths enforced
  - Collapse to single view on mobile
  - Remember user's preferred layout

#### 3.4 New Project Page Redesign

- [ ] **3.4.1 Form redesign**
  - File: `apps/web/app/(app)/projects/new/page.tsx`
  - Larger input fields with animations
  - Character count indicators
  - Real-time validation
  - Template gallery with hover previews

**Deliverable:** All pages redesigned with new components and animations.

---

### Phase 4: Polish & Delight (Days 11-14)

**Objective:** Add micro-interactions, accessibility, and final refinements.

#### Tasks

- [ ] **4.1 Micro-interactions**
  - Button press effects (scale down)
  - Input focus animations
  - Toggle switch animations
  - Checkbox/radio animations
  - Page transition effects

- [ ] **4.2 Loading optimizations**
  - Skeleton screens for initial loads
  - Optimistic UI updates
  - Prefetch on hover for navigation

- [ ] **4.3 Error state designs**
  - Connection lost indicator
  - API error toast with retry
  - Rate limit warning
  - Invalid input shake animation

- [ ] **4.4 Keyboard navigation**
  - Focus visible states
  - Tab order audit
  - Arrow key navigation in lists
  - Escape to close modals

- [ ] **4.5 Accessibility audit**
  - Color contrast verification (WCAG AA)
  - Screen reader testing
  - Reduced motion support
  - Touch target sizes (44px minimum)

#### Research Insight: Accessibility (Critical)

**From Accessibility Reviewer:**

> **CRITICAL FINDING:** Current touch targets are 28-32px. WCAG requires 44px minimum. This affects every button, icon button, and interactive element.

**Touch target fixes:**
```tsx
// WRONG - too small
<button className="p-2">  {/* 32px with 8px padding */}
  <Icon size={16} />
</button>

// CORRECT - meets 44px minimum
<button className="p-3 min-w-[44px] min-h-[44px]">
  <Icon size={20} />
</button>

// Or use relative sizing
<button className="p-3 touch-manipulation">
  <Icon className="w-5 h-5" />
</button>
```

**Color contrast verification:**
```ts
// Verify oklch colors meet 4.5:1 ratio
// Use oklch.com or polished library to check

// These need verification:
--muted-foreground: oklch(0.45 0.01 250);  // May fail on light bg
--muted-foreground: oklch(0.65 0.01 250);  // May fail in dark mode
```

**Focus visible states:**
```css
/* Custom focus ring that works in both themes */
:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}

/* For dark backgrounds */
.dark :focus-visible {
  outline-color: var(--color-brand-400);
}
```

**Screen reader announcements:**
```tsx
// Live region for AI generation status
<div role="status" aria-live="polite" className="sr-only">
  {generationStatus}
</div>

// Announce toast notifications
<Toaster
  toastOptions={{
    role: 'status',
    'aria-live': 'polite'
  }}
/>
```

**ARIA patterns for common components:**
```tsx
// Collapsible sidebar
<aside aria-label="Main navigation" aria-expanded={isExpanded}>

// Tab panels
<div role="tablist" aria-label="Editor views">
  <button role="tab" aria-selected={view === 'preview'}>

// Modal dialogs
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
```

- [ ] **4.6 Performance optimization**
  - Component memoization
  - Virtual scrolling for long lists
  - Image optimization
  - Bundle size audit

#### Research Insight: Performance

**From Performance Oracle:**

**Bundle size impact analysis:**
| Package | Size (gzipped) | Alternative |
|---------|----------------|-------------|
| Motion (full) | ~15kb | motion/mini (~4kb) |
| cmdk | ~3kb | - |
| Sonner | ~4kb | - |
| Satoshi font | ~20-30kb | Subset to latin |
| shadcn components | ~5-10kb each | Use only needed |

**Total estimated impact: 70-150kb** depending on usage.

**Optimization strategies:**

1. **Use motion/mini for simple animations:**
```tsx
import { animate } from 'motion/mini';  // 4kb vs 15kb

// Imperative API for simple cases
animate('.card', { opacity: [0, 1], y: [20, 0] }, { duration: 0.3 });
```

2. **Virtual scrolling for project lists:**
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function ProjectList({ projects }: { projects: Project[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: projects.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,  // Estimated row height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <ProjectCard
            key={virtualRow.key}
            project={projects[virtualRow.index]}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

3. **Memoization patterns:**
```tsx
// Memoize expensive components
const CodeView = memo(function CodeView({ code }: { code: string }) {
  // ... syntax highlighting
});

// Memoize callbacks in editor state
const useEditorStore = create<EditorState>()((set) => ({
  setComponentTree: useCallback((tree) => set({ componentTree: tree }), []),
}));
```

4. **Font subsetting:**
```tsx
// Only load latin characters
const satoshi = localFont({
  src: './fonts/Satoshi-Variable.woff2',
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  // Subset to just what's needed
});
```

- [ ] **4.7 Responsive polish**
  - Test all breakpoints
  - Mobile drawer navigation
  - Touch gesture support
  - Landscape orientation handling

**Deliverable:** Production-ready UI with attention to detail.

---

## Acceptance Criteria

### Functional Requirements

- [ ] All existing functionality preserved
- [ ] Dark/light mode toggle with system preference detection
- [ ] Command palette accessible via Cmd+K
- [ ] Toast notifications replace all `alert()` calls
- [ ] Responsive layout from 375px to 2560px width
- [ ] Collapsible sidebar on dashboard
- [ ] Animated loading states during AI generation
- [ ] Empty states for all null/empty data scenarios

### Non-Functional Requirements

- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] All text meets WCAG AA contrast (4.5:1)
- [ ] All interactive elements have 44px minimum touch target
- [ ] Animations respect `prefers-reduced-motion`

### Quality Gates

- [ ] Visual regression tests pass
- [ ] Lighthouse accessibility score > 90
- [ ] No console errors or warnings
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile testing (iOS Safari, Android Chrome)

---

## Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| User satisfaction | Unknown | > 4.5/5 | In-app feedback |
| Time to first generation | ~30s | < 25s (perceived) | User analytics |
| Error recovery rate | Low | > 80% | Error tracking |
| Mobile usage | Unknown | > 20% | Analytics |
| Dark mode adoption | Unknown | > 60% | Feature flags |

---

## Dependencies & Prerequisites

### Required Before Starting
- [ ] Motion library installed
- [ ] shadcn/ui configured
- [ ] Cal Sans font files obtained (or alternative display font)

### External Dependencies
- Motion (formerly Framer Motion): Animation library
- shadcn/ui: Component primitives
- Sonner: Toast notifications
- cmdk: Command palette

### Potential Blockers
- Font licensing for Cal Sans (use Satoshi or Space Grotesk instead - both free)
- Motion.js bundle size (~15kb gzipped) - use motion/mini (~4kb)
- Safari support for newer CSS features
- oklch color support (use fallbacks for older browsers)

#### Research Insight: Security Patterns

**From Security Sentinel:**

**1. Safe localStorage for theme persistence:**
```tsx
// Wrap in try-catch for private browsing
function getStoredTheme(): 'light' | 'dark' | null {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return null;
  } catch {
    return null;  // Private browsing or storage disabled
  }
}
```

**2. Sanitize AI responses before rendering:**
```tsx
import DOMPurify from 'dompurify';

// AI responses may contain markdown/HTML
function renderAIResponse(response: string) {
  const sanitized = DOMPurify.sanitize(response, {
    ALLOWED_TAGS: ['p', 'code', 'pre', 'strong', 'em', 'ul', 'li'],
    ALLOWED_ATTR: ['class'],
  });
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

**3. ZIP export path sanitization:**
```ts
// Prevent path traversal in exported file names
function sanitizeFileName(name: string): string {
  return name
    .replace(/\.\./g, '')           // No parent directory
    .replace(/[/\\]/g, '-')         // No path separators
    .replace(/[<>:"|?*]/g, '')      // No invalid chars
    .slice(0, 255);                 // Max length
}
```

**4. CSP headers for Next.js:**
```ts
// next.config.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob:;
      font-src 'self';
      connect-src 'self' https://api.anthropic.com;
    `.replace(/\n/g, '')
  }
];
```

---

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation performance issues | Medium | High | Test on low-end devices, use `will-change` sparingly |
| Accessibility regressions | Medium | High | Automated axe-core testing, manual screen reader testing |
| Mobile responsiveness gaps | Medium | Medium | Design mobile-first, test on real devices |
| Breaking changes to existing features | Low | High | Feature flag new UI, A/B testing |
| Increased bundle size | High | Medium | Code splitting, tree shaking, lazy loading |

#### Research Insight: Architecture & TypeScript

**From Architecture Strategist & TypeScript Reviewer:**

**Recommended type definitions:**
```tsx
// Theme system types
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

// Animation variants type
interface MotionVariants {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit?: TargetAndTransition;
}

// Editor state type (Zustand)
interface EditorState {
  // Data
  project: Project | null;
  componentTree: ComponentNode | null;
  generatedCode: string;

  // UI State
  activeView: 'preview' | 'code' | 'split';
  sidebarCollapsed: boolean;
  selectedDevice: 'iphone15' | 'iphone15pro' | 'ipadmini';

  // Actions
  setProject: (project: Project) => void;
  setComponentTree: (tree: ComponentNode) => void;
  setActiveView: (view: EditorState['activeView']) => void;
  toggleSidebar: () => void;
}
```

**State management with immer:**
```tsx
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useEditorStore = create<EditorState>()(
  immer((set) => ({
    project: null,
    componentTree: null,
    generatedCode: '',
    activeView: 'split',
    sidebarCollapsed: false,
    selectedDevice: 'iphone15',

    setComponentTree: (tree) =>
      set((state) => {
        state.componentTree = tree;
      }),

    toggleSidebar: () =>
      set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
      }),
  }))
);
```

**Server/client boundary best practices:**
```tsx
// Server component (default in App Router)
// app/(app)/projects/[id]/page.tsx
export default async function EditorPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);  // Server fetch
  return <EditorCanvas initialProject={project} />;
}

// Client component (explicit)
// components/editor/canvas.tsx
'use client';
export function EditorCanvas({ initialProject }: { initialProject: Project }) {
  // Client-side state and interactivity
}
```

---

## Edge Cases to Address

<details>
<summary>Expand edge case checklist (100+ items)</summary>

### Loading States
- [ ] AI generation 5-30 seconds with progressive feedback
- [ ] Export ZIP generation with progress
- [ ] Initial page load with skeleton screens
- [ ] Long operations with cancel option

### Empty States
- [ ] No projects in dashboard
- [ ] No messages in chat
- [ ] No component tree generated
- [ ] No code generated
- [ ] Search returns no results

### Error States
- [ ] API key missing (mock mode indicator)
- [ ] Network error with retry
- [ ] Invalid JSON response
- [ ] Export failure
- [ ] Convex connection lost

### Text Overflow
- [ ] Project name > 50 characters
- [ ] Very long AI responses
- [ ] Code > 1000 lines
- [ ] Deep component tree nesting

### Dark Mode
- [ ] Code syntax highlighting contrast
- [ ] iOS simulator consistency
- [ ] Form validation error colors
- [ ] Image/icon visibility

### Mobile/Touch
- [ ] Sidebar collapse to drawer
- [ ] Split view to single view
- [ ] Touch targets 44px minimum
- [ ] Swipe gestures for panels

### Accessibility
- [ ] Keyboard navigation flow
- [ ] Screen reader announcements
- [ ] Reduced motion preferences
- [ ] Focus management in modals

</details>

---

## File Changes Summary

### New Files (20+)

| File | Purpose |
|------|---------|
| `components/providers/theme-provider.tsx` | Theme context and toggle |
| `components/providers/toast-provider.tsx` | Toast notification system |
| `components/shared/empty-state.tsx` | Empty state component |
| `components/shared/skeleton.tsx` | Loading skeleton |
| `components/shared/animated-card.tsx` | Motion-enabled card |
| `components/shared/gradient-text.tsx` | Gradient text effect |
| `components/shared/command-palette.tsx` | Cmd+K palette |
| `components/layout/sidebar.tsx` | Collapsible sidebar |
| `components/layout/mobile-nav.tsx` | Mobile drawer |
| `components/editor/generation-loader.tsx` | AI generation states |
| `components/ui/*.tsx` | shadcn/ui components |
| `lib/animations.ts` | Motion variants |
| `hooks/use-keyboard-shortcuts.ts` | Global shortcuts |
| `hooks/use-command-palette.ts` | Palette state |

### Modified Files (15+)

| File | Changes |
|------|---------|
| `app/globals.css` | New theme system |
| `app/layout.tsx` | Theme provider, fonts |
| `app/page.tsx` | Landing redesign |
| `app/(app)/layout.tsx` | Sidebar, mobile nav |
| `app/(app)/page.tsx` | Dashboard redesign |
| `app/(app)/projects/new/page.tsx` | Form redesign |
| `app/(app)/projects/[id]/page.tsx` | Editor integration |
| `components/editor/canvas.tsx` | Layout updates |
| `components/editor/toolbar.tsx` | Toolbar redesign |
| `components/editor/preview.tsx` | Preview enhancements |
| `components/editor/chat.tsx` | Chat redesign |
| `components/editor/code-view.tsx` | Code view improvements |
| `tailwind.config.ts` | Theme extensions |
| `package.json` | New dependencies |

---

## References & Research

### Internal References
- Current tailwind config: `apps/web/tailwind.config.ts`
- Current globals: `apps/web/app/globals.css`
- Editor components: `apps/web/components/editor/*.tsx`
- Layout components: `apps/web/app/(app)/layout.tsx`

### External References
- [Linear Design System](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Liquid Glass](https://linear.app/now/linear-liquid-glass)
- [Tailwind CSS v4.0 Features](https://tailwindcss.com/blog/tailwindcss-v4)
- [Motion.dev Documentation](https://motion.dev/)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [WCAG Color Contrast](https://www.allaccessible.org/blog/color-contrast-accessibility-wcag-guide-2025)
- [Gradients in Web Design](https://clay.global/blog/gradients-in-web-design)

### Research-Discovered References
- [cmdk library](https://cmdk.paco.me/) - Command palette
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [TanStack Virtual](https://tanstack.com/virtual/latest) - Virtual scrolling
- [DOMPurify](https://github.com/cure53/DOMPurify) - HTML sanitization
- [Satoshi Font](https://www.fontshare.com/fonts/satoshi) - Free modern sans-serif
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - Display font
- [oklch.com](https://oklch.com/) - Color contrast checker

### Design Inspiration
- [Lovable](https://lovable.dev) - AI-native interface patterns
- [Bolt.new](https://bolt.new) - Real-time preview, speed
- [v0.dev](https://v0.dev) - Component-focused generation
- [Linear](https://linear.app) - Dark mode, keyboard-first
- [Vercel](https://vercel.com) - Gradient accents, typography
- [Slack](https://slack.com) - Chat experience

---

## Simplicity Considerations

**From Code Simplicity Reviewer:**

The original 4-phase, 20+ file approach may be over-engineered. Consider a simplified 2-phase approach:

### Alternative: Simplified Implementation

**Phase A: Foundation (3-5 files)**
```
apps/web/
├── app/globals.css           # Theme + animations in CSS
├── app/layout.tsx            # Theme provider, fonts
├── lib/theme.ts              # Theme utilities
├── components/ui/button.tsx  # Enhanced button (one file)
└── components/ui/toast.tsx   # Toast system (one file)
```

**Phase B: Features (5-7 files)**
```
├── components/command-palette.tsx  # Single file, not split
├── components/editor/canvas.tsx    # Combined editor
├── components/layout/sidebar.tsx   # Collapsible nav
└── hooks/use-editor.ts             # Combined hook
```

**Total: 8-12 files** instead of 20+

**Key simplifications:**
1. CSS animations instead of Motion library where possible
2. Combine related hooks into single files
3. Use shadcn components as-is, customize with CSS variables
4. Skip separate animation library - inline variants

**When to use full approach:**
- Team of 3+ developers working in parallel
- Need granular code ownership
- Complex animation requirements

**When to use simplified approach:**
- Solo developer or small team
- Fast iteration needed
- MVP/prototype stage

---

*Plan created with Claude Code using /workflows:plan*
*Enhanced with /workflows:deepen-plan on 2026-01-19*
