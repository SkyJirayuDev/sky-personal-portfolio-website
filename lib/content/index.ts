// Export all content-related utilities and types
export * from "./parser";
export * from "./mdx";
export * from "./validation";

// Re-export schemas and types for convenience
export * from "../schemas/content";

// Content loading functions
export {
  loadProfile,
  loadProject,
  loadProjects,
  loadCertifications,
  loadSkillGroups,
  loadExperiences,
  validateAllContent,
} from "./parser";

// MDX content functions
export {
  loadBlogPost,
  loadBlogPosts,
  loadCaseStudy,
  loadCaseStudies,
  loadCaseStudiesForProject,
} from "./mdx";

// Validation utilities
export {
  validateWithDetails,
  validateContentWithWarnings,
  batchValidate,
  createValidationReport,
  formatValidationErrors,
  formatValidationReport,
  validateProjectSlug,
  validateUrl,
  validateEmail,
  validateDate,
} from "./validation";
