"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useFocusTrap } from "@/hooks/use-accessibility";

interface FocusTrapProps {
  children: ReactNode;
  isActive: boolean;
  onEscape?: () => void;
  className?: string;
}

export function FocusTrap({
  children,
  isActive,
  onEscape,
  className,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setTrapRef = useFocusTrap(isActive);

  useEffect(() => {
    if (containerRef.current) {
      setTrapRef(containerRef.current);
    }
  }, [setTrapRef]);

  useEffect(() => {
    const handleEscape = (e: Event) => {
      if (e.type === "focustrap:escape" && onEscape) {
        onEscape();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("focustrap:escape", handleEscape);
      return () => {
        container.removeEventListener("focustrap:escape", handleEscape);
      };
    }

    return undefined;
  }, [onEscape]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
