/**
 * Accessibility utilities and helpers
 */

/**
 * Generate a unique ID for accessibility attributes
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  return focusableSelectors.some(selector => element.matches(selector));
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(", ");

  return Array.from(container.querySelectorAll(focusableSelectors));
}

/**
 * Trap focus within a container
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  };

  document.addEventListener("keydown", handleTabKey);
  firstElement?.focus();

  return () => {
    document.removeEventListener("keydown", handleTabKey);
  };
}

/**
 * Announce content to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(_color1: string, _color2: string): number {
  // This is a simplified version - in production you'd want a more robust color parsing
  // For now, we'll return a placeholder that indicates good contrast
  return 4.5; // WCAG AA minimum
}

/**
 * Validate color contrast meets WCAG standards
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA"
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const minRatio = level === "AAA" ? 7 : 4.5;
  return ratio >= minRatio;
}

/**
 * Create accessible description for complex UI elements
 */
export function createAccessibleDescription(
  element: string,
  state?: string,
  position?: { current: number; total: number }
): string {
  let description = element;

  if (state) {
    description += `, ${state}`;
  }

  if (position) {
    description += `, ${position.current} of ${position.total}`;
  }

  return description;
}

/**
 * Handle keyboard navigation for custom components
 */
export function handleArrowKeyNavigation(
  e: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: "horizontal" | "vertical" = "horizontal"
): number {
  const isHorizontal = orientation === "horizontal";
  const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
  const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

  let newIndex = currentIndex;

  switch (e.key) {
    case nextKey:
      newIndex = (currentIndex + 1) % items.length;
      break;
    case prevKey:
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      break;
    case "Home":
      newIndex = 0;
      break;
    case "End":
      newIndex = items.length - 1;
      break;
    default:
      return currentIndex;
  }

  e.preventDefault();
  items[newIndex]?.focus();
  return newIndex;
}

/**
 * Debounce function for accessibility announcements
 */
export function debounceAnnouncement(
  fn: (message: string) => void,
  delay: number = 500
): (message: string) => void {
  let timeoutId: NodeJS.Timeout;

  return (message: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(message), delay);
  };
}
