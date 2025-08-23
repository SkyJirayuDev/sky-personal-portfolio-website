"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";
import { magneticConfig } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-scroll-animation";

interface MagneticButtonProps extends Omit<ButtonProps, "asChild"> {
  href?: string;
  external?: boolean;
  magneticStrength?: number;
}

export function MagneticButton({
  children,
  className,
  href,
  external = false,
  magneticStrength = 0.3,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || prefersReducedMotion) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const x = (clientX - left - width / 2) * magneticStrength;
    const y = (clientY - top - height / 2) * magneticStrength;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      e.preventDefault();
      if (external) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        // Smooth scroll to section if it's a hash link
        if (href.startsWith("#")) {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          window.location.href = href;
        }
      }
    }
    props.onClick?.(e);
  };

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { x: position.x, y: position.y }}
      transition={magneticConfig.transition}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
    >
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden group transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/25",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {/* Magnetic glow effect */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={
              isHovered
                ? {
                    background: [
                      "linear-gradient(45deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05))",
                      "linear-gradient(225deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.1))",
                      "linear-gradient(45deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05))",
                    ],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Button content */}
        <motion.span
          className="relative z-10 flex items-center"
          animate={
            isHovered && !prefersReducedMotion ? { scale: 1.05 } : { scale: 1 }
          }
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>

        {/* Ripple effect on click */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full scale-0 opacity-0"
            whileTap={{
              scale: 4,
              opacity: [0, 1, 0],
              transition: { duration: 0.4 },
            }}
          />
        )}
      </Button>
    </motion.div>
  );
}
