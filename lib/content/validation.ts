import { z } from "zod";

// =============================================================================
// Validation Result Types
// =============================================================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ContentValidationReport {
  valid: boolean;
  files: FileValidationResult[];
  summary: {
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    totalErrors: number;
  };
}

export interface FileValidationResult {
  filePath: string;
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// =============================================================================
// Validation Utilities
// =============================================================================

/**
 * Convert Zod errors to ValidationError format
 */
export function convertZodErrors(zodError: z.ZodError): ValidationError[] {
  return zodError.issues.map(error => ({
    field: error.path.length > 0 ? error.path.join(".") : "root",
    message: error.message,
    code: error.code,
    value:
      error.path.length > 0
        ? getNestedValue((zodError as any).input, error.path)
        : (zodError as any).input,
  }));
}

/**
 * Get nested value from object using path array
 */
function getNestedValue(obj: any, path: (string | number | symbol)[]): any {
  return path.reduce((current, key) => {
    return current && typeof current === "object" ? current[key] : undefined;
  }, obj);
}

/**
 * Validate data with detailed error reporting
 */
export function validateWithDetails<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: [],
    };
  }

  return {
    success: false,
    errors: convertZodErrors(result.error),
  };
}

/**
 * Validate content with warnings for optional fields
 */
export function validateContentWithWarnings<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  warningFields: string[] = []
): ValidationResult<T> & { warnings: ValidationError[] } {
  const result = validateWithDetails(data, schema);
  const warnings: ValidationError[] = [];

  // Check for missing optional fields that should have warnings
  if (result.success && data && typeof data === "object") {
    for (const field of warningFields) {
      const value = getNestedValue(data, field.split("."));
      if (value === undefined || value === null || value === "") {
        warnings.push({
          field,
          message: `Optional field '${field}' is empty but recommended`,
          code: "missing_recommended",
          value,
        });
      }
    }
  }

  return {
    ...result,
    warnings,
  };
}

/**
 * Batch validate multiple items
 */
export function batchValidate<T>(
  items: Array<{ data: unknown; context?: string }>,
  schema: z.ZodSchema<T>
): Array<ValidationResult<T> & { context?: string | undefined }> {
  return items.map(({ data, context }) => {
    const result = validateWithDetails(data, schema);
    return {
      ...result,
      context: context,
    };
  });
}

/**
 * Create validation report for content files
 */
export function createValidationReport(
  fileResults: FileValidationResult[]
): ContentValidationReport {
  const totalFiles = fileResults.length;
  const validFiles = fileResults.filter(result => result.valid).length;
  const invalidFiles = totalFiles - validFiles;
  const totalErrors = fileResults.reduce(
    (sum, result) => sum + result.errors.length,
    0
  );

  return {
    valid: invalidFiles === 0,
    files: fileResults,
    summary: {
      totalFiles,
      validFiles,
      invalidFiles,
      totalErrors,
    },
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors.map(error => {
    let message = `${error.field}: ${error.message}`;
    if (error.value !== undefined) {
      message += ` (received: ${JSON.stringify(error.value)})`;
    }
    return message;
  });
}

/**
 * Format validation report for console output
 */
export function formatValidationReport(
  report: ContentValidationReport
): string {
  const lines: string[] = [];

  lines.push("Content Validation Report");
  lines.push("========================");
  lines.push("");

  lines.push(`Total files: ${report.summary.totalFiles}`);
  lines.push(`Valid files: ${report.summary.validFiles}`);
  lines.push(`Invalid files: ${report.summary.invalidFiles}`);
  lines.push(`Total errors: ${report.summary.totalErrors}`);
  lines.push("");

  if (report.summary.invalidFiles > 0) {
    lines.push("Validation Errors:");
    lines.push("------------------");

    for (const fileResult of report.files) {
      if (!fileResult.valid) {
        lines.push(`\n${fileResult.filePath}:`);
        for (const error of fileResult.errors) {
          lines.push(`  ❌ ${error.field}: ${error.message}`);
        }
      }

      if (fileResult.warnings.length > 0) {
        lines.push(`\n${fileResult.filePath} (warnings):`);
        for (const warning of fileResult.warnings) {
          lines.push(`  ⚠️  ${warning.field}: ${warning.message}`);
        }
      }
    }
  } else {
    lines.push("✅ All content files are valid!");
  }

  return lines.join("\n");
}

// =============================================================================
// Content-Specific Validation Helpers
// =============================================================================

/**
 * Validate project slug format
 */
export function validateProjectSlug(slug: string): ValidationResult<string> {
  const slugRegex = /^[a-z0-9-]+$/;

  if (!slugRegex.test(slug)) {
    return {
      success: false,
      errors: [
        {
          field: "slug",
          message:
            "Slug must contain only lowercase letters, numbers, and hyphens",
          code: "invalid_format",
          value: slug,
        },
      ],
    };
  }

  if (slug.startsWith("-") || slug.endsWith("-")) {
    return {
      success: false,
      errors: [
        {
          field: "slug",
          message: "Slug cannot start or end with a hyphen",
          code: "invalid_format",
          value: slug,
        },
      ],
    };
  }

  if (slug.includes("--")) {
    return {
      success: false,
      errors: [
        {
          field: "slug",
          message: "Slug cannot contain consecutive hyphens",
          code: "invalid_format",
          value: slug,
        },
      ],
    };
  }

  return {
    success: true,
    data: slug,
    errors: [],
  };
}

/**
 * Validate URL format
 */
export function validateUrl(
  url: string,
  fieldName: string = "url"
): ValidationResult<string> {
  try {
    new URL(url);
    return {
      success: true,
      data: url,
      errors: [],
    };
  } catch {
    return {
      success: false,
      errors: [
        {
          field: fieldName,
          message: "Invalid URL format",
          code: "invalid_url",
          value: url,
        },
      ],
    };
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      success: false,
      errors: [
        {
          field: "email",
          message: "Invalid email format",
          code: "invalid_email",
          value: email,
        },
      ],
    };
  }

  return {
    success: true,
    data: email,
    errors: [],
  };
}

/**
 * Validate date format (ISO 8601)
 */
export function validateDate(
  date: string,
  fieldName: string = "date"
): ValidationResult<string> {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return {
      success: false,
      errors: [
        {
          field: fieldName,
          message: "Invalid date format (expected ISO 8601)",
          code: "invalid_date",
          value: date,
        },
      ],
    };
  }

  return {
    success: true,
    data: date,
    errors: [],
  };
}
