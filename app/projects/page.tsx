import { Metadata } from "next";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { loadProjects } from "@/lib/content/loaders";

export const metadata: Metadata = {
  title: "Projects | Portfolio",
  description:
    "Explore my featured projects and case studies showcasing full-stack development, cloud architecture, and AI integration.",
};

export default async function ProjectsPage() {
  const projects = loadProjects();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Featured Projects
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore my work in full-stack development, cloud architecture, and
              AI integration
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <ProjectsGrid projects={projects} showFilters={true} />
        </div>
      </section>
    </div>
  );
}
