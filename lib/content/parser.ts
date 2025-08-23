import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import {
  ProfileSchema,
  ProjectSchema,
  CertificationsSchema,
  SkillGroupsSchema,
  ExperiencesSchema,
  type ProfileData,
  type Project,
  type Certification,
  type SkillGroup,
  type Experience,
} from "../schemas/content";

// =============================================================================
// Error Types
// =============================================================================

export class ContentParseError extends Error {
  constructor(
    message: string,
    public filePath: string,
    public validationErrors?: z.ZodError
  ) {
    super(message);
    this.name = "ContentParseError";
  }
}

export class ContentNotFoundError extends Error {
  constructor(filePath: string) {
    super(`Content file not found: ${filePath}`);
    this.name = "ContentNotFoundError";
  }
}

// =============================================================================
// Content Parsing Utilities
// =============================================================================

/**
 * Safely parse JSON content with validation
 */
async function parseJsonFile<T>(
  filePath: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = await fs.readFile(fullPath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    const result = schema.safeParse(jsonData);
    if (!result.success) {
      throw new ContentParseError(
        `Validation failed for ${filePath}`,
        filePath,
        result.error
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ContentParseError(
        `Invalid JSON syntax in ${filePath}: ${error.message}`,
        filePath
      );
    }
    if (error instanceof ContentParseError) {
      throw error;
    }
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new ContentNotFoundError(filePath);
    }
    throw new ContentParseError(
      `Failed to parse ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
      filePath
    );
  }
}

/**
 * Check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all files in a directory with a specific extension
 */
async function getFilesInDirectory(
  dirPath: string,
  extension: string
): Promise<string[]> {
  try {
    const fullPath = path.join(process.cwd(), dirPath);
    const files = await fs.readdir(fullPath);
    return files
      .filter(file => file.endsWith(extension))
      .map(file => path.join(dirPath, file));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

// =============================================================================
// Content Loaders
// =============================================================================

/**
 * Load and validate profile data
 */
export async function loadProfile(): Promise<ProfileData> {
  return parseJsonFile("content/profile.json", ProfileSchema);
}

/**
 * Load and validate a single project
 */
export async function loadProject(slug: string): Promise<Project | null> {
  const filePath = `content/projects/${slug}.json`;

  if (!(await fileExists(filePath))) {
    return null;
  }

  return parseJsonFile(filePath, ProjectSchema);
}

/**
 * Load and validate all projects
 */
export async function loadProjects(): Promise<Project[]> {
  const projectFiles = await getFilesInDirectory("content/projects", ".json");
  const projects: Project[] = [];

  for (const filePath of projectFiles) {
    try {
      const project = await parseJsonFile(filePath, ProjectSchema);
      projects.push(project);
    } catch (error) {
      console.warn(`Failed to load project from ${filePath}:`, error);
      // Continue loading other projects even if one fails
    }
  }

  // Sort projects by featured status and name
  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Load and validate certifications
 */
export async function loadCertifications(): Promise<Certification[]> {
  const filePath = "content/certifications.json";

  if (!(await fileExists(filePath))) {
    return [];
  }

  return parseJsonFile(filePath, CertificationsSchema);
}

/**
 * Load and validate skill groups
 */
export async function loadSkillGroups(): Promise<SkillGroup[]> {
  const filePath = "content/skills.json";

  if (!(await fileExists(filePath))) {
    return [];
  }

  const skillGroups = await parseJsonFile(filePath, SkillGroupsSchema);

  // Sort skill groups by order if specified, otherwise by group name
  return skillGroups.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.group.localeCompare(b.group);
  });
}

/**
 * Load and validate experience data
 */
export async function loadExperiences(): Promise<Experience[]> {
  const filePath = "content/experience.json";

  if (!(await fileExists(filePath))) {
    return [];
  }

  const experiences = await parseJsonFile(filePath, ExperiencesSchema);

  // Sort experiences by start date (most recent first)
  return experiences.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });
}

// =============================================================================
// Content Validation Utilities
// =============================================================================

/**
 * Validate content data against schema
 */
export function validateContent<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  context?: string
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = context
      ? `Validation failed for ${context}`
      : "Content validation failed";

    throw new ContentParseError(
      errorMessage,
      context || "unknown",
      result.error
    );
  }

  return result.data;
}

/**
 * Get formatted validation errors
 */
export function getValidationErrors(error: z.ZodError): string[] {
  return error.issues.map(err => {
    const path = err.path.length > 0 ? err.path.join(".") : "root";
    return `${path}: ${err.message}`;
  });
}

/**
 * Validate all content files
 */
export async function validateAllContent(): Promise<{
  valid: boolean;
  errors: Array<{ file: string; errors: string[] }>;
}> {
  const validationResults: Array<{ file: string; errors: string[] }> = [];

  // Validate profile
  try {
    await loadProfile();
  } catch (error) {
    if (error instanceof ContentParseError && error.validationErrors) {
      validationResults.push({
        file: error.filePath,
        errors: getValidationErrors(error.validationErrors),
      });
    }
  }

  // Validate projects
  try {
    await loadProjects();
  } catch (error) {
    if (error instanceof ContentParseError && error.validationErrors) {
      validationResults.push({
        file: error.filePath,
        errors: getValidationErrors(error.validationErrors),
      });
    }
  }

  // Validate certifications
  try {
    await loadCertifications();
  } catch (error) {
    if (error instanceof ContentParseError && error.validationErrors) {
      validationResults.push({
        file: error.filePath,
        errors: getValidationErrors(error.validationErrors),
      });
    }
  }

  // Validate skills
  try {
    await loadSkillGroups();
  } catch (error) {
    if (error instanceof ContentParseError && error.validationErrors) {
      validationResults.push({
        file: error.filePath,
        errors: getValidationErrors(error.validationErrors),
      });
    }
  }

  // Validate experience
  try {
    await loadExperiences();
  } catch (error) {
    if (error instanceof ContentParseError && error.validationErrors) {
      validationResults.push({
        file: error.filePath,
        errors: getValidationErrors(error.validationErrors),
      });
    }
  }

  return {
    valid: validationResults.length === 0,
    errors: validationResults,
  };
}
