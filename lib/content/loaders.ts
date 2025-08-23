import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import {
  ProfileSchema,
  SkillGroupsSchema,
  ProjectsSchema,
  ExperiencesSchema,
  CertificationsSchema,
  type ProfileData,
  type SkillGroup,
  type Project,
  type Experience,
  type Certification,
} from "@/lib/schemas/content";
import { validateWithDetails } from "./validation";
import type { CaseStudy, CaseStudyFrontmatter } from "./types";

const CONTENT_DIR = join(process.cwd(), "content");

/**
 * Load and validate profile data
 */
export function loadProfile(): ProfileData {
  try {
    const filePath = join(CONTENT_DIR, "profile.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);

    const validation = validateWithDetails(rawData, ProfileSchema);

    if (!validation.success) {
      throw new Error(
        `Invalid profile data: ${validation.errors.map(e => e.message).join(", ")}`
      );
    }

    return validation.data!;
  } catch (error) {
    console.error("Error loading profile data:", error);
    throw error;
  }
}

/**
 * Load profile data with error handling for client-side usage
 */
export async function loadProfileSafe(): Promise<ProfileData | null> {
  try {
    return loadProfile();
  } catch (error) {
    console.error("Failed to load profile:", error);
    return null;
  }
}

/**
 * Load and validate skills data
 */
export function loadSkills(): SkillGroup[] {
  try {
    const filePath = join(CONTENT_DIR, "skills.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);

    const validation = validateWithDetails(rawData, SkillGroupsSchema);

    if (!validation.success) {
      throw new Error(
        `Invalid skills data: ${validation.errors.map(e => e.message).join(", ")}`
      );
    }

    // Sort skill groups by order
    return validation.data!.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error loading skills data:", error);
    throw error;
  }
}

/**
 * Load skills data with error handling for client-side usage
 */
export async function loadSkillsSafe(): Promise<SkillGroup[] | null> {
  try {
    return loadSkills();
  } catch (error) {
    console.error("Failed to load skills:", error);
    return null;
  }
}

/**
 * Load and validate all projects data
 */
export function loadProjects(): Project[] {
  try {
    const projectsDir = join(CONTENT_DIR, "projects");
    const projectFiles = readdirSync(projectsDir).filter(file =>
      file.endsWith(".json")
    );

    const projects: Project[] = [];

    for (const file of projectFiles) {
      const filePath = join(projectsDir, file);
      const fileContent = readFileSync(filePath, "utf-8");
      const rawData = JSON.parse(fileContent);

      const validation = validateWithDetails(rawData, ProjectsSchema.element);

      if (!validation.success) {
        console.error(`Invalid project data in ${file}:`, validation.errors);
        continue; // Skip invalid projects but don't fail entirely
      }

      projects.push(validation.data!);
    }

    // Sort projects: featured first, then by start date (newest first)
    return projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;

      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error loading projects data:", error);
    throw error;
  }
}

/**
 * Load projects data with error handling for client-side usage
 */
export async function loadProjectsSafe(): Promise<Project[] | null> {
  try {
    return loadProjects();
  } catch (error) {
    console.error("Failed to load projects:", error);
    return null;
  }
}

/**
 * Load a single project by slug
 */
export function loadProject(slug: string): Project | null {
  try {
    const filePath = join(CONTENT_DIR, "projects", `${slug}.json`);
    const fileContent = readFileSync(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);

    const validation = validateWithDetails(rawData, ProjectsSchema.element);

    if (!validation.success) {
      console.error(`Invalid project data for ${slug}:`, validation.errors);
      return null;
    }

    return validation.data!;
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}
/**
 * Load all case study slugs for static generation
 */
export async function getAllCaseStudySlugs(): Promise<string[]> {
  try {
    const caseStudiesDir = join(CONTENT_DIR, "case-studies");

    if (!existsSync(caseStudiesDir)) {
      return [];
    }

    const files = readdirSync(caseStudiesDir).filter(file =>
      file.endsWith(".mdx")
    );

    return files.map(file => file.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error loading case study slugs:", error);
    return [];
  }
}

/**
 * Load a case study by slug
 */
export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudy | null> {
  try {
    const caseStudyPath = join(CONTENT_DIR, "case-studies", `${slug}.mdx`);

    if (!existsSync(caseStudyPath)) {
      return null;
    }

    const fileContent = readFileSync(caseStudyPath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    // Validate frontmatter
    const requiredFields = [
      "title",
      "project",
      "problem",
      "approach",
      "impact",
      "date",
    ];
    for (const field of requiredFields) {
      if (!frontmatter[field]) {
        console.error(
          `Missing required field '${field}' in case study ${slug}`
        );
        return null;
      }
    }

    // Load associated project data
    const project = loadProject(frontmatter.project);

    return {
      slug,
      frontmatter: frontmatter as CaseStudyFrontmatter,
      content,
      project: project || undefined,
    };
  } catch (error) {
    console.error(`Error loading case study ${slug}:`, error);
    return null;
  }
}

/**
 * Load all case studies
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    const slugs = await getAllCaseStudySlugs();
    const caseStudies: CaseStudy[] = [];

    for (const slug of slugs) {
      const caseStudy = await getCaseStudyBySlug(slug);
      if (caseStudy) {
        caseStudies.push(caseStudy);
      }
    }

    // Sort by date (newest first)
    return caseStudies.sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
  } catch (error) {
    console.error("Error loading all case studies:", error);
    return [];
  }
}

/**
 * Get featured case studies
 */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  try {
    const allCaseStudies = await getAllCaseStudies();
    return allCaseStudies.filter(cs => cs.frontmatter.featured);
  } catch (error) {
    console.error("Error loading featured case studies:", error);
    return [];
  }
}

/**
 * Load and validate experience data
 */
export function loadExperience(): Experience[] {
  try {
    const filePath = join(CONTENT_DIR, "experience.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);

    const validation = validateWithDetails(rawData, ExperiencesSchema);

    if (!validation.success) {
      throw new Error(
        `Invalid experience data: ${validation.errors.map(e => e.message).join(", ")}`
      );
    }

    // Sort by start date (newest first)
    return validation.data!.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error loading experience data:", error);
    throw error;
  }
}

/**
 * Load experience data with error handling for client-side usage
 */
export async function loadExperienceSafe(): Promise<Experience[] | null> {
  try {
    return loadExperience();
  } catch (error) {
    console.error("Failed to load experience:", error);
    return null;
  }
}

/**
 * Load and validate certifications data
 */
export function loadCertifications(): Certification[] {
  try {
    const filePath = join(CONTENT_DIR, "certifications.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);

    const validation = validateWithDetails(rawData, CertificationsSchema);

    if (!validation.success) {
      throw new Error(
        `Invalid certifications data: ${validation.errors.map(e => e.message).join(", ")}`
      );
    }

    // Sort by date (newest first)
    return validation.data!.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error loading certifications data:", error);
    throw error;
  }
}

/**
 * Load certifications data with error handling for client-side usage
 */
export async function loadCertificationsSafe(): Promise<
  Certification[] | null
> {
  try {
    return loadCertifications();
  } catch (error) {
    console.error("Failed to load certifications:", error);
    return null;
  }
}
