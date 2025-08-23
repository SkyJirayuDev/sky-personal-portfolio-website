/**
 * Animation utilities and configurations for consistent motion design
 */

import { Variants, Transition } from "framer-motion";

// Animation variants for common patterns
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -30,
  },
};

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -30,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 30,
  },
};

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 30,
  },
};

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -30,
  },
};

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
  },
};

export const slideInUp: Variants = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: "-100%",
    opacity: 0,
  },
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 1.02,
  },
};

// Hover effects
export const hoverScale = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export const hoverLift = {
  y: -5,
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

// Common transition configurations
export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 1,
};

export const smoothTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

export const quickTransition: Transition = {
  duration: 0.15,
  ease: "easeOut",
};

// Reduced motion variants (respects prefers-reduced-motion)
export const createReducedMotionVariants = (variants: Variants): Variants => {
  const reducedVariants: Variants = {};

  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (variant && typeof variant === "object" && !Array.isArray(variant)) {
      reducedVariants[key] = {
        ...variant,
        transition: {
          duration: 0.01,
          ease: "linear" as const,
        },
      };
    } else if (variant) {
      reducedVariants[key] = variant;
    }
  });

  return reducedVariants;
};

// Animation delays for sequential reveals
export const getStaggerDelay = (index: number, baseDelay = 0.1): number => {
  return index * baseDelay;
};

// Magnetic effect configuration
export const magneticConfig = {
  strength: 0.3,
  transition: {
    type: "spring" as const,
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  },
};
