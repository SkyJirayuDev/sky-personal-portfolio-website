"use client";

import { motion } from "framer-motion";
import {
  useStaggeredAnimation,
  useReducedMotion,
} from "@/hooks/use-scroll-animation";
import {
  staggerContainer,
  staggerItem,
  createReducedMotionVariants,
} from "@/lib/animations";

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  threshold?: number;
  rootMargin?: string;
}

export function StaggeredList({
  children,
  className,
  itemClassName,
  staggerDelay = 0.1,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
}: StaggeredListProps) {
  const { ref, controls } = useStaggeredAnimation({
    staggerDelay,
    threshold,
    rootMargin,
    itemCount: children.length,
  });

  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? createReducedMotionVariants(staggerContainer)
    : staggerContainer;
  const itemVariants = prefersReducedMotion
    ? createReducedMotionVariants(staggerItem)
    : staggerItem;

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="initial"
      animate={controls}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Grid variant for staggered animations
interface StaggeredGridProps extends StaggeredListProps {
  columns?: number;
}

export function StaggeredGrid({
  children,
  columns = 3,
  className,
  itemClassName = "",
  ...props
}: StaggeredGridProps) {
  const gridClass = `grid grid-cols-1 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-6`;

  return (
    <StaggeredList
      className={`${gridClass} ${className || ""}`}
      itemClassName={itemClassName}
      {...props}
    >
      {children}
    </StaggeredList>
  );
}
