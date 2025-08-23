"use client";

import * as React from "react";
import { Navigation } from "@/components/layout/navigation";
import { PageTransition } from "@/components/ui/page-transition";

import { SkipLinks } from "@/components/accessibility/skip-links";
import { cn } from "@/lib/utils";

interface SiteMetadata {
  title: string;
  description: string;
  author: string;
  siteUrl?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
  metadata?: SiteMetadata;
  className?: string;
  showNavigation?: boolean;
}

export function AppLayout({
  children,
  metadata,
  className,
  showNavigation = true,
}: AppLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Enhanced Skip Links */}
      <SkipLinks />

      {/* Navigation */}
      {showNavigation && (
        <div id="navigation">
          <Navigation />
        </div>
      )}

      {/* Main content area */}
      <main
        id="main-content"
        className={cn(
          "relative",
          showNavigation && "pt-16" // Account for fixed navigation
        )}
        role="main"
        aria-label="Main content"
        tabIndex={-1} // Make focusable for skip links
      >
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Footer */}
      <footer
        id="footer"
        className="border-t border-border/40 bg-background/50 backdrop-blur-sm"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              {metadata?.author || "Jirayu Saisuwan"}. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Built with Next.js & TypeScript</span>
              <span className="hidden sm:inline" aria-hidden="true">
                •
              </span>
              <span className="hidden sm:inline">Deployed on Netlify</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
