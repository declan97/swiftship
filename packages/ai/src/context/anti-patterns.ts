/**
 * Anti-pattern library to prevent generic "AI slop" in generated designs.
 * These rules help Claude avoid common cliches and create distinctive interfaces.
 */

export interface AntiPattern {
  id: string;
  category: AntiPatternCategory;
  name: string;
  description: string;
  example: string;
  alternative: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export type AntiPatternCategory =
  | 'color'
  | 'typography'
  | 'layout'
  | 'component'
  | 'interaction'
  | 'content'
  | 'spacing';

/**
 * Comprehensive anti-pattern library (30+ rules)
 */
export const ANTI_PATTERNS: AntiPattern[] = [
  // COLOR ANTI-PATTERNS
  {
    id: 'purple-gradient-bg',
    category: 'color',
    name: 'Purple Gradient Background',
    description: 'The ubiquitous purple-to-blue gradient that screams "AI generated"',
    example: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    alternative: 'Use solid OKLCH colors or subtle monochromatic gradients matching your palette',
    severity: 'critical',
  },
  {
    id: 'default-blue-accent',
    category: 'color',
    name: 'Default Blue Accent',
    description: 'Using #007AFF or system blue as the only accent color',
    example: 'Primary button in pure iOS system blue',
    alternative: 'Choose distinctive accent colors that create brand identity',
    severity: 'high',
  },
  {
    id: 'rainbow-icon-colors',
    category: 'color',
    name: 'Rainbow Icon Colors',
    description: 'Each icon in a navigation uses a different random color',
    example: 'Tab bar with blue, green, orange, purple, red icons',
    alternative: 'Use consistent icon colors from your palette, typically 1-2 colors max',
    severity: 'high',
  },
  {
    id: 'low-contrast-gray',
    category: 'color',
    name: 'Low Contrast Gray Text',
    description: 'Text that fails accessibility contrast requirements',
    example: '#999 text on #fff background (3.0:1 contrast)',
    alternative: 'Ensure minimum 4.5:1 contrast for body text, 3:1 for large text',
    severity: 'critical',
  },
  {
    id: 'true-black-dark-mode',
    category: 'color',
    name: 'Pure Black Dark Mode',
    description: 'Using #000000 as dark mode background causes eye strain',
    example: 'background: #000',
    alternative: 'Use dark grays like oklch(0.15 0.02 260) for comfortable viewing',
    severity: 'medium',
  },
  {
    id: 'oversaturated-colors',
    category: 'color',
    name: 'Oversaturated Colors',
    description: 'Colors at maximum saturation look garish and unprofessional',
    example: 'hsl(200, 100%, 50%) - pure saturated colors',
    alternative: 'Reduce chroma in OKLCH to 0.15-0.25 for sophisticated palettes',
    severity: 'medium',
  },

  // TYPOGRAPHY ANTI-PATTERNS
  {
    id: 'inter-everywhere',
    category: 'typography',
    name: 'Inter Font Default',
    description: 'Inter is the "unstyled tailwind" of fonts - marks AI generation',
    example: 'font-family: Inter, sans-serif everywhere',
    alternative: 'Use SF Pro (iOS default) or distinctive fonts like Avenir, Libre Franklin',
    severity: 'high',
  },
  {
    id: 'inconsistent-type-scale',
    category: 'typography',
    name: 'Random Font Sizes',
    description: 'Font sizes without a mathematical relationship',
    example: '14px, 17px, 22px, 31px - arbitrary sizes',
    alternative: 'Use a modular scale: 12, 14, 16, 19, 23, 28 (minor third)',
    severity: 'medium',
  },
  {
    id: 'all-bold-headings',
    category: 'typography',
    name: 'Every Heading is Bold',
    description: 'Lack of weight variation in typography hierarchy',
    example: 'All h1-h6 using font-weight: bold',
    alternative: 'Vary weights: display (regular), heading (semibold), body (regular)',
    severity: 'medium',
  },
  {
    id: 'tiny-line-height',
    category: 'typography',
    name: 'Cramped Line Height',
    description: 'Text with line-height below 1.4 for body text',
    example: 'line-height: 1.2 on paragraph text',
    alternative: 'Use 1.4-1.6 for body text, 1.1-1.2 for large headings',
    severity: 'high',
  },
  {
    id: 'centered-body-text',
    category: 'typography',
    name: 'Centered Body Text',
    description: 'Long-form centered text is hard to read',
    example: 'text-align: center on paragraphs',
    alternative: 'Left-align body text, center only short headlines/labels',
    severity: 'medium',
  },
  {
    id: 'all-caps-body',
    category: 'typography',
    name: 'Excessive Uppercase',
    description: 'Using ALL CAPS for more than short labels',
    example: 'ENTIRE SENTENCES IN UPPERCASE',
    alternative: 'Reserve uppercase for short labels, buttons, and category headers',
    severity: 'medium',
  },

  // LAYOUT ANTI-PATTERNS
  {
    id: 'identical-card-grid',
    category: 'layout',
    name: 'Uniform Card Grid',
    description: 'Every item in a grid is an identically-sized rounded card',
    example: '3x3 grid of identical white cards with shadows',
    alternative: 'Vary card sizes, use list views, or create visual hierarchy',
    severity: 'high',
  },
  {
    id: 'everything-centered',
    category: 'layout',
    name: 'Center-Aligned Everything',
    description: 'Every element center-aligned creates weak visual flow',
    example: 'All stacks use alignment: center',
    alternative: 'Use leading alignment for content, center sparingly for heroes',
    severity: 'high',
  },
  {
    id: 'uniform-spacing',
    category: 'layout',
    name: 'Uniform Spacing Everywhere',
    description: 'Same spacing value used for all gaps',
    example: 'spacing: 16 on every stack',
    alternative: 'Vary spacing based on content hierarchy: 8, 16, 24, 32, 48',
    severity: 'medium',
  },
  {
    id: 'no-visual-hierarchy',
    category: 'layout',
    name: 'Flat Visual Hierarchy',
    description: 'All elements have equal visual weight',
    example: 'List where every row looks exactly the same',
    alternative: 'Create primary/secondary/tertiary levels through size, weight, color',
    severity: 'high',
  },
  {
    id: 'cramped-edges',
    category: 'layout',
    name: 'No Edge Padding',
    description: 'Content touching screen edges',
    example: 'Content starting at x:0 with no horizontal padding',
    alternative: 'Use 16-20pt horizontal padding from screen edges (iOS standard)',
    severity: 'high',
  },
  {
    id: 'excessive-nesting',
    category: 'layout',
    name: 'Deep Stack Nesting',
    description: 'More than 3-4 levels of nested stacks',
    example: 'VStack > HStack > VStack > HStack > VStack pattern',
    alternative: 'Flatten layouts, use sections, or refactor into components',
    severity: 'medium',
  },

  // COMPONENT ANTI-PATTERNS
  {
    id: 'generic-cta-button',
    category: 'component',
    name: 'Generic "Get Started" CTA',
    description: 'Vague button labels that say nothing specific',
    example: 'Get Started, Learn More, Click Here',
    alternative: 'Action-specific labels: "Create Project", "View Dashboard"',
    severity: 'high',
  },
  {
    id: 'icon-without-purpose',
    category: 'component',
    name: 'Decorative Icons',
    description: 'Icons added for visual interest but not function',
    example: 'Random icons next to every list item',
    alternative: 'Icons should indicate action or category, not decoration',
    severity: 'medium',
  },
  {
    id: 'pill-everything',
    category: 'component',
    name: 'Pill-Shaped Overkill',
    description: 'Every button and tag is a pill (fully rounded)',
    example: 'borderRadius: 9999 on every interactive element',
    alternative: 'Reserve pills for specific contexts: tags, selection chips',
    severity: 'medium',
  },
  {
    id: 'shadow-on-everything',
    category: 'component',
    name: 'Universal Shadow',
    description: 'Every card, button, and container has a drop shadow',
    example: 'shadow: 0 4px 6px rgba(0,0,0,0.1) on all elements',
    alternative: 'Shadows for elevation only: modals, popovers, floating buttons',
    severity: 'medium',
  },
  {
    id: 'gradient-button',
    category: 'component',
    name: 'Gradient Button',
    description: 'Buttons with gradient backgrounds look dated',
    example: 'Button with linear-gradient(90deg, #6366f1, #8b5cf6)',
    alternative: 'Solid color buttons or subtle hover state changes',
    severity: 'high',
  },
  {
    id: 'border-radius-inconsistency',
    category: 'component',
    name: 'Inconsistent Border Radius',
    description: 'Different radius values on similar elements',
    example: 'Buttons: 8px, Cards: 12px, Inputs: 6px, Modals: 16px',
    alternative: 'Define 2-3 radius values and use consistently: 8, 12, 16',
    severity: 'medium',
  },

  // INTERACTION ANTI-PATTERNS
  {
    id: 'no-touch-targets',
    category: 'interaction',
    name: 'Small Touch Targets',
    description: 'Interactive elements smaller than 44x44pt',
    example: '24x24pt icon buttons',
    alternative: 'Minimum 44x44pt touch targets (iOS HIG requirement)',
    severity: 'critical',
  },
  {
    id: 'no-loading-states',
    category: 'interaction',
    name: 'Missing Loading States',
    description: 'No indication of async operations',
    example: 'Button that freezes during API call',
    alternative: 'Show spinners, skeleton states, or progress indicators',
    severity: 'high',
  },
  {
    id: 'bounce-animation-abuse',
    category: 'interaction',
    name: 'Excessive Bounce Animations',
    description: 'Everything bounces on appear/tap',
    example: 'spring(0.3, 0.5) on every element',
    alternative: 'Subtle spring animations (0.5-0.8 damping) on key interactions only',
    severity: 'medium',
  },

  // CONTENT ANTI-PATTERNS
  {
    id: 'lorem-ipsum',
    category: 'content',
    name: 'Lorem Ipsum',
    description: 'Placeholder text instead of realistic content',
    example: 'Lorem ipsum dolor sit amet...',
    alternative: 'Use realistic, context-appropriate content',
    severity: 'high',
  },
  {
    id: 'generic-usernames',
    category: 'content',
    name: 'Generic User Content',
    description: 'John Doe, Jane Smith, user@email.com',
    example: 'John Doe - john@example.com',
    alternative: 'Diverse, realistic names and contextual placeholders',
    severity: 'medium',
  },
  {
    id: 'empty-state-missing',
    category: 'content',
    name: 'No Empty States',
    description: 'Lists that show nothing when empty',
    example: 'Blank screen when no items exist',
    alternative: 'Helpful empty states with actions: "No projects yet. Create one!"',
    severity: 'high',
  },

  // SPACING ANTI-PATTERNS
  {
    id: 'magic-numbers',
    category: 'spacing',
    name: 'Magic Number Spacing',
    description: 'Arbitrary spacing values not on a scale',
    example: 'padding: 13, margin: 7, gap: 11',
    alternative: 'Use 4px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64',
    severity: 'medium',
  },
  {
    id: 'no-breathing-room',
    category: 'spacing',
    name: 'Cramped Sections',
    description: 'Insufficient space between major sections',
    example: '8px gap between unrelated content blocks',
    alternative: 'Use 32-48pt spacing between major sections',
    severity: 'high',
  },
];

/**
 * Get anti-patterns by category
 */
export function getAntiPatternsByCategory(category: AntiPatternCategory): AntiPattern[] {
  return ANTI_PATTERNS.filter((p) => p.category === category);
}

/**
 * Get critical and high severity anti-patterns
 */
export function getCriticalAntiPatterns(): AntiPattern[] {
  return ANTI_PATTERNS.filter((p) => p.severity === 'critical' || p.severity === 'high');
}

/**
 * Format anti-patterns as prompt context
 */
export function formatAntiPatternsForPrompt(patterns: AntiPattern[] = ANTI_PATTERNS): string {
  const grouped = patterns.reduce(
    (acc, pattern) => {
      if (!acc[pattern.category]) {
        acc[pattern.category] = [];
      }
      acc[pattern.category].push(pattern);
      return acc;
    },
    {} as Record<string, AntiPattern[]>
  );

  let output = '## Design Anti-Patterns to Avoid\n\n';

  for (const [category, categoryPatterns] of Object.entries(grouped)) {
    output += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;

    for (const pattern of categoryPatterns) {
      const severityEmoji =
        pattern.severity === 'critical'
          ? '🚫'
          : pattern.severity === 'high'
            ? '⚠️'
            : pattern.severity === 'medium'
              ? '📝'
              : '💡';

      output += `${severityEmoji} **${pattern.name}**\n`;
      output += `   - Problem: ${pattern.description}\n`;
      output += `   - Instead: ${pattern.alternative}\n\n`;
    }
  }

  return output;
}

/**
 * Get anti-patterns relevant to a specific design style
 */
export function getAntiPatternsForStyle(styleId: string): AntiPattern[] {
  // Critical patterns always apply
  const criticalPatterns = ANTI_PATTERNS.filter((p) => p.severity === 'critical');

  // Style-specific patterns to emphasize
  const styleSpecificIds: Record<string, string[]> = {
    editorial: [
      'purple-gradient-bg',
      'inter-everywhere',
      'identical-card-grid',
      'shadow-on-everything',
    ],
    glassmorphism: ['true-black-dark-mode', 'cramped-edges', 'no-visual-hierarchy'],
    swiss: ['pill-everything', 'gradient-button', 'rainbow-icon-colors', 'shadow-on-everything'],
    neoBrutalism: [
      'inter-everywhere',
      'low-contrast-gray',
      'uniform-spacing',
      'generic-cta-button',
    ],
    darkInterface: [
      'true-black-dark-mode',
      'low-contrast-gray',
      'oversaturated-colors',
      'cramped-edges',
    ],
    organic: ['everything-centered', 'uniform-spacing', 'identical-card-grid'],
  };

  const specificIds = styleSpecificIds[styleId] ?? [];
  const specificPatterns = ANTI_PATTERNS.filter(
    (p) => specificIds.includes(p.id) && p.severity !== 'critical'
  );

  // Combine without duplicates
  const seen = new Set<string>();
  const result: AntiPattern[] = [];

  for (const p of [...criticalPatterns, ...specificPatterns]) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      result.push(p);
    }
  }

  return result;
}
