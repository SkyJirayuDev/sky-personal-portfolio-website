/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 */

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: threshold,
    margin: rootMargin as any,
    once: triggerOnce,
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setShouldAnimate(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShouldAnimate(true);
      }
    } else if (!triggerOnce) {
      setShouldAnimate(false);
    }
    return undefined;
  }, [isInView, delay, triggerOnce]);

  return {
    ref,
    isInView,
    shouldAnimate,
    controls: shouldAnimate ? "animate" : "initial",
  };
}

interface UseStaggeredAnimationOptions extends UseScrollAnimationOptions {
  staggerDelay?: number;
  itemCount?: number;
}

export function useStaggeredAnimation(
  options: UseStaggeredAnimationOptions = {}
) {
  const { staggerDelay = 0.1, itemCount = 0, ...scrollOptions } = options;
  const scrollAnimation = useScrollAnimation(scrollOptions);

  const getItemDelay = (index: number) => {
    return scrollAnimation.shouldAnimate ? index * staggerDelay : 0;
  };

  const getItemControls = () => {
    return scrollAnimation.shouldAnimate ? "animate" : "initial";
  };

  return {
    ...scrollAnimation,
    getItemDelay,
    getItemControls,
  };
}

// Hook for reduced motion preference
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Hook for scroll-based parallax effects
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return offset;
}
