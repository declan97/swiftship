# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                              # Start all dev servers (runs turbo dev)
pnpm build                            # Build all packages and web app
pnpm typecheck                        # TypeScript type checking across all packages
pnpm lint                             # Run linting across all packages
pnpm format                           # Format code with Prettier

# Testing (only codegen has tests currently)
pnpm -F @swiftship/codegen test       # Run codegen tests (Vitest)

# Individual package commands
pnpm -F web dev                       # Web app only
pnpm -F @swiftship/ai build           # Build AI package
pnpm -F @swiftship/codegen build      # Build codegen package
```

**Environment Setup:**
- Node.js >=20.0.0, pnpm 9.15.0
- Copy `apps/web/.env.local.example` to `apps/web/.env.local`
- Required: `ANTHROPIC_API_KEY` for AI generation
- Required: `NEXT_PUBLIC_CONVEX_URL` for database (deployed at precise-bear-574.convex.cloud)

## Architecture

SwiftShip is an AI-powered iOS app generator that converts natural language prompts into native SwiftUI code. The monorepo uses Turborepo + pnpm workspaces.

### Package Structure

```
packages/
├── core/         # Shared types (ComponentNode, AppDefinition, DesignTokens)
├── components/   # iOS component schemas - 30+ components with Zod validation
├── codegen/      # Swift code generation engine (AST builder → Swift printer)
├── ai/           # Claude API integration, design context, streaming generation
├── preview/      # Browser-based iOS preview (React components mimicking iOS)
└── db/           # Database layer (stub, using Convex instead)

apps/
└── web/          # Next.js 15 app with editor, dashboard, API routes
```

### Data Flow

```
User Prompt → /api/generate → @swiftship/ai (Claude API) → ComponentNode tree
    ↓
Validate with Zod → Save to Convex → Render in @swiftship/preview
    ↓
Export → @swiftship/codegen → Swift AST → Xcode project ZIP
```

### Web App Structure

```
apps/web/
├── app/
│   ├── api/generate/route.ts    # AI generation endpoint (streaming)
│   ├── api/export/route.ts      # Xcode project export
│   ├── dashboard/               # Projects list and editor
│   │   └── projects/[id]/       # Project detail/editor page
│   └── page.tsx                 # Landing page
├── components/
│   ├── editor/                  # Code view, preview, design panel
│   ├── providers/               # Convex, theme, toast providers
│   └── ui/                      # shadcn/ui components
├── lib/stores/editor.ts         # Zustand store with undo/redo (Zundo)
└── convex/                      # Database schema and mutations
```

### Key Concepts

**ComponentNode:** Tree structure representing UI. Each node has a `type` (from component schemas), `props`, and optional `children`.

**Design Context:** AI generation uses design styles (editorial, minimalist, vibrant, etc.) with color palettes in OKLCH space, typography, and spacing tokens.

**Code Generation:** AST-based approach - component tree → Swift AST nodes → formatted Swift code via printer.

### Adding a New Component

1. Add Zod schema in `packages/components/src/schemas/[category].ts`
2. Register in `packages/components/src/index.ts` COMPONENT_CATALOG
3. Add generator in `packages/codegen/src/generators/`
4. Add React preview in `packages/preview/src/`

### Technology Stack

- **Framework:** Next.js 15 (App Router, Server Components)
- **State:** Zustand + Zundo (undo/redo)
- **Database:** Convex (real-time BaaS)
- **AI:** Claude API via @anthropic-ai/sdk
- **Validation:** Zod throughout
- **UI:** shadcn/ui + Radix + Tailwind CSS
- **Animations:** Motion (framer-motion successor)

### Deployment

Vercel deployment from main branch. The `vercel.json` uses:
- `buildCommand: "pnpm turbo run build --filter=web"`
- `framework: "nextjs"`

Routes changed from `(app)` route group to `/dashboard/` prefix due to Next.js 15 Vercel deployment bug with route groups.
