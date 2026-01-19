# SwiftShip Technical Architecture

## Executive Summary

SwiftShip generates native iOS apps from natural language using a **component-based architecture** that ensures 100% compilable output. Unlike direct LLM code generation (which has 12-25% failure rates), our approach constrains the LLM to structured JSON and uses deterministic code generation.

## Core Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SwiftShip Architecture                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User Input          AI Layer           Codegen Layer        Output         │
│   ─────────           ────────           ─────────────        ──────         │
│                                                                              │
│   "Create a      ┌─────────────┐    ┌─────────────────┐   ┌────────────┐    │
│    todo app      │   Claude    │    │  TypeScript     │   │  Complete  │    │
│    with..."  ───▶│   API       │───▶│  Swift Codegen  │──▶│  Xcode     │    │
│                  └─────────────┘    └─────────────────┘   │  Project   │    │
│                         │                   │              └────────────┘    │
│                         ▼                   ▼                                │
│                  ┌─────────────┐    ┌─────────────────┐                     │
│                  │  Component  │    │   Swift AST     │                     │
│                  │  Tree JSON  │    │   Builder       │                     │
│                  │  (validated)│    │   (100% valid)  │                     │
│                  └─────────────┘    └─────────────────┘                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Why This Architecture?

### The Problem with Direct LLM Code Generation

Research shows that direct LLM → Swift code generation:
- **12-25% of outputs don't compile** (UICoder paper, 2024)
- Inconsistent code style and patterns
- Hallucinated APIs that don't exist
- Hard to iterate and modify

### Our Solution: Component-Based Generation

1. **LLM outputs structured JSON**, constrained to our schema
2. **Validation layer** catches errors before code generation
3. **Deterministic codegen** ensures every output compiles
4. **Component library** guarantees consistent, high-quality code

**Result**: 100% compilable output, consistent quality, predictable iteration.

---

## System Components

### 1. AI Layer (`packages/ai`)

Handles all LLM interactions with careful prompt engineering.

**Key Responsibilities:**
- System prompt management
- Multi-turn conversation handling
- Response parsing and validation
- Fallback to alternative models

**Design Principles:**
- LLM NEVER generates raw Swift code
- Output is always JSON matching our component schema
- Responses are validated before processing

```typescript
// Example AI response (what we ask the LLM to generate)
{
  "app": {
    "name": "TodoApp",
    "bundleId": "com.user.todoapp",
    "screens": [
      {
        "id": "home",
        "type": "screen",
        "title": "My Todos",
        "content": {
          "type": "list",
          "items": {
            "type": "todo-item",
            "binding": "todos"
          }
        }
      }
    ]
  }
}
```

### 2. Component Library (`packages/components`)

The core IP of SwiftShip. ~50 carefully designed components covering 90% of iOS apps.

**Component Categories:**

| Category | Components |
|----------|------------|
| **Primitives** | Text, Label, Image, Icon (SF Symbols), Button, Link |
| **Input** | TextField, SecureField, TextEditor, Picker, DatePicker, Toggle, Slider, Stepper |
| **Layout** | VStack, HStack, ZStack, Grid, List, ScrollView, Spacer, Divider |
| **Navigation** | NavigationStack, TabView, Sheet, FullScreenCover, Alert, ConfirmationDialog |
| **Data Display** | Card, Badge, ProgressView, Gauge, Chart |
| **Patterns** | LoginView, SettingsView, ProfileView, FeedView, DetailView, EmptyState |

**Each Component Includes:**

```typescript
// packages/components/src/schemas/button.ts

import { z } from 'zod';

// 1. JSON Schema (for LLM constraints + validation)
export const ButtonSchema = z.object({
  type: z.literal('button'),
  props: z.object({
    label: z.string(),
    style: z.enum(['primary', 'secondary', 'destructive', 'plain']).default('primary'),
    size: z.enum(['small', 'medium', 'large']).default('medium'),
    icon: z.string().optional(), // SF Symbol name
    disabled: z.boolean().default(false),
    action: ActionSchema,
  }),
});

// 2. TypeScript type (derived from schema)
export type Button = z.infer<typeof ButtonSchema>;

// 3. Metadata for editor/catalog
export const ButtonMeta = {
  name: 'Button',
  description: 'A tappable button that triggers an action',
  category: 'primitives',
  icon: 'hand.tap',
  defaultProps: {
    label: 'Button',
    style: 'primary',
    size: 'medium',
  },
};
```

