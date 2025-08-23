"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaseStudyNavigationProps {
  currentSlug: string;
}

interface NavigationProject {
  slug: string;
  name: string;
  hasCaseStudy: boolean;
}

export function CaseStudyNavigation({ currentSlug }: CaseStudyNavigationProps) {
  const [navigation, setNavigation] = useState<{
    prev: NavigationProject | null;
    next: NavigationProject | null;
  }>({ prev: null, next: null });

  const fetchNavigationData = useCallback(async () => {
    try {
      // This would typically fetch from an API or static data
      // For now, we'll use the project data we have
      const projects: NavigationProject[] = [
        {
          slug: "ai-content-generator",
          name: "AI-Powered Content Generation Platform",
          hasCaseStudy: true,
        },
        {
          slug: "cloud-monitoring-dashboard",
          name: "Cloud Infrastructure Monitoring Dashboard",
          hasCaseStudy: true,
        },
        {
          slug: "ecommerce-platform",
          name: "Enterprise E-commerce Platform",
          hasCaseStudy: true,
        },
      ];

      const currentIndex = projects.findIndex(p => p.slug === currentSlug);

      if (currentIndex !== -1) {
        const prev =
          currentIndex > 0 ? projects[currentIndex - 1] || null : null;
        const next =
          currentIndex < projects.length - 1
            ? projects[currentIndex + 1] || null
            : null;

        setNavigation({ prev, next });
      }
    } catch (error) {
      console.error("Error fetching navigation data:", error);
    }
  }, [currentSlug]);

  useEffect(() => {
    // Fetch navigation data
    fetchNavigationData();
  }, [fetchNavigationData]);

  if (!navigation.prev && !navigation.next) {
    return null;
  }

  return (
    <section className="py-12 border-t bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Case Study */}
            <div className="flex justify-start">
              {navigation.prev && navigation.prev.hasCaseStudy && (
                <Link
                  href={`/case-studies/${navigation.prev.slug}`}
                  className="group"
                >
                  <Button
                    variant="outline"
                    className="h-auto p-6 text-left group-hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Previous Case Study
                        </div>
                        <div className="font-semibold text-sm leading-tight">
                          {navigation.prev.name}
                        </div>
                      </div>
                    </div>
                  </Button>
                </Link>
              )}
            </div>

            {/* Next Case Study */}
            <div className="flex justify-end">
              {navigation.next && navigation.next.hasCaseStudy && (
                <Link
                  href={`/case-studies/${navigation.next.slug}`}
                  className="group"
                >
                  <Button
                    variant="outline"
                    className="h-auto p-6 text-right group-hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Next Case Study
                        </div>
                        <div className="font-semibold text-sm leading-tight">
                          {navigation.next.name}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Back to Projects */}
          <div className="text-center mt-8">
            <Link href="/#projects">
              <Button variant="ghost" className="gap-2">
                View All Projects
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
