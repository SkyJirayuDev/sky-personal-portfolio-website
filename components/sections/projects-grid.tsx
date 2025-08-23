"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/project-card";
import type { Project } from "@/lib/schemas/content";

interface ProjectsGridProps {
  projects: Project[];
  showFilters?: boolean;
  maxItems?: number;
}

export function ProjectsGrid({
  projects,
  showFilters = false,
  maxItems,
}: ProjectsGridProps) {
  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Limit items if specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [projects, maxItems]);

  return (
    <div className="space-y-8">
      {/* Results count */}
      {showFilters && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      {/* No results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