### 3. Code Generation Engine (`packages/codegen`)

Deterministic Swift code generation from validated component trees.

**Architecture:**

```
Component Tree (JSON)
        │
        ▼
┌───────────────────┐
│  Swift AST        │  Build abstract syntax tree
│  Builder          │  (type-safe, validated)
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Code             │  Convert AST to formatted
│  Printer          │  Swift source code
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Project          │  Assemble complete
│  Generator        │  Xcode project
└───────────────────┘
        │
        ▼
    .xcodeproj + Sources + Assets
```

**Swift AST Builder Example:**

```typescript
// packages/codegen/src/ast/builder.ts

class SwiftASTBuilder {
  // Build a SwiftUI View struct
  view(name: string, body: () => SwiftNode[]): StructDecl {
    return {
      kind: 'struct',
      name: name,
      conformances: ['View'],
      members: [
        this.computedProperty('body', 'some View', body),
      ],
    };
  }

  // Build a VStack
  vstack(alignment: string, spacing: number, children: SwiftNode[]): ViewBuilder {
    return {
      kind: 'view-builder',
      name: 'VStack',
      modifiers: [
        { name: 'alignment', value: `.${alignment}` },
        { name: 'spacing', value: spacing.toString() },
      ],
      children,
    };
  }
}
```

**Output Example:**

```swift
// Generated by SwiftShip - DO NOT EDIT
// https://swiftship.app

import SwiftUI

struct HomeView: View {
    @State private var todos: [Todo] = []

    var body: some View {
        NavigationStack {
            List(todos) { todo in
                TodoRow(todo: todo)
            }
            .navigationTitle("My Todos")
            .toolbar {
                Button("Add", systemImage: "plus") {
                    // Action
                }
            }
        }
    }
}

#Preview {
    HomeView()
}
```

### 4. Web Preview (`packages/preview`)

Browser-based iOS preview using React components styled to match iOS exactly.

**Why Web-Based:**
- No Mac infrastructure needed
- Instant feedback (< 100ms)
- Works in browser
- 90% accuracy for UI preview

**Architecture:**

```
Component Tree (JSON)
        │
        ▼
┌───────────────────┐
│  Preview          │  Map components to
│  Renderer         │  iOS-styled React
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Simulator        │  iPhone frame chrome,
│  Frame            │  status bar, home indicator
└───────────────────┘
        │
        ▼
    Browser Preview
```

**Component Mapping:**

| SwiftUI Component | React Preview Component |
|-------------------|------------------------|
| `NavigationStack` | `<IOSNavigationView>` |
| `List` | `<IOSList>` |
| `Button` | `<IOSButton>` |
| `TextField` | `<IOSTextField>` |

### 5. Database Layer (`packages/db`)

Type-safe database access using Drizzle ORM with Supabase PostgreSQL.

**Core Tables:**

```typescript
// packages/db/src/schema.ts

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  plan: text('plan').notNull().default('free'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),

  // App metadata
  bundleId: text('bundle_id'),
  displayName: text('display_name'),

  // The component tree (core data)
  componentTree: jsonb('component_tree'),

  // Cached generated code
  generatedCode: jsonb('generated_code'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const generations = pgTable('generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  prompt: text('prompt').notNull(),
  response: jsonb('response'),
  tokensUsed: integer('tokens_used'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

## Web Application (`apps/web`)

The main Next.js application.

### Route Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (dashboard)/
│   ├── layout.tsx              # Dashboard shell
│   ├── page.tsx                # Project list
│   └── projects/
│       └── [id]/
│           ├── page.tsx        # Project overview
│           └── editor/
│               └── page.tsx    # Main editor
├── (marketing)/
│   ├── page.tsx                # Landing page
│   ├── pricing/page.tsx
│   └── docs/[...slug]/page.tsx
└── api/
    ├── generate/route.ts       # AI generation endpoint
    ├── export/route.ts         # Xcode project export
    └── webhooks/
        └── stripe/route.ts
```

### Key Pages

