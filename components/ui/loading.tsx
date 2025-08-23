"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Loading({ size = "md", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        className
      )}
    >
      <motion.div
        className={cn(
          "border-2 border-muted-foreground/20 border-t-primary rounded-full",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-label="Loading"
      />
      {text && (
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}

export function SectionLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Loading size="md" />
    </div>
  );
}
