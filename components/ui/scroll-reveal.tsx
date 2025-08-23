"use client";

import { motion, Variants } from "framer-motion";
import {
  useScrollAnimation,
  useReducedMotion,
} from "@/hooks/use-scroll-animation";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  createReducedMotionVariants,
  smoothTransition,
} from "@/lib/animations";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn";
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

const variants: Record<string, Variants> = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
};

export function ScrollReveal({
  children,
  variant = "fadeInUp",
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  triggerOnce = true,
  className,
}: ScrollRevealProps) {
  const { ref, controls } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
    delay,
  });

  const prefersReducedMotion = useReducedMotion();
  const selectedVariant = variants[variant];
  const animationVariants =
    prefersReducedMotion && selectedVariant
      ? createReducedMotionVariants(selectedVariant)
      : selectedVariant;

  if (!animationVariants) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={animationVariants}
      initial="initial"
      animate={controls}
      transition={smoothTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Specialized scroll reveal components
export function ScrollFadeIn({
  children,
  ...props
}: Omit<ScrollRevealProps, "variant">) {
  return (
    <ScrollReveal variant="fadeInUp" {...props}>
      {children}
    </ScrollReveal>
  );
}

export function ScrollSlideLeft({
  children,
  ...props
}: Omit<ScrollRevealProps, "variant">) {
  return (
    <ScrollReveal variant="fadeInLeft" {...props}>
      {children}
    </ScrollReveal>
  );
}

export function ScrollSlideRight({
  children,
  ...props
}: Omit<ScrollRevealProps, "variant">) {
  return (
    <ScrollReveal variant="fadeInRight" {...props}>
      {children}
    </ScrollReveal>
  );
}

export function ScrollScale({
  children,
  ...props
}: Omit<ScrollRevealProps, "variant">) {
  return (
    <ScrollReveal variant="scaleIn" {...props}>
      {children}
    </ScrollReveal>
  );
}
