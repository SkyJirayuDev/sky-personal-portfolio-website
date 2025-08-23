import { describe, it, expect } from 'vitest';
import {
  validateWithDetails,
  validateContentWithWarnings,
  batchValidate,
  validateProjectSlug,
  validateUrl,
  validateEmail,
  validateDate,
  convertZodErrors,
  formatValidationErrors,
  createValidationReport,
} from '@/lib/content/validation';
import { ProjectSchema, ProfileSchema, CertificationSchema, SkillSchema } from '@/lib/schemas/content';

describe('Content Validation', () => {
  describe('validateWithDetails', () => {
    it('should validate valid project data', () => {
      const validProject = {
        slug: 'test-project',
        name: 'Test Project',
        summary: 'A test project for validation',
        tech: ['React', 'TypeScript'],
        links: {
          live: 'https://example.com',
          repo: 'https://github.com/user/repo',
        },
        impact: ['Improved performance by 50%'],
        role: 'Full-Stack Developer',
        featured: true,
      };

      const result = validateWithDetails(validProject, ProjectSchema);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validProject);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid project data', () => {
      const invalidProject = {
        slug: '', // Invalid: empty slug
        name: 'Test Project',
        summary: 'Short', // Invalid: too short
        tech: [], // Invalid: empty array
        links: {
          live: 'invalid-url', // Invalid: not a URL
        },
        impact: [],
        role: '',
        featured: 'yes', // Invalid: should be boolean
      };

      const result = validateWithDetails(invalidProject, ProjectSchema);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Check specific error fields
      const errorFields = result.errors.map(error => error.field);
      expect(errorFields).toContain('slug');
      expect(errorFields).toContain('summary');
      expect(errorFields).toContain('tech');
      expect(errorFields).toContain('featured');
    });
  });

  describe('validateContentWithWarnings', () => {
    it('should return warnings for missing optional fields', () => {
      const projectWithMissingOptionals = {
        slug: 'test-project',
        name: 'Test Project',
        summary: 'A test project for validation',
        tech: ['React'],
        links: {},
        impact: ['Some impact'],
        role: 'Developer',
        featured: false,
        // Missing optional fields: description, images, metrics
      };

      const result = validateContentWithWarnings(
        projectWithMissingOptionals,
        ProjectSchema,
        ['description', 'images', 'metrics']
      );

      expect(result.success).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      
      const warningFields = result.warnings.map(warning => warning.field);
      expect(warningFields).toContain('description');
      expect(warningFields).toContain('images');
      expect(warningFields).toContain('metrics');
    });
  });

  describe('batchValidate', () => {
    it('should validate multiple items', () => {
      const items = [
        {
          data: {
            slug: 'project-1',
            name: 'Project 1',
            summary: 'First project',
            tech: ['React'],
            links: {},
            impact: ['Impact 1'],
            role: 'Developer',
            featured: false,
          },
          context: 'project-1.json',
        },
        {
          data: {
            slug: '', // Invalid
            name: 'Project 2',
            summary: 'Second project',
            tech: ['Vue'],
            links: {},
            impact: ['Impact 2'],
            role: 'Developer',
            featured: false,
          },
          context: 'project-2.json',
        },
      ];

      const results = batchValidate(items, ProjectSchema);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[0].context).toBe('project-1.json');
      expect(results[1].success).toBe(false);
      expect(results[1].context).toBe('project-2.json');
    });
  });

  describe('validateProjectSlug', () => {
    it('should validate correct slug format', () => {
      const validSlugs = [
        'project-name',
        'my-awesome-project',
        'project123',
        'simple',
      ];

      validSlugs.forEach(slug => {
        const result = validateProjectSlug(slug);
        expect(result.success).toBe(true);
        expect(result.data).toBe(slug);
      });
    });

    it('should reject invalid slug formats', () => {
      const invalidSlugs = [
        'Project Name', // Contains spaces and uppercase
        'project_name', // Contains underscore
        '-project', // Starts with hyphen
        'project-', // Ends with hyphen
        'project--name', // Double hyphen
        '', // Empty
        'project.name', // Contains dot
      ];

      invalidSlugs.forEach(slug => {
        const result = validateProjectSlug(slug);
        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://localhost:3000',
        'https://github.com/user/repo',
        'https://subdomain.example.com/path?query=value',
      ];

      validUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.success).toBe(true);
        expect(result.data).toBe(url);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        '',
        'invalid-url-format',
        'just-text',
      ];

      invalidUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com',
      ];

      validEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.success).toBe(true);
        expect(result.data).toBe(email);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'user@',
        'user@.com',
        '',
        'invalid.email',
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateDate', () => {
    it('should validate correct date formats', () => {
      const validDates = [
        '2023-12-01',
        '2023-12-01T10:30:00Z',
        '2023-12-01T10:30:00.000Z',
        new Date().toISOString(),
      ];

      validDates.forEach(date => {
        const result = validateDate(date);
        expect(result.success).toBe(true);
        expect(result.data).toBe(date);
      });
    });

    it('should reject invalid date formats', () => {
      const invalidDates = [
        'not-a-date',
        'invalid-date-format',
        '',
        '32/13/2023',
      ];

      invalidDates.forEach(date => {
        const result = validateDate(date);
        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('formatValidationErrors', () => {
    it('should format errors with field names and messages', () => {
      const errors = [
        {
          field: 'name',
          message: 'Name is required',
          code: 'required',
          value: '',
        },
        {
          field: 'email',
          message: 'Invalid email format',
          code: 'invalid_email',
          value: 'invalid-email',
        },
      ];

      const formatted = formatValidationErrors(errors);

      expect(formatted).toHaveLength(2);
      expect(formatted[0]).toContain('name: Name is required');
      expect(formatted[1]).toContain('email: Invalid email format');
      expect(formatted[1]).toContain('invalid-email');
    });
  });

  describe('createValidationReport', () => {
    it('should create a comprehensive validation report', () => {
      const fileResults = [
        {
          filePath: 'project-1.json',
          valid: true,
          errors: [],
          warnings: [],
        },
        {
          filePath: 'project-2.json',
          valid: false,
          errors: [
            {
              field: 'slug',
              message: 'Slug is required',
              code: 'required',
            },
          ],
          warnings: [],
        },
        {
          filePath: 'project-3.json',
          valid: true,
          errors: [],
          warnings: [
            {
              field: 'description',
              message: 'Description is recommended',
              code: 'missing_recommended',
            },
          ],
        },
      ];

      const report = createValidationReport(fileResults);

      expect(report.valid).toBe(false); // Has invalid files
      expect(report.files).toHaveLength(3);
      expect(report.summary.totalFiles).toBe(3);
      expect(report.summary.validFiles).toBe(2);
      expect(report.summary.invalidFiles).toBe(1);
      expect(report.summary.totalErrors).toBe(1);
    });
  });
});