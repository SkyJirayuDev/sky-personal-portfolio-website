import type { Project } from "@/lib/schemas/content";

export interface CaseStudyFrontmatter {
  title: string;
  project: string;
  problem: string;
  approach: string;
  impact: string;
  date: string;
  featured?: boolean;
}

export interface CaseStudy {
  slug: string;
  frontmatter: CaseStudyFrontmatter;
  content: string;
  project?: Project | undefined;
}

export interface MDXContent {
  frontmatter: Record<string, any>;
  content: string;
  slug: string;
}
