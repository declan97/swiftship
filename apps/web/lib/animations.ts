/**
 * Motion animation variants and utilities
 *
 * Uses motion/react (formerly framer-motion) for complex animations
 * CSS animations are preferred for simpler cases - see globals.css
 */

import type { Variants, Transition } from 'motion/react';

// ============================================================================
// Spring Configurations
// ============================================================================

export const springConfig = {
  /** Default spring - snappy and responsive */
  default: { type: 'spring', stiffness: 400, damping: 30 } as Transition,
  /** Gentle spring - for subtle movements */
  gentle: { type: 'spring', stiffness: 200, damping: 20 } as Transition,
  /** Bouncy spring - for playful interactions */
  bouncy: { type: 'spring', stiffness: 500, damping: 15 } as Transition,
  /** Smooth - no spring, just ease */
  smooth: { type: 'tween', ease: 'easeOut', duration: 0.3 } as Transition,
};

// ============================================================================
// Page/Section Variants
// ============================================================================

/** Fade in from below - good for page transitions */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/** Fade in from the side - good for sidebars */
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/** Simple fade - no movement */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Scale in - good for modals and popovers */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// ============================================================================
// List/Stagger Variants
// ============================================================================

/** Container for staggered children */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/** Individual stagger item */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

/** Stagger from different directions */
export const staggerItemLeft: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
};

// ============================================================================
// Interactive Variants
// ============================================================================

/** Button hover/tap effect */
export const buttonInteraction: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

/** Card hover lift effect */
export const cardHover: Variants = {
  initial: { y: 0, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

// ============================================================================
// Navigation Variants
// ============================================================================

/** Sidebar collapse animation */
export const sidebarVariants: Variants = {
  expanded: { width: 240 },
  collapsed: { width: 64 },
};

/** Mobile drawer */
export const drawerVariants: Variants = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
};

/** Backdrop for modals/drawers */
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// ============================================================================
// Command Palette Variants
// ============================================================================

export const commandPaletteVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: -10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springConfig.default,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: springConfig.smooth,
  },
};

// ============================================================================
// Loading/Progress Variants
// ============================================================================

/** Skeleton pulse */
export const skeletonPulse: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1,
    },
  },
};

/** Spinner rotation */
export const spinnerRotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear',
    },
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create stagger delay for a given index
 */
export function getStaggerDelay(index: number, baseDelay = 0.05): number {
  return index * baseDelay;
}

/**
 * Merge transition with spring config
 */
export function withSpring(transition: Partial<Transition> = {}): Transition {
  return { ...springConfig.default, ...transition };
}
