"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "./image-gallery";
import { MetricsDisplay } from "./metrics-display";
import { MermaidDiagram } from "./mermaid-diagram";
import { CaseStudyNavigation } from "./case-study-navigation";
import type { CaseStudy } from "@/lib/content/types";

interface CaseStudyTemplateProps {
  caseStudy: CaseStudy;
}

export function CaseStudyTemplate({ caseStudy }: CaseStudyTemplateProps) {
  const { frontmatter, content, project } = caseStudy;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/#projects">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>

            {project && (
              <div className="flex items-center gap-2">
                {project.links.live && (
                  <Link
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Button>
                  </Link>
                )}
                {project.links.repo && (
                  <Link
                    href={project.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Github className="h-4 w-4" />
                      Source Code
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {frontmatter.title}
            </h1>

            <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold text-destructive mb-2">Problem</h3>
                <p className="text-sm text-muted-foreground">
                  {frontmatter.problem}
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold text-blue-600 mb-2">Approach</h3>
                <p className="text-sm text-muted-foreground">
                  {frontmatter.approach}
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold text-green-600 mb-2">Impact</h3>
                <p className="text-sm text-muted-foreground">
                  {frontmatter.impact}
                </p>
              </div>
            </div>

            {project && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {project.tech.map(tech => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      {project?.metrics && project.metrics.length > 0 && (
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MetricsDisplay metrics={project.metrics} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Image Gallery */}
      {project?.images && project.images.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ImageGallery images={project.images} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MermaidDiagram content={content} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <CaseStudyNavigation currentSlug={frontmatter.project} />
    </div>
  );
}
