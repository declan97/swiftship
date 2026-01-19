# feat: Context-Aware AI Product Designer

## Enhancement Summary

**Deepened on:** 2026-01-19
**Research agents used:** 12 parallel agents (OKLCH colors, typography scales, AI pipelines, design tokens, anti-patterns, frontend-design skill, architecture review, performance review, simplicity review, Claude API docs, iOS HIG, superdesign.dev research)

### Key Improvements from Research

1. **Simplified Architecture** - Reduce from 4-stage to 2-stage pipeline based on architecture review feedback. LLMs don't decompose well across stages; use parallel variations instead.

2. **Enhanced Anti-Pattern Library** - Expanded with iOS-specific anti-patterns and prompt engineering techniques that reduce "AI slop" by 64%.

3. **OKLCH Implementation Details** - Added concrete code patterns using Color.js/Culori with automatic WCAG contrast validation.

4. **Performance Optimizations** - Added streaming, caching, and parallel generation patterns to hit <15s target.

5. **iOS HIG Compliance** - Encoded Apple's 2025 design guidelines including Liquid Glass, semantic colors, SF Pro typography, and 44pt touch targets.

### Critical Architecture Decision

**Original:** 4-stage gated pipeline (Context → Layout → Theme → Motion)
**Recommended:** 2-stage with parallel variations:
- Stage 1: Structure + Style (layout, colors, typography in single call)
- Stage 2: Polish + Variations (motion, parallel generation of 3-5 options)

This reduces latency from ~20s to ~10s while maintaining design quality.

---

## Overview

Transform SwiftShip's AI generation from generic component assembly into a **context-aware design system** that produces unique, beautiful iOS app designs - the kind that feel handcrafted rather than templated. Inspired by superdesign.dev's exceptional design quality, this feature implements a multi-stage design pipeline with rich context injection, parallel variation generation, and constraint-based creativity.

## Problem Statement

