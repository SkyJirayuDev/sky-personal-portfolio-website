"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "./badge";
import { Button } from "./button";
import { MagneticButton } from "./magnetic-button";
import { ExternalLink, Github, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-scroll-animation";
import type { Project } from "@/lib/schemas/content";

interface ProjectCardProps {
  project: Project;
  variant?: "featured" | "grid";
  className?: string;
}

export function ProjectCard({
  project,
  variant = "grid",
  className,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateXValue = (e.clientY - centerY) / 10;
    const rotateYValue = (centerX - e.clientX) / 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const isFeatured = variant === "featured" || project.featured;

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/10",
        isFeatured ? "md:col-span-2 lg:col-span-2" : "",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              rotateX: rotateX,
              rotateY: rotateY,
              scale: isHovered ? 1.02 : 1,
            }
      }
      transition={
        prefersReducedMotion
          ? {}
          : {
              type: "spring",
              stiffness: 300,
              damping: 30,
            }
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          background: isHovered
            ? [
                "linear-gradient(135deg, rgba(var(--primary), 0.05), transparent, rgba(var(--primary), 0.1))",
                "linear-gradient(225deg, rgba(var(--primary), 0.1), transparent, rgba(var(--primary), 0.05))",
                "linear-gradient(135deg, rgba(var(--primary), 0.05), transparent, rgba(var(--primary), 0.1))",
              ]
            : "linear-gradient(135deg, transparent, transparent, transparent)",
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className={cn(
          "relative p-6 h-full flex flex-col",
          isFeatured ? "md:p-8" : ""
        )}
      >
        {/* Featured badge */}
        {project.featured && (
          <motion.div
            className="absolute top-4 right-4 z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Badge
              variant="default"
              className="bg-primary/90 text-primary-foreground"
            >
              Featured
            </Badge>
          </motion.div>
        )}

        {/* Project header */}
        <div className="flex-1">
          <motion.h3
            className={cn(
              "font-bold text-foreground mb-2 group-hover:text-primary transition-colors",
              isFeatured ? "text-xl md:text-2xl" : "text-lg"
            )}
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {project.name}
          </motion.h3>

          <motion.p
            className={cn(
              "text-muted-foreground mb-4 leading-relaxed",
              isFeatured ? "text-base" : "text-sm"
            )}
            animate={{ y: isHovered ? -1 : 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {project.summary}
          </motion.p>

          {/* Role and category */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              {project.role}
            </Badge>
            {project.category && (
              <Badge variant="outline" className="text-xs">
                {project.category}
              </Badge>
            )}
          </div>

          {/* Tech stack */}
          <motion.div
            className="flex flex-wrap gap-1.5 mb-6"
            animate={{ y: isHovered ? -1 : 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {project.tech.slice(0, isFeatured ? 8 : 6).map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge
                  variant="outline"
                  className="text-xs hover:bg-primary/10 transition-colors cursor-default"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
            {project.tech.length > (isFeatured ? 8 : 6) && (
              <Badge variant="outline" className="text-xs opacity-60">
                +{project.tech.length - (isFeatured ? 8 : 6)} more
              </Badge>
            )}
          </motion.div>

          {/* Impact metrics (for featured projects) */}
          {isFeatured && project.impact.length > 0 && (
            <motion.div
              className="mb-6"
              animate={{ y: isHovered ? -1 : 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              <h4 className="text-sm font-medium text-foreground mb-2">
                Key Impact:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {project.impact.slice(0, 2).map((impact, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <span className="text-primary mr-2 mt-1">•</span>
                    {impact}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-wrap gap-2 mt-auto"
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          {project.links.live && (
            <MagneticButton
              variant="default"
              size="sm"
              href={project.links.live}
              external
              className="flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </MagneticButton>
          )}

          {project.links.repo && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex items-center gap-1.5 hover:bg-primary/10"
            >
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-3.5 h-3.5" />
                Code
              </a>
            </Button>
          )}

          {project.links.case_study && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex items-center gap-1.5 hover:bg-primary/10"
            >
              <Link href={project.links.case_study}>
                <FileText className="w-3.5 h-3.5" />
                Case Study
              </Link>
            </Button>
          )}
        </motion.div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(var(--primary), 0.1) 50%, transparent 100%)",
          filter: "blur(1px)",
        }}
        animate={{
          opacity: isHovered ? [0, 0.3, 0] : 0,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
