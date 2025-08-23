"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/ui/project-card";
import { ProjectFilters } from "@/components/ui/project-filters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/schemas/content";

interface ProjectShowcaseProps {
  projects: Project[];
  className?: string;
}

export function ProjectShowcase({ projects, className }: ProjectShowcaseProps) {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Get featured and non-featured projects
  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  // Determine how many projects to show
  const projectsToShow = showAll
    ? regularProjects
    : regularProjects.slice(0, 6);
  const hasMoreProjects = regularProjects.length > 6;

  const handleFilterChange = (filtered: Project[]) => {
    setIsLoading(true);

    // Simulate a brief loading state for smooth transitions
    setTimeout(() => {
      setFilteredProjects(filtered);
      setIsLoading(false);
    }, 150);
  };

  return (
    <section
      id="projects"
      className={cn("py-20", className)}
      aria-labelledby="projects-heading"
    >
      <div className="container mx-auto px-6 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2
            id="projects-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work in full-stack development, cloud
            architecture, and AI integration. Each project demonstrates
            real-world problem solving and technical excellence.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="max-w-6xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <ProjectFilters
            projects={projects}
            onFilterChange={handleFilterChange}
          />
        </motion.div>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <motion.div
            className="max-w-6xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
              Featured Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {isLoading
                  ? // Loading skeletons for featured projects
                    Array.from({ length: featuredProjects.length }).map(
                      (_, index) => (
                        <motion.div
                          key={`featured-skeleton-${index}`}
                          className="md:col-span-2 lg:col-span-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Skeleton className="h-80 w-full rounded-xl" />
                        </motion.div>
                      )
                    )
                  : featuredProjects.map((project, index) => (
                      <motion.div
                        key={project.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                      >
                        <ProjectCard project={project} variant="featured" />
                      </motion.div>
                    ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* All Projects Section */}
        {regularProjects.length > 0 && (
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <span className="w-1 h-6 bg-primary/60 rounded-full mr-3"></span>
              All Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {isLoading
                  ? // Loading skeletons for regular projects
                    Array.from({
                      length: Math.min(6, regularProjects.length),
                    }).map((_, index) => (
                      <motion.div
                        key={`regular-skeleton-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Skeleton className="h-64 w-full rounded-xl" />
                      </motion.div>
                    ))
                  : projectsToShow.map((project, index) => (
                      <motion.div
                        key={project.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                      >
                        <ProjectCard project={project} variant="grid" />
                      </motion.div>
                    ))}
              </AnimatePresence>
            </div>

            {/* Show More/Less Button */}
            {hasMoreProjects && !isLoading && (
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-2 hover:bg-primary/10 transition-colors"
                >
                  {showAll
                    ? "Show Less"
                    : `Show ${regularProjects.length - 6} More Projects`}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* No results state */}
        {filteredProjects.length === 0 && !isLoading && (
          <motion.div
            className="max-w-2xl mx-auto text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters to find what
              you&apos;re looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="hover:bg-primary/10"
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
