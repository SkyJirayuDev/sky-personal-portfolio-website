"use client";

import { cn } from "@/lib/utils";

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#navigation", label: "Skip to navigation" },
  { href: "#footer", label: "Skip to footer" },
];

export function SkipLinks({ links = defaultLinks, className }: SkipLinksProps) {
  return (
    <div className={cn("skip-links", className)}>
      {links.map(link => (
        <a
          key={link.href}
          href={link.href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={e => {
            e.preventDefault();
            const target = document.querySelector(link.href);
            if (target) {
              target.scrollIntoView({ behavior: "smooth" });
              // Focus the target element if it's focusable
              if (target instanceof HTMLElement) {
                target.focus();
              }
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
