# SwiftShip

**Ship iOS Apps at Swift Speed**

SwiftShip is an AI-powered platform that generates production-ready native iOS apps from natural language. Unlike cross-platform solutions, SwiftShip outputs pure Swift/SwiftUI code that follows Apple's Human Interface Guidelines.

## Why SwiftShip?

| Platform | Output | Native? | iOS Quality |
|----------|--------|---------|-------------|
| Lovable | Web apps | N/A | N/A |
| Rork | React Native | No | Compromised |
| v0.dev | React | N/A | N/A |
| **SwiftShip** | **Swift/SwiftUI** | **Yes** | **Native** |

### Our Thesis

1. **Native > Cross-platform**: React Native and Flutter will never match native iOS quality
2. **iOS users are premium**: Higher spending, better retention, more valuable
3. **Focus wins**: By doing one thing exceptionally well, we beat generalists

## Architecture

SwiftShip uses a **component-based architecture** that ensures 100% compilable output:

```
User Prompt → LLM → Component Tree (JSON) → Swift Codegen → Xcode Project
                          ↓                        ↓
                    Validated JSON           Deterministic
                    (no hallucinations)      (always compiles)
```

**Why this approach?**
- Direct LLM → Swift code has 12-25% failure rate (code doesn't compile)
- Our deterministic codegen ensures every output compiles
- Component library guarantees consistent, high-quality code

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full technical details.

## Project Structure

```
swiftship/
├── apps/
│   └── web/                    # Next.js application
├── packages/
│   ├── core/                   # Shared types & utilities
│   ├── components/             # iOS component schemas (30+ components)
│   ├── codegen/                # Swift code generation engine
│   ├── ai/                     # AI/LLM integration
│   ├── preview/                # Browser-based iOS preview
│   └── db/                     # Database layer
├── tooling/                    # Shared configs
└── docs/                       # Documentation
```

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 15 | App Router, RSC, streaming |
| Language | TypeScript | Type safety for codegen |
| Database | Supabase | PostgreSQL + Auth + Realtime |
| AI | Claude API | Best at structured output |
| Styling | Tailwind + shadcn/ui | Fast, consistent |
| Validation | Zod | Runtime + compile-time |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Component Library

SwiftShip includes 30+ iOS components covering:

- **Primitives**: Text, Button, Image, Icon, Spacer, Divider
- **Layout**: VStack, HStack, ZStack, List, Grid, ScrollView
- **Input**: TextField, Toggle, Picker, DatePicker, Slider
- **Navigation**: NavigationStack, TabView, Sheet, Alert, Menu

Each component:
- Has a Zod schema for validation
- Maps to native SwiftUI
- Generates clean, idiomatic code

## Domain Strategy

| Domain | Purpose |
|--------|---------|
| **swiftship.app** | Primary product |
| swiftship.ai | AI/marketing |
| swiftship.dev | Developer docs |

## Roadmap

### Phase 1: MVP
- [ ] Natural language → iOS app
- [ ] Component-based editor
- [ ] Xcode project export
- [ ] Basic preview

### Phase 2: Build Pipeline
- [ ] Cloud builds (no Mac required)
- [ ] TestFlight integration
- [ ] App Store submission

### Phase 3: Advanced
- [ ] Real-time collaboration
- [ ] Backend generation
- [ ] Component marketplace

## Brand

**Taglines**
- "Ship iOS Apps at Swift Speed"
- "From Idea to App Store"
- "Native iOS, No Compromise"

**Colors**
- Primary: `#0A84FF` (iOS Blue)
- Secondary: `#1C1C1E` (iOS Dark)
- Accent: `#FF9500` (iOS Orange)

## License

Proprietary - All rights reserved.

---

Built with focus. Built for iOS. Built to ship.
