"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface NavigationSection {
  id: string;
  label: string;
  href: string;
  order: number;
}

interface NavigationProps {
  sections?: NavigationSection[];
  className?: string;
}

const defaultSections: NavigationSection[] = [
  { id: "about", label: "About", href: "#about", order: 1 },
  { id: "skills", label: "Skills", href: "#skills", order: 2 },
  { id: "experience", label: "Experience", href: "#experience", order: 3 },
  { id: "certifications", label: "Certifications", href: "#certifications", order: 4 },
  { id: "projects", label: "Projects", href: "#projects", order: 5 },
  { id: "contact", label: "Contact", href: "#contact", order: 6 },
];

export function Navigation({
  sections = defaultSections,
  className,
}: NavigationProps) {
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Scrollspy functionality
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better UX
      setIsScrolled(window.scrollY > 50);

      // Find the current section
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section?.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Close mobile menu when clicking outside or on link
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-mobile-menu]")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    if (href.startsWith("#")) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Focus the target element for screen readers
        if (element instanceof HTMLElement) {
          element.focus();
        }
        // Update URL without triggering navigation
        window.history.replaceState(null, "", href);
      }
    }
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"
            : "bg-transparent",
          className
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <nav
          className="container mx-auto px-4 sm:px-6 lg:px-8"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                aria-label="Go to homepage"
              >
                JS
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {sections.map(section => (
                  <motion.div key={section.id} className="relative">
                    <button
                      onClick={() => handleNavClick(section.href)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        activeSection === section.id
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                      aria-current={
                        activeSection === section.id ? "page" : undefined
                      }
                    >
                      {section.label}
                    </button>
                    {activeSection === section.id && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        layoutId="activeSection"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Theme Toggle and Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />

              {/* Mobile menu button */}
              <div className="md:hidden" data-mobile-menu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="h-9 w-9 rounded-md border border-border/40 bg-background/50 backdrop-blur-sm hover:bg-accent/50"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              className="fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-lg md:hidden"
              data-mobile-menu
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-6 space-y-1">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => handleNavClick(section.href)}
                    className={cn(
                      "block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      activeSection === section.id
                        ? "text-primary bg-primary/10 border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    aria-current={
                      activeSection === section.id ? "page" : undefined
                    }
                  >
                    {section.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