**Editor Page** (`/projects/[id]/editor`)
- Left panel: Component tree / Chat interface
- Center: Preview canvas (iOS simulator)
- Right panel: Properties / Code view
- Toolbar: Undo, Redo, Export, Deploy

### State Management

```typescript
// Zustand store for editor state
interface EditorStore {
  // Project data
  project: Project | null;
  componentTree: ComponentNode | null;

  // Selection
  selectedNodeId: string | null;

  // History for undo/redo
  history: ComponentNode[];
  historyIndex: number;

  // Actions
  updateNode: (id: string, updates: Partial<ComponentNode>) => void;
  addNode: (parentId: string, node: ComponentNode) => void;
  deleteNode: (id: string) => void;
  undo: () => void;
  redo: () => void;
}
```

---

## Technology Decisions

### Why These Choices?

| Technology | Choice | Rationale |
|------------|--------|-----------|
| **Framework** | Next.js 15 | App Router, RSC, streaming, industry standard |
| **Language** | TypeScript | Type safety critical for codegen, better DX |
| **Database** | Supabase | PostgreSQL + Auth + Storage + Realtime |
| **ORM** | Drizzle | Type-safe, lightweight, great DX |
| **Styling** | Tailwind + shadcn/ui | Fast development, consistent design |
| **AI** | Claude API | Best at structured output, reasoning |
| **Validation** | Zod | Runtime + compile-time validation |
| **State** | Zustand | Simple, TypeScript-friendly |
| **Hosting** | Vercel | Seamless Next.js deployment |

### What We're NOT Using

| Technology | Why Not |
|------------|---------|
| **tRPC** | Overkill for this use case, adds complexity |
| **Prisma** | Drizzle is lighter, better TS inference |
| **Redux** | Zustand is simpler, sufficient for our needs |
| **GraphQL** | REST/Server Actions sufficient, lower complexity |
| **React Native** | We're building NATIVE iOS, not cross-platform |

---

## Data Flow

### Generation Flow

```
1. User enters prompt
   │
   ▼
2. API validates user, checks rate limits
   │
   ▼
3. AI service builds system prompt with:
   - Component library schema
   - Current component tree (for context)
   - User's conversation history
   │
   ▼
4. Claude generates component tree JSON
   │
   ▼
5. Response validated against Zod schemas
   │
   ▼
6. Component tree saved to database
   │
   ▼
7. Preview re-renders in browser
   │
   ▼
8. (On export) Codegen produces Swift + Xcode project
```

### Export Flow

```
1. User clicks "Export"
   │
   ▼
2. Server fetches project component tree
   │
   ▼
3. Codegen engine:
   a. Generates Swift source files
   b. Generates asset catalog
   c. Generates Info.plist
   d. Generates xcodeproj
   │
   ▼
4. Files zipped and returned
   │
   ▼
5. User downloads complete Xcode project
```

---

## Security Considerations

### Input Validation
- All user input validated with Zod schemas
- Component tree structure enforced
- No arbitrary code execution

### API Security
- Supabase RLS for row-level security
- Rate limiting on AI endpoints
- JWT validation on all protected routes

### Generated Code Safety
- No user input interpolated into Swift code
- All strings properly escaped
- No dynamic code execution in output

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Preview render | < 100ms | After component tree update |
| AI generation | < 5s | For typical prompts |
| Export generation | < 3s | Complete Xcode project |
| Page load (LCP) | < 1.5s | Marketing pages |
| Editor TTI | < 2s | Time to interactive |

---

## Scalability Path

### Phase 1: MVP (Current)
- Single Vercel deployment
- Supabase free/pro tier
- Export-only (no cloud builds)

### Phase 2: Growth
- Add cloud build pipeline (Codemagic/Bitrise)
- Redis for caching (Upstash)
- Background job processing (Inngest)

### Phase 3: Scale
- Multi-region deployment
- Dedicated build infrastructure
- Enterprise features (SSO, teams)

---

## Testing Strategy

### Unit Tests
- Component schema validation
- Swift codegen output
- AST builder correctness

### Integration Tests
- AI response parsing
- Export pipeline (JSON → Xcode project)
- Database operations

### E2E Tests
- Full generation flow
- Editor interactions
- Export and verify project compiles

### Codegen Verification
- Every generated project is compiled with `xcodebuild`
- Automated CI to catch regressions
- Sample app suite for coverage
