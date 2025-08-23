"use client";

import { createContext, useContext, ReactNode } from "react";
import {
  useAccessibility,
  useKeyboardNavigation,
} from "@/hooks/use-accessibility";
import { ScreenReaderAnnouncements } from "@/components/accessibility/screen-reader-announcements";

interface AccessibilityContextValue {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  isKeyboardUser: boolean;
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextValue | undefined
>(undefined);

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibilityContext must be used within an AccessibilityProvider"
    );
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const { prefersReducedMotion, prefersHighContrast, announcements, announce } =
    useAccessibility();

  const { isKeyboardUser } = useKeyboardNavigation();

  const value: AccessibilityContextValue = {
    prefersReducedMotion,
    prefersHighContrast,
    isKeyboardUser,
    announce,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <ScreenReaderAnnouncements announcements={announcements} />
    </AccessibilityContext.Provider>
  );
}
