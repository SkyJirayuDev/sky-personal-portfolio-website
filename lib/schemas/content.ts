import { z } from "zod";

// =============================================================================
// TypeScript Interfaces
// =============================================================================

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImage?: string;
  links: ProfileLinks;
}

export interface ProfileLinks {
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  [key: string]: string;
}

export interface Project {
  slug: string;
  name: string;
  summary: string;
  description?: string | undefined;
  tech: string[];
  links: ProjectLinks;
  impact: string[];
  role: string;
  featured: boolean;
  images?: ImageAsset[] | undefined;
  metrics?: ProjectMetric[] | undefined;
  category?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export interface ProjectLinks {
  live?: string | undefined;
  repo?: string | undefined;
  case_study?: string | undefined;
}

export interface ProjectMetric {
  label: string;
  value: string;
  description?: string | undefined;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number | undefined;
  height?: number | undefined;
  caption?: string | undefined;
}

export interface Certification {
  name: string;
  issuer: string;
  url: string;
  date?: string | undefined;
  credential_id?: string | undefined;
  skills?: string[] | undefined;
  description?: string | undefined;
}

export interface Skill {
  name: string;
  proficiency?: number | undefined;
  category: string;
  description?: string | undefined;
  years?: number | undefined;
}

export interface SkillGroup {
  group: string;
  items: Skill[];
  order?: number | undefined;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string | undefined;
  location: string;
  description: string;
  achievements: string[];
  tech: string[];
}

// =============================================================================
// Zod Validation Schemas
// =============================================================================

export const ProfileLinksSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    github: z.string().url("Invalid GitHub URL"),
    linkedin: z.string().url("Invalid LinkedIn URL"),
    resume: z.string().min(1, "Resume path is required"),
  })
  .catchall(z.string().url("Invalid URL format"));

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  links: ProfileLinksSchema,
});

export const ProjectLinksSchema = z.object({
  live: z.string().url("Invalid live URL").optional(),
  repo: z.string().url("Invalid repository URL").optional(),
  case_study: z.string().min(1, "Case study URL is required").optional(),
});

export const ProjectMetricSchema = z.object({
  label: z.string().min(1, "Metric label is required"),
  value: z.string().min(1, "Metric value is required"),
  description: z.string().optional(),
});

export const ImageAssetSchema = z.object({
  src: z.string().min(1, "Image source is required"),
  alt: z.string().min(1, "Image alt text is required"),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  caption: z.string().optional(),
});

export const ProjectSchema = z.object({
  slug: z
    .string()
    .min(1, "Project slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  name: z.string().min(1, "Project name is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  description: z.string().optional(),
  tech: z
    .array(z.string().min(1))
    .min(1, "At least one technology is required"),
  links: ProjectLinksSchema,
  impact: z
    .array(z.string().min(1))
    .min(1, "At least one impact statement is required"),
  role: z.string().min(1, "Role is required"),
  featured: z.boolean().default(false),
  images: z.array(ImageAssetSchema).optional(),
  metrics: z.array(ProjectMetricSchema).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const CertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  url: z.string().url("Invalid certification URL"),
  date: z.string().optional(),
  credential_id: z.string().optional(),
  skills: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiency: z
    .number()
    .min(1)
    .max(10, "Proficiency must be between 1 and 10")
    .optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  years: z.number().min(0).optional(),
});

export const SkillGroupSchema = z.object({
  group: z.string().min(1, "Group name is required"),
  items: z.array(SkillSchema).min(1, "At least one skill is required"),
  order: z.number().optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  achievements: z
    .array(z.string().min(1))
    .min(1, "At least one achievement is required"),
  tech: z.array(z.string().min(1)).optional().default([]),
});

// Collection schemas for arrays of content
export const ProjectsSchema = z.array(ProjectSchema);
export const CertificationsSchema = z.array(CertificationSchema);
export const SkillGroupsSchema = z.array(SkillGroupSchema);
export const ExperiencesSchema = z.array(ExperienceSchema);