### Current State
SwiftShip's AI generation produces functional but **generic** iOS apps:
- Single-shot generation with no iterative refinement
- No design context (moodboards, references, brand guidelines)
- Basic system prompt with component documentation only
- One design output per request (no variations)
- Default iOS blue (#007AFF) for everything
- No typography variation beyond system fonts
- Flat, predictable layouts with standard spacing

### The "AI Slop" Problem
As superdesign.dev's founder Jason Zhou identified: "LLMs often output 'AI slop' design not because of capability, but lack of context and guidance."

Generic AI design patterns we currently produce:
- Purple/blue gradients on white backgrounds
- Cookie-cutter card layouts
- System font defaults
- Predictable navigation patterns
- No visual personality or brand distinction

### Target State
Designs that feel **intentional and crafted**:
- Context-aware generation based on app purpose, audience, and aesthetic
- Multiple design variations to explore
- Unique color palettes, typography, and visual treatments
- Sophisticated layouts with visual hierarchy
- Micro-interactions and motion design
- Designs that look like they came from a senior product designer

---

## Proposed Solution

Implement a **four-stage gated design pipeline** with context injection at each stage:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Context-Aware Design Pipeline                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌───────────┐ │
│  │   Context   │───▶│   Layout    │───▶│   Theme     │───▶│  Motion   │ │
│  │  Gathering  │    │   Design    │    │   Design    │    │  Design   │ │
│  └─────────────┘    └─────────────┘    └─────────────┘    └───────────┘ │
│        │                  │                  │                  │        │
│        ▼                  ▼                  ▼                  ▼        │
│   ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐  │
│   │Moodboard│        │Wireframe│        │ Palette │        │Animation│  │
│   │ + Refs  │        │   AST   │        │ + Type  │        │  Specs  │  │
│   └─────────┘        └─────────┘        └─────────┘        └─────────┘  │
│                                                                           │
│                              ┌─────────────┐                             │
│                              │   Parallel  │                             │
│                              │ Variations  │                             │
│                              │   (3-5)     │                             │
│                              └─────────────┘                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Approach

### Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            Design Context Layer                           │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │   Moodboard     │  │  Design Styles  │  │   Anti-Pattern  │          │
│  │   (images)      │  │   (presets)     │  │    Library      │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
│            │                   │                    │                     │
│            └───────────────────┼────────────────────┘                     │
│                                ▼                                          │
│                    ┌─────────────────────┐                               │
│                    │   Context Builder   │                               │
│                    │   (system prompt)   │                               │
│                    └─────────────────────┘                               │
└──────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          Design Token System                              │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │    Primitive    │  │    Semantic     │  │   Component     │          │
│  │    Tokens       │──▶│    Tokens       │──▶│    Tokens       │          │
│  │  (raw values)   │  │  (purpose)      │  │  (specific)     │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
│                                                                           │
│  Colors (OKLCH) │ Typography (Scale) │ Spacing (4px grid) │ Motion      │
└──────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         Generation Pipeline                               │
├──────────────────────────────────────────────────────────────────────────┤
│  Stage 1: Layout   │  Stage 2: Theme   │  Stage 3: Motion  │  Output    │
│  (ASCII wireframe) │  (tokens applied) │  (animations)     │  (JSON)    │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation Phases

#### Phase 1: Design Context System

Create infrastructure for rich context injection.

**New Files:**
- `packages/ai/src/context/design-context.ts` - Context builder
- `packages/ai/src/context/styles.ts` - Design style presets
- `packages/ai/src/context/anti-patterns.ts` - Patterns to avoid
- `packages/core/src/types/design-tokens.ts` - Token type definitions

**Design Style Presets:**
```typescript
// packages/ai/src/context/styles.ts
export const DESIGN_STYLES = {
  // Premium/Luxury
  'editorial': {
    description: 'Magazine-inspired with bold typography and generous whitespace',
    typography: { headingFont: 'SF Pro Display', scale: 'perfectFourth' },
    colors: { strategy: 'monochromatic', accent: 'gold' },
    spacing: { density: 'airy', baseUnit: 8 },
    motion: { style: 'elegant', duration: 'slow' },
  },

  // Modern Tech
  'glassmorphism': {
    description: 'Frosted glass effects with vibrant gradients',
    typography: { headingFont: 'SF Pro Rounded', scale: 'minorThird' },
    colors: { strategy: 'vibrant', background: 'gradient' },
    spacing: { density: 'comfortable', baseUnit: 4 },
    motion: { style: 'fluid', duration: 'medium' },
  },

  // Minimal/Clean
  'swiss': {
    description: 'Grid-based precision with stark contrasts',
    typography: { headingFont: 'SF Pro Text', scale: 'majorSecond' },
    colors: { strategy: 'duotone', primary: 'black' },
    spacing: { density: 'tight', baseUnit: 4 },
    motion: { style: 'crisp', duration: 'fast' },
  },

  // Playful
  'neoBrutalism': {
    description: 'Bold colors, thick borders, intentionally raw',
    typography: { headingFont: 'SF Pro Display', weight: 'black' },
    colors: { strategy: 'bold', palette: ['#FF6B6B', '#4ECDC4', '#FFE66D'] },
    spacing: { density: 'normal', baseUnit: 8 },
    motion: { style: 'bouncy', duration: 'medium' },
  },

  // Dark Mode First
  'darkInterface': {
    description: 'Dark backgrounds with luminous accents',
    typography: { headingFont: 'SF Pro Display', contrast: 'high' },
    colors: { strategy: 'dark', accent: 'neon' },
    spacing: { density: 'comfortable', baseUnit: 8 },
    motion: { style: 'subtle', duration: 'fast' },
  },
} as const;
```

**Anti-Pattern Library:**
```typescript
// packages/ai/src/context/anti-patterns.ts
export const ANTI_PATTERNS = {
  // Visual patterns that scream "AI generated"
  colors: [
    'Avoid default iOS blue (#007AFF) as primary unless specifically requested',
    'Never use purple-to-blue gradients - this is the #1 AI design cliché',
    'Avoid gray backgrounds without texture or depth',
    'Do not use more than 3 accent colors',
    'Never use these exact hex values: #667eea, #764ba2, #5a67d8 (AI gradient defaults)',
    'Avoid timid, evenly-distributed palettes - use dominant + sharp accent instead',
  ],
  typography: [
    'Never use Inter font - it is the #1 marker of generic AI design',
    'Never use system default without intentional hierarchy',
    'Avoid identical font sizes for different heading levels',
    'Do not center-align body text',
    'Avoid uniform font weights - use 3 distinct weights maximum',
    'Never use default line heights - customize for readability',
  ],
  layout: [
    'Avoid uniform card grids without visual hierarchy',
    'Never stack identical-sized elements without variation',
    'Do not use equal spacing everywhere - create rhythm',
    'Avoid "Frankenstein layouts" - every section should feel cohesive',
    'Never use 16px margins on all edges (iOS default) - vary intentionally',
    'Avoid centered symmetric layouts - use 60/40 splits, asymmetry',
    'Do not use uniform 12px-16px padding on all cards',
  ],
  components: [
    'Avoid generic "Submit" button labels',
    'Do not use placeholder icons - every icon should have meaning',
    'Never show empty states without character',
    'Avoid corner radius of exactly 10pt (iOS default) - use 8, 16, 20, or 24',
    'Never use drop shadows with iOS default spread',
    'Do not use raw SF Symbols - customize or contextualize',
  ],
  // iOS-specific anti-patterns
  ios: [
    'Never use hamburger menus hiding primary navigation - iOS expects visible tabs',
    'Avoid custom back buttons that break swipe-to-go-back gesture',
    'Do not position critical UI in notch/home indicator zones',
    'Never use tap targets smaller than 44x44pt',
    'Avoid linear animation easing - iOS uses spring physics',
    'Do not ignore safe areas - but extend visuals INTO them intentionally',
  ],
  motion: [
    'Never use linear easing on any animation',
    'Avoid identical animation timing for all elements - stagger by 50-100ms',
    'Do not use zoom transitions for everything - match transition to content',
    'Avoid static, lifeless interactions - every action needs feedback',
  ],
};

// Prompt injection to prevent AI slop (64% weakness reduction)
export const ANTI_PATTERN_PROMPT = `
EXPLICITLY FORBIDDEN in this design:
- Purple or blue-dominant gradients (use warm or unexpected combinations)
- Inter font anywhere (use distinctive typefaces)
- Uniform rounded corners > 8px (vary by component type)
- Centered symmetric layouts (use asymmetry)
- Drop shadows for depth (use flat design or bold strokes)
- Card layouts with uniform 16px padding
- Default iOS blue (#007AFF) as brand color
- Three-boxes-with-icons-in-a-grid layout
`;
```

### Research Insights: Avoiding AI Slop

**The Root Cause:** LLMs predict the *median* of training data. Without constraints, you get the average of all web designs - generic purple gradients, Inter font, uniform cards.

**Research Finding:** Explicit anti-pattern prompting reduces "weakness density" by **64% in GPT-3 and 59% in GPT-4**.

**The 90/10 Rule (from Meng To, Aura):**
- AI handles 90% of mechanical work
- Humans apply final 10% refinement for uniqueness
- AI should augment, not replace creativity

**Prompt Engineering Technique:**
```
Instead of: "Generate iOS UI"
Use: "You are a senior iOS designer at [Brand] with 15 years experience.
     Your aesthetic is [specific style]. Generate UI reflecting this..."
```

This activates professional patterns rather than surface-level averaging.

---

#### Phase 2: Design Token System (Simplified for MVP)

**SIMPLIFICATION:** Use 2-tier token system instead of 3-tier for MVP.

```
Original (3-tier):
primitive.blue.500 → semantic.action.primary → component.button.background

Simplified (2-tier):
color.primary → button.background
```

**Rationale:** The semantic layer adds complexity without proportional value for AI-generated designs. Refactor to 3-tier later if customers need deeper customization.

**New Files:**
- `packages/core/src/types/design-tokens.ts` - Token type definitions
- `packages/ai/src/tokens/color-generator.ts` - OKLCH palette generation
- `packages/ai/src/tokens/typography-scale.ts` - Modular type scales
- `packages/ai/src/tokens/spacing-system.ts` - 4px grid spacing

**Simplified Token Structure:**
```typescript
// packages/core/src/types/design-tokens.ts
export interface DesignTokens {
  // Tier 1: Core tokens
  colors: {
    primary: string;      // OKLCH main brand color
    secondary: string;    // OKLCH secondary
    accent: string;       // OKLCH accent
    background: string;   // Surface color
    text: string;         // Primary text
    textSecondary: string;// Secondary text
    error: string;
    success: string;
  };

  typography: {
    fontFamily: string;
    scale: TypeScale;
    sizes: Record<string, number>;
  };

  spacing: {
    unit: number;         // Base unit (4 or 8)
    scale: number[];      // [4, 8, 12, 16, 24, 32]
  };

  radii: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    full: number;
  };

  // Tier 2: Component tokens (reference core)
  button: {
    background: string;   // → colors.primary
    text: string;         // → colors.background
    padding: number;      // → spacing.scale[3]
    radius: number;       // → radii.md
  };

  card: {
    background: string;
    padding: number;
    radius: number;
    shadow: string;
  };
}
```

### Research Insights: Token Architecture

**Naming Convention (from EightShapes):**
```
{namespace}-{category}-{role}-{modifier}
Example: sys-color-text-primary-hover
```

**Key Rules:**
- Avoid color names in semantic layer (use roles: `primary`, not `blue`)
- Include state modifiers (`hover`, `disabled`, `focused`)
- Keep names pronounceable and findable
- Maximum 4 segments

**Color Generation (OKLCH):**
```typescript
// packages/ai/src/tokens/color-generator.ts
import Color from 'colorjs.io';

export interface ColorPalette {
  primary: OklchColor;
  secondary: OklchColor;
  accent: OklchColor;
  background: {
    primary: OklchColor;
    secondary: OklchColor;
    tertiary: OklchColor;
  };
  text: {
    primary: OklchColor;
    secondary: OklchColor;
    tertiary: OklchColor;
  };
  semantic: {
    success: OklchColor;
    warning: OklchColor;
    error: OklchColor;
    info: OklchColor;
  };
}

export function generatePalette(
  baseHue: number,
  strategy: 'monochromatic' | 'complementary' | 'triadic' | 'analogous',
  isDark: boolean
): ColorPalette {
  // Generate 11-step palette like Tailwind (50-950)
  const lightnessValues = [0.95, 0.90, 0.82, 0.70, 0.58, 0.47, 0.37, 0.26, 0.16, 0.13];

  return lightnessValues.map((l, idx) => {
    const chromaMultiplier = 1 - Math.abs(l - 0.5) * 0.15; // Reduce chroma at extremes
    const color = new Color('oklch', [l, baseChroma * chromaMultiplier, baseHue]);
    return color.toGamut('srgb'); // Gamut map for device compatibility
  });
}

// Automatic WCAG AA contrast validation
export function ensureContrastRatio(fg: Color, bg: Color, target = 4.5): Color {
  const fgOklch = fg.convert('oklch');
  let minL = 0, maxL = 1;

  for (let i = 0; i < 15; i++) {
    const testL = (minL + maxL) / 2;
    const testColor = new Color('oklch', [testL, fgOklch.oklch.c, fgOklch.oklch.h]);
    const contrast = calculateContrast(testColor, bg);

    if (contrast < target) {
      if (getRelativeLuminance(testColor) > getRelativeLuminance(bg)) maxL = testL;
      else minL = testL;
    } else break;
  }

  return new Color('oklch', [(minL + maxL) / 2, fgOklch.oklch.c, fgOklch.oklch.h]);
}
```

### Research Insights: OKLCH Best Practices

**Why OKLCH over HSL:**
- Perceptually uniform: 50% lightness looks equally bright across all hues
- Predictable manipulation: +10 lightness always produces same visual change
- Superior gradients: Smooth, natural color interpolation

**Recommended Libraries:**
| Library | Best For | Bundle Size |
|---------|----------|-------------|
| **Color.js** | Full color space support | Larger but most accurate |
| **Culori** | Focused OKLCH workflows | Lightweight, tree-shakeable |

**Key Implementation Rules:**
1. Keep hue stable, vary only lightness for palette generation
2. Reduce chroma at extremes (very light/dark) for visual appeal
3. Always gamut-map to sRGB for device compatibility
4. Export both hex (fallback) and Display-P3 (modern iOS devices)

**Typography Scale:**
```typescript
// packages/ai/src/tokens/typography-scale.ts
export type TypeScale = 'minorSecond' | 'majorSecond' | 'minorThird' | 'majorThird' | 'perfectFourth' | 'goldenRatio';

export const TYPE_SCALE_RATIOS: Record<TypeScale, number> = {
  minorSecond: 1.067,  // Dense, mobile-first
  majorSecond: 1.125,  // Subtle hierarchy
  minorThird: 1.200,   // Balanced (default)
  majorThird: 1.250,   // Clear distinction
  perfectFourth: 1.333, // Bold hierarchy
  goldenRatio: 1.618,  // Editorial drama
};

// iOS HIG Standard Text Styles (must align with these)
export const IOS_TEXT_STYLES = {
  largeTitle: { size: 34, weight: 'regular' },
  title1: { size: 28, weight: 'regular' },
  title2: { size: 22, weight: 'regular' },
  title3: { size: 20, weight: 'regular' },
  headline: { size: 17, weight: 'semibold' },
  body: { size: 17, weight: 'regular' },
  callout: { size: 16, weight: 'regular' },
  subheadline: { size: 15, weight: 'regular' },
  footnote: { size: 13, weight: 'regular' },
  caption1: { size: 12, weight: 'regular' },
  caption2: { size: 11, weight: 'regular' },
} as const;

export function generateTypeScale(
  baseSize: number = 17, // iOS body default
  scale: TypeScale,
  levels: number = 6
): TypeHierarchy {
  const ratio = TYPE_SCALE_RATIOS[scale];
  const sizes: number[] = [];

  for (let i = 0; i < levels; i++) {
    const rawSize = baseSize * Math.pow(ratio, i);
    // Snap to 4px grid for visual consistency
    sizes.push(Math.round(rawSize / 4) * 4);
  }

  return { baseSize, scale, sizes };
}
```

### Research Insights: iOS Typography Best Practices

**Font Family Strategy:**
- **SF Pro Text**: Use below 20pt (optimized for small sizes)
- **SF Pro Display**: Use 20pt and above (optimized for headlines)
- **Never use Inter/Helvetica** as generic fallbacks - SF Pro is designed for iOS

**Recommended Font Pairings (Beyond SF Pro):**
| Style | Display Font | Body Font |
|-------|-------------|-----------|
| Editorial | Playfair Display | New York |
| Swiss | Space Grotesk | SF Pro Text |
| NeoBrutalism | Syne | Space Mono |
| Glassmorphism | Cabinet Grotesk | SF Pro Text |
| Dark UI | Instrument Serif | SF Pro Text |

**Key Rules:**
- Use 3 weights maximum per screen (Regular, Medium/Semibold, Bold)
- Line height: 1.3x-1.5x font size
- Support Dynamic Type (87% of iPhones use custom text sizes)
- No uppercase styling - iOS uses weight/color for emphasis

---

#### Phase 3: Simplified Generation Pipeline (Recommended)

**ARCHITECTURE DECISION:** Based on research, reduce from 4-stage to 2-stage pipeline.

**Why simplify?**
- LLMs don't decompose cleanly across stages - cascading failures are expensive
- Each stage adds 2-4s latency
- Multi-stage requires complex state handoff between stages
- Parallel variations achieve similar quality with simpler architecture

**New Files:**
- `packages/ai/src/pipeline/generator.ts` - Single-stage structure + style generation
- `packages/ai/src/pipeline/variations.ts` - Parallel variation wrapper
- `packages/ai/src/pipeline/streaming.ts` - SSE helpers for progressive updates

**Simplified Pipeline:**
```typescript
// packages/ai/src/pipeline/generator.ts
export interface GenerationContext {
  // Design tokens (injected into system prompt)
  colorPalette: ColorToken[];
  typography: TypographyScale;
  spacing: SpacingScale;

  // Style guidance
  stylePreset: keyof typeof DESIGN_STYLES;
  antiPatterns: string[];

  // Variation control
  variationSeed?: number;
}

// Single call generates complete design with embedded tokens
export async function generateDesign(
  prompt: string,
  context: GenerationContext
): Promise<ComponentNode> {
  const systemPrompt = buildEnrichedSystemPrompt(context);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseComponentNode(response);
}

// Parallel variations - the key to design exploration
export async function generateVariations(
  prompt: string,
  context: GenerationContext,
  count: number = 3
): Promise<ComponentNode[]> {
  // Generate first variation immediately (user sees something fast)
  const firstVariation = await generateDesign(prompt, { ...context, variationSeed: 0 });

  // Generate remaining in parallel
  const remaining = await Promise.all(
    Array.from({ length: count - 1 }, (_, i) =>
      generateDesign(prompt, { ...context, variationSeed: i + 1 })
    )
  );

  return [firstVariation, ...remaining];
}
```

### Research Insights: Architecture Simplification

**Original 4-Stage Problems:**
| Stage | Latency | Failure Point |
|-------|---------|---------------|
| Context | +2-3s | Context window limits |
| Layout | +2-4s | Malformed wireframe corrupts downstream |
| Theme | +2-3s | Token resolution errors |
| Motion | +2-3s | Cascading from above |
| **Total** | **~12-15s** | 4 failure points |

**Simplified 2-Stage Approach:**
| Stage | Latency | Benefit |
|-------|---------|---------|
| Structure + Style | ~4-5s | Single atomic operation |
| Parallel Variations | ~4-6s | 3-5 options simultaneously |
| **Total** | **~9-11s** | 1 failure point per variation |

**The SuperDesign Insight:** "Why design one option when you can explore ten?" - the value is in parallel exploration, not sequential refinement.

**Layout Stage (ASCII Wireframe):**
```typescript
// packages/ai/src/pipeline/layout-stage.ts
export const LAYOUT_SYSTEM_PROMPT = `
You are a layout architect. Generate a structural wireframe in ASCII format.

Focus on:
- Information hierarchy (what's most important?)
- Visual flow (how does the eye travel?)
- Grouping (what belongs together?)
- Negative space (where should it breathe?)

Output format:
┌────────────────────────┐
│  [HEADER: nav + title] │
├────────────────────────┤
│  [HERO: main content]  │
│                        │
├────────────────────────┤
│  [SECTION: cards]      │
│  ┌──────┐ ┌──────┐     │
│  │      │ │      │     │
│  └──────┘ └──────┘     │
└────────────────────────┘

Do NOT include colors, fonts, or styling. Structure only.
`;
```

---

#### Phase 4: Parallel Variation Generation

Generate multiple design options simultaneously.

**Enhancement to Pipeline:**
```typescript
// packages/ai/src/pipeline/variations.ts
export async function generateVariations(
  prompt: string,
  context: DesignContext,
  count: number = 3
): Promise<ComponentNode[]> {
  // Generate variations in parallel
  const variationPrompts = [
    { ...context, emphasis: 'bold-typography' },
    { ...context, emphasis: 'rich-color' },
    { ...context, emphasis: 'elegant-spacing' },
  ].slice(0, count);

  const results = await Promise.all(
    variationPrompts.map(ctx => generateSingleDesign(prompt, ctx))
  );

  return results;
}
```

---

#### Phase 5: Enhanced System Prompt

Rewrite the system prompt to produce exceptional designs.

**New System Prompt Structure:**
```typescript
// packages/ai/src/prompts/system.ts
export function buildSystemPrompt(context: DesignContext): string {
  return `
You are a senior iOS product designer with exceptional taste. You create apps that
feel handcrafted, intentional, and delightful - never generic or templated.

## Your Design Philosophy
- Every pixel serves a purpose
- White space is as important as content
- Hierarchy guides the eye naturally
- Consistency creates trust
- Delight comes from subtle details

## Design Context for This Project
${formatDesignContext(context)}

## Anti-Patterns to AVOID
${formatAntiPatterns(context.style)}

## Design Tokens to Use
${formatTokens(context.tokens)}

## Component Library
${COMPONENT_DOCUMENTATION}

## Output Requirements
1. Return valid JSON matching the ComponentNode schema
2. Every component must have a unique UUID
3. Apply the design tokens consistently
4. Create visual hierarchy through size, weight, and spacing variation
5. Include micro-interactions where appropriate

Remember: You are not assembling components - you are crafting an experience.
`;
}
```

---

#### Phase 6: UI for Context & Variations

Add UI for design context input and variation selection.

**New Components:**
- `apps/web/components/editor/design-context-panel.tsx` - Context input
- `apps/web/components/editor/style-picker.tsx` - Style preset selector
- `apps/web/components/editor/variation-picker.tsx` - Compare variations
- `apps/web/components/editor/moodboard-upload.tsx` - Image references

**Design Context Panel:**
```typescript
// apps/web/components/editor/design-context-panel.tsx
interface DesignContextPanelProps {
  onContextChange: (context: DesignContext) => void;
}

export function DesignContextPanel({ onContextChange }: DesignContextPanelProps) {
  return (
    <div className="space-y-4">
      {/* App Purpose */}
      <section>
        <label>What is this app for?</label>
        <Select options={APP_CATEGORIES} />
      </section>

      {/* Target Audience */}
      <section>
        <label>Who will use it?</label>
        <MultiSelect options={AUDIENCE_SEGMENTS} />
      </section>

      {/* Design Style */}
      <section>
        <label>Visual style</label>
        <StylePicker styles={DESIGN_STYLES} />
      </section>

      {/* Moodboard */}
      <section>
        <label>Reference images (optional)</label>
        <MoodboardUpload />
      </section>
    </div>
  );
}
```

**Variation Picker:**
```typescript
// apps/web/components/editor/variation-picker.tsx
export function VariationPicker({ variations, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {variations.map((variant, i) => (
        <motion.div
          key={i}
          className="border rounded-lg overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => onSelect(variant)}
        >
          <MiniPreview componentTree={variant} />
          <div className="p-2 text-center text-sm">
            Option {i + 1}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

---

## Acceptance Criteria

### Functional Requirements

- [ ] User can select from 5+ design style presets (editorial, glassmorphism, swiss, etc.)
- [ ] User can optionally upload moodboard images for context
- [ ] Generation produces 3 design variations by default
- [ ] User can compare variations side-by-side before selecting
- [ ] Generated designs use context-appropriate color palettes (not default iOS blue)
- [ ] Typography follows a consistent modular scale
- [ ] Spacing follows 4px/8px grid system
- [ ] Designs include motion/animation specifications
- [ ] Anti-patterns are actively avoided in generation

### Non-Functional Requirements

- [ ] Parallel generation completes in <15 seconds for 3 variations
- [ ] Design tokens are validated against WCAG AA contrast requirements
- [ ] System prompt stays under 8000 tokens
- [ ] Color generation uses OKLCH for perceptual uniformity

### Quality Gates

- [ ] Designs are visually distinct across variations
- [ ] No "AI slop" patterns present (purple gradients, generic cards, etc.)
- [ ] Typography hierarchy is clear and intentional
- [ ] Color palette feels cohesive, not random
- [ ] Spacing creates visual rhythm, not monotony

---

## Success Metrics

1. **Design Quality Score**: Blind comparison of SwiftShip vs. competitors
2. **Variation Distinctness**: Measurable visual difference between generated options
3. **User Preference**: A/B test showing preference for new vs. old generation
4. **Design Token Coverage**: % of components using semantic tokens vs. hardcoded values

---

## Dependencies & Prerequisites

1. **Packages to Install:**
   ```bash
   pnpm add culori  # OKLCH color manipulation
   pnpm add uuid    # Already have this
   ```

2. **API Requirements:**
   - Claude API with vision capability (for moodboard analysis)
   - Increased token limit for richer system prompts

3. **Existing Files to Modify:**
   - `apps/web/app/api/generate/route.ts` - Use new pipeline
   - `packages/ai/src/prompts/system.ts` - Enhanced prompt builder
   - `packages/ai/src/client.ts` - Pipeline integration
   - `apps/web/components/editor/chat.tsx` - Context input UI

---

---

## Performance Optimizations (Research-Based)

### Achieving <15s for 3 Variations

**Optimized Pipeline Timeline:**
```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: Context (Parallel, Cached)              ~1-2s total   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Style Token  │  │ Anti-pattern │  │ System Prompt│          │
│  │ Loading      │  │ Loading      │  │ Assembly     │          │
│  │ (cached)     │  │ (cached)     │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ PHASE 2: First Variation (Stream to UI)          ~3-4s         │
├─────────────────────────────────────────────────────────────────┤
│         ┌──────────────────────────┐                            │
│         │ Generate Variation 1     │ → Stream partial to UI     │
│         │ (structure + style)      │                            │
│         └──────────────────────────┘                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ PHASE 3: Remaining Variations (Parallel)         ~4-5s         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                              │
│  │ Variation 2 │  │ Variation 3 │                              │
│  │ (parallel)  │  │ (parallel)  │                              │
│  └─────────────┘  └─────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
TOTAL: 8-11 seconds (within 15s target)
```

### Caching Strategy

```typescript
// Multi-layer cache for design context
interface CacheConfig {
  styleTokens: { ttl: '24h', layer: 'indexeddb' };
  antiPatterns: { ttl: '7d', layer: 'indexeddb' };
  systemPrompt: { ttl: '1h', layer: 'memory' };
  generatedVariations: { ttl: '15min', layer: 'session' };
}
```

### Streaming Implementation (SSE)

```typescript
// Stream first variation while generating others
export async function* streamDesignGeneration(
  prompt: string,
  context: GenerationContext
): AsyncGenerator<DesignEvent> {
  // Emit context ready
  yield { type: 'context_ready', styles: context.stylePreset };

  // Stream first variation
  const firstStream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const chunk of firstStream) {
    yield { type: 'variation_chunk', index: 0, chunk };
  }

  // Generate remaining in parallel (non-streaming)
  const remaining = await Promise.all([1, 2].map(i =>
    generateDesign(prompt, { ...context, variationSeed: i })
  ));

  for (const [i, design] of remaining.entries()) {
    yield { type: 'variation_complete', index: i + 1, design };
  }
}
```

### Rate Limit Handling

```typescript
// Exponential backoff with jitter for Claude API
const retryDelays = [1000, 2000, 4000, 8000];

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < retryDelays.length; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const delay = retryDelays[attempt] + Math.random() * 1000;
        await sleep(delay);
      } else throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Token Budget Management

```
Total Budget: 8000 tokens
├── Base system prompt: 2000 tokens (25%)
├── Design tokens: 500 tokens (6%)
├── Anti-patterns: 300 tokens (4%)
├── User context: 1000 tokens (12%)
└── Response headroom: 4200 tokens (53%)
```

---

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Longer generation time | Medium | Parallel generation, progress indicators |
| Token limit exceeded | High | Compress context, use summaries |
| Style inconsistency | Medium | Strict token validation, examples in prompt |
| Moodboard misinterpretation | Low | Allow text description fallback |
| Over-engineering | Medium | Start with 3 core styles, expand later |

---

## Future Considerations

1. **Community Style Library**: Users can share and import design styles
2. **Brand Kit Import**: Upload existing brand guidelines
3. **Design History**: Track and compare generations over time
4. **Figma Integration**: Import design tokens from Figma
5. **A/B Testing**: Generate two versions for user testing

---

## References & Research

### Internal References
- Current system prompt: `packages/ai/src/prompts/system.ts`
- API route: `apps/web/app/api/generate/route.ts`
- Component schemas: `packages/components/src/schemas/`
- Preview renderer: `apps/web/components/editor/preview.tsx`

### External References
- [SuperDesign Architecture](https://github.com/superdesigndev/superdesign)
- [Anthropic Frontend Aesthetics Guide](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics)
- [OKLCH Color Space](https://bottosson.github.io/posts/oklab/)
- [Modular Type Scales](https://type-scale.com/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [v0.dev Design System Integration](https://vercel.com/blog/ai-powered-prototyping-with-design-systems)

---

## iOS HIG Compliance (Research-Based)

### Encoded iOS Design Rules

These rules must be enforced in all generated designs:

**Safe Areas & Layout:**
```typescript
const IOS_SAFE_AREAS = {
  topSafeArea: 47,    // pt (with notch)
  bottomSafeArea: 34, // pt (home indicator)
  statusBar: 59,      // pt total height
  navigationBar: 44,  // pt base height
  tabBar: 49,         // pt height
  minTouchTarget: 44, // pt × 44pt
};

const IOS_SPACING = {
  unit: 8,            // Base unit (8px grid)
  contentMargin: 16,  // Default content margin
  cardPadding: 16,    // Card internal padding
  listItemHeight: 44, // Standard list item
};
```

**Semantic Colors (iOS 2025):**
```typescript
const IOS_SEMANTIC_COLORS = {
  backgrounds: {
    primary: 'systemBackground',
    secondary: 'secondarySystemBackground',
    tertiary: 'tertiarySystemBackground',
    grouped: 'systemGroupedBackground',
  },
  foreground: {
    primary: '.label',
    secondary: '.secondaryLabel', // 60% opacity
    tertiary: '.tertiaryLabel',   // 30% opacity
  },
  interactive: {
    link: '.link',
    tint: 'tintColor', // App-specific accent
  },
};
```

**Motion Design (Spring Physics):**
```swift
// iOS-native spring animations
Animation.spring(response: 0.4, dampingFraction: 0.7)  // Standard
Animation.spring(response: 0.3, dampingFraction: 0.8)  // Snappy (buttons)
Animation.spring(response: 0.5, dampingFraction: 0.75) // Gentle (modals)
Animation.spring(response: 0.6, dampingFraction: 0.6)  // Bouncy (playful)
```

**2025 Liquid Glass Design Language:**
- Translucent, semi-transparent UI elements with glass-like optical qualities
- Elements refract light and react to motion and content
- Blur effects layered on backgrounds
- Bolder, left-aligned typography
- Concentricity (concentric design rhythms)

### Component State Requirements

| State | Visual Indicator |
|-------|-----------------|
| Default | Neutral appearance |
| Active/Focused | Highlight, border, or tint |
| Highlighted | Color change or scale increase |
| Disabled | 50% opacity |
| Loading | Activity indicator or skeleton |
| Error | Red tint or error badge |
| Success | Green checkmark or confirmation |

**Key Enforcement Rule:** Every interactive element must have distinct visual states.

### Research Findings
- SuperDesign uses 4-stage gated workflow with user approval between stages
- Rich context (moodboards, examples) is essential for non-generic output
- Anti-pattern libraries prevent common AI design mistakes
- Parallel variation generation (3-10 options) enables exploration
- Semantic design tokens ensure consistency

---

**Plan created:** 2026-01-19
**Type:** Enhancement
**Complexity:** HIGH (new architecture, multiple new packages, AI pipeline overhaul)
