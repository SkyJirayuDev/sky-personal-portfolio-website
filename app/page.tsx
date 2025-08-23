import { AppLayout } from "@/components/layout/app-layout";
import {
  Hero,
  SkillsMatrix,
  ProjectShowcase,
  ExperienceTimeline,
  Certifications,
  ContactSection,
} from "@/components/sections";
import {
  loadProfile,
  loadSkills,
  loadProjects,
  loadExperience,
  loadCertifications,
} from "@/lib/content/loaders";

export default function Home() {
  const profile = loadProfile();
  const skillGroups = loadSkills();
  const projects = loadProjects();
  const experiences = loadExperience();
  const certifications = loadCertifications();

  return (
    <AppLayout
      metadata={{
        title: "Jirayu Saisuwan - Full-Stack Software & Web Platform Engineer",
        description:
          "Full-Stack Software & Web Platform Engineer specializing in Cloud & AI",
        author: "Jirayu Saisuwan",
      }}
    >
      {/* Hero Section */}
      <Hero profile={profile} />

      {/* Skills Section */}
      <SkillsMatrix skillGroups={skillGroups} className="bg-muted/20" />

      {/* Experience Section */}
      <ExperienceTimeline experiences={experiences} />

      {/* Certifications Section */}
      <Certifications certifications={certifications} className="bg-muted/20" />

      {/* Projects Section */}
      <ProjectShowcase projects={projects} />

      {/* Contact Section */}
      <ContactSection />
    </AppLayout>
  );
}
