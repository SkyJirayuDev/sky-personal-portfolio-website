"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransition, smoothTransition } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-scroll-animation";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={smoothTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Route-specific transition variants
export const routeTransitions = {
  home: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  projects: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  caseStudy: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
};

interface RouteTransitionProps extends PageTransitionProps {
  variant?: keyof typeof routeTransitions;
}

export function RouteTransition({
  children,
  className,
  variant = "home",
}: RouteTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={routeTransitions[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={smoothTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
