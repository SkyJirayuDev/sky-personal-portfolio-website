"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/schemas/content";

interface ProjectFiltersProps {
  projects: Project[];
  onFilterChange: (filteredProjects: Project[]) => void;
  className?: string;
}

export function ProjectFilters({
  projects,
  onFilterChange,
  className,
}: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique technologies and categories
  const { allTechs, allCategories } = useMemo(() => {
    const techSet = new Set<string>();
    const categorySet = new Set<string>();

    projects.forEach(project => {
      project.tech.forEach(tech => techSet.add(tech));
      if (project.category) {
        categorySet.add(project.category);
      }
    });

    return {
      allTechs: Array.from(techSet).sort(),
      allCategories: Array.from(categorySet).sort(),
    };
  }, [projects]);

  // Filter projects based on search and selected filters
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(query) ||
          project.summary.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.tech.some(tech => tech.toLowerCase().includes(query)) ||
          project.role.toLowerCase().includes(query) ||
          project.category?.toLowerCase().includes(query)
      );
    }

    // Technology filter
    if (selectedTechs.length > 0) {
      filtered = filtered.filter(project =>
        selectedTechs.some(tech => project.tech.includes(tech))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        project =>
          project.category && selectedCategories.includes(project.category)
      );
    }

    return filtered;
  }, [projects, searchQuery, selectedTechs, selectedCategories]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filteredProjects);
  }, [filteredProjects, onFilterChange]);

  const handleTechToggle = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedTechs([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters =
    searchQuery.trim() ||
    selectedTechs.length > 0 ||
    selectedCategories.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter toggle and clear */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2",
              showFilters && "bg-primary/10 border-primary/20"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {selectedTechs.length +
                  selectedCategories.length +
                  (searchQuery ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredProjects.length} of {projects.length} projects
          {hasActiveFilters && " (filtered)"}
        </span>
      </div>

      {/* Expandable filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border border-border rounded-lg p-4 bg-card space-y-4">
              {/* Technology filters */}
              {allTechs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTechs.map(tech => (
                      <motion.button
                        key={tech}
                        onClick={() => handleTechToggle(tech)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full border transition-all duration-200",
                          selectedTechs.includes(tech)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tech}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category filters */}
              {allCategories.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map(category => (
                      <motion.button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full border transition-all duration-200",
                          selectedCategories.includes(category)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
