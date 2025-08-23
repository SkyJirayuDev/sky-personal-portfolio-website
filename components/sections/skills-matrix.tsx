"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SkillGroup, Skill } from "@/lib/schemas/content";

interface SkillsMatrixProps {
  skillGroups: SkillGroup[];
  className?: string;
}

export function SkillsMatrix({ skillGroups, className }: SkillsMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Default to "grid"
  const [displayMode, setDisplayMode] = useState<"bars" | "grid">("grid");

  // Toggle visibility controlled by env (hidden by default)
  const showDisplayToggle =
    process.env.NEXT_PUBLIC_SHOW_SKILL_TOGGLE === "true";

  // Get all unique categories for filtering
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    skillGroups.forEach(group => {
      group.items.forEach(skill => {
        categories.add(skill.category);
      });
    });
    return Array.from(categories).sort();
  }, [skillGroups]);

  // Filter skills based on search and category filters
  const filteredSkillGroups = useMemo(() => {
    return skillGroups
      .map(group => ({
        ...group,
        items: group.items.filter(skill => {
          const q = searchQuery.toLowerCase();
          const matchesSearch =
            skill.name.toLowerCase().includes(q) ||
            skill.description?.toLowerCase().includes(q);

          const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(skill.category);

          return matchesSearch && matchesCategory;
        }),
      }))
      .filter(group => group.items.length > 0);
  }, [skillGroups, searchQuery, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0;

  return (
    <section
      id="skills"
      className={cn("py-16 md:py-24", className)}
      aria-labelledby="skills-heading"
    >
      <div className="container mx-auto px-6 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 px-4"
        >
          <h2
            id="skills-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Technical Skills
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise across different
            domains, with proficiency levels and years of experience.
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Search skills"
                role="searchbox"
              />
            </div>

            {/* Display Mode Toggle - hidden unless env flag is true */}
            {showDisplayToggle && (
              <div
                className="flex items-center gap-2"
                role="group"
                aria-label="Display mode selection"
              >
                <Button
                  variant={displayMode === "bars" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDisplayMode("bars")}
                  aria-pressed={displayMode === "bars"}
                  aria-label="Display skills as bars"
                >
                  Bars
                </Button>
                <Button
                  variant={displayMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDisplayMode("grid")}
                  aria-pressed={displayMode === "grid"}
                  aria-label="Display skills as grid"
                >
                  Grid
                </Button>
              </div>
            )}
          </div>

          {/* Category Filters */}
          <div
            className="flex flex-wrap gap-2 mt-4"
            role="group"
            aria-label="Category filters"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>Filter by category:</span>
            </div>
            {allCategories.map(category => (
              <Badge
                key={category}
                variant={
                  selectedCategories.includes(category) ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => toggleCategory(category)}
                role="button"
                tabIndex={0}
                aria-pressed={selectedCategories.includes(category)}
                aria-label={`${
                  selectedCategories.includes(category) ? "Remove" : "Add"
                } ${category} filter`}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCategory(category);
                  }
                }}
              >
                {category}
              </Badge>
            ))}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* Skills Grid or Bars (Bars only when toggle is visible and selected) */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {filteredSkillGroups.length > 0 ? (
              filteredSkillGroups.map((group, groupIndex) => (
                <SkillGroupSection
                  key={group.group}
                  group={group}
                  displayMode={displayMode}
                  showBars={showDisplayToggle}
                  index={groupIndex}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-lg">
                  No skills found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

interface SkillGroupSectionProps {
  group: SkillGroup;
  displayMode: "bars" | "grid";
  showBars: boolean; // guard for bars rendering
  index: number;
}

function SkillGroupSection({
  group,
  displayMode,
  showBars,
  index,
}: SkillGroupSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="space-y-6"
    >
      {/* Group Header */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          {group.group}
        </h3>
        <div
          className="w-16 h-1 bg-primary mx-auto rounded-full"
          aria-hidden="true"
        />
      </div>

      {/* Skills Display */}
      {displayMode === "bars" && showBars ? (
        <SkillBarsView skills={group.items} />
      ) : (
        <SkillGridView skills={group.items} />
      )}
    </motion.div>
  );
}

/* ----------------- Bars View (kept, hidden by default) ----------------- */

interface SkillBarsViewProps {
  skills: Skill[];
}

function SkillBarsView({ skills }: SkillBarsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((skill, index) => (
        <SkillBarItem key={skill.name} skill={skill} index={index} />
      ))}
    </div>
  );
}

interface SkillBarItemProps {
  skill: Skill;
  index: number;
}

function SkillBarItem({ skill, index }: SkillBarItemProps) {
  const proficiency = skill.proficiency || 5;
  const proficiencyPercentage = (proficiency / 10) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {skill.name}
        </h4>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {skill.years && <span>{skill.years}y</span>}
          <span className="font-medium">{proficiency}/10</span>
        </div>
      </div>

      {/* Proficiency Bar */}
      <div
        className="relative h-2 bg-muted rounded-full overflow-hidden mb-2"
        role="progressbar"
        aria-valuenow={proficiency}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={`${skill.name} proficiency: ${proficiency} out of 10`}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiencyPercentage}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: index * 0.05 + 0.3,
            ease: "easeOut",
          }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
        />
      </div>

      {/* Description */}
      {skill.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {skill.description}
        </p>
      )}
    </motion.div>
  );
}

/* ----------------- Grid View (default) ----------------- */

interface SkillGridViewProps {
  skills: Skill[];
}

function SkillGridView({ skills }: SkillGridViewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {skills.map((skill, index) => (
        <SkillGridItem key={skill.name} skill={skill} index={index} />
      ))}
    </div>
  );
}

interface SkillGridItemProps {
  skill: Skill;
  index: number;
}

function SkillGridItem({ skill, index }: SkillGridItemProps) {
  // const proficiency = skill.proficiency || 5;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="group relative p-4 rounded-lg border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer text-center"
    >
      {/* Proficiency Indicator */}
      {/* <div className="absolute top-2 right-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                i < Math.ceil(proficiency / 2) ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div> */}

      {/* Skill Name */}
      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
        {skill.name}
      </h4>

      {/* Years Experience */}
      {/* {skill.years && (
        <div className="text-xs text-muted-foreground">
          {skill.years} year{skill.years !== 1 ? "s" : ""}
        </div>
      )} */}

      {/* Hover Tooltip */}
      {skill.description && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64">
          <p className="text-center">{skill.description}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </motion.div>
  );
}
