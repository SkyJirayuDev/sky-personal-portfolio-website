# Content Management System

This directory contains the content management system for the portfolio website, providing type-safe content loading, validation, and parsing utilities.

## Overview

The content system is built with:

- **TypeScript interfaces** for type safety
- **Zod schemas** for runtime validation
- **JSON files** for structured data
- **MDX files** for rich content (blog posts, case studies)
- **Comprehensive error handling** with detailed validation messages

## Directory Structure

```
lib/content/
├── index.ts           # Main exports
├── parser.ts          # JSON content parsing and loading
├── mdx.ts            # MDX content processing
├── validation.ts     # Validation utilities and error handling
└── README.md         # This file

lib/schemas/
└── content.ts        # TypeScript interfaces and Zod schemas

content/
├── profile.json      # Personal profile data
├── skills.json       # Skills organized by groups
├── certifications.json # Professional certifications
├── experience.json   # Work experience timeline
├── projects/         # Individual project files
│   ├── project-1.json
│   └── project-2.json
├── blog/            # Blog posts in MDX format
│   └── post-1.mdx
└── case-studies/    # Project case studies in MDX
    └── study-1.mdx
```

## Content Types

### Profile Data

```typescript
interface ProfileData {
  name: string;
  title: string;
  location: string;
  bio: string;
  links: ProfileLinks;
}
```

### Projects

```typescript
interface Project {
  slug: string;
  name: string;
  summary: string;
  tech: string[];
  links: ProjectLinks;
  impact: string[];
  role: string;
  featured: boolean;
  // ... additional optional fields
}
```

### Skills

```typescript
interface SkillGroup {
  group: string;
  items: Skill[];
  order?: number;
}

interface Skill {
  name: string;
  proficiency?: number;
  category: string;
  description?: string;
  years?: number;
}
```

### Certifications

```typescript
interface Certification {
  name: string;
  issuer: string;
  url: string;
  date?: string;
  credential_id?: string;
  skills?: string[];
  description?: string;
}
```

### Experience

```typescript
interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  achievements: string[];
  tech: string[];
}
```

## Usage Examples

### Loading Content

```typescript
import {
  loadProfile,
  loadProjects,
  loadSkillGroups,
  loadCertifications,
  loadExperiences,
} from "@/lib/content";

// Load profile data
const profile = await loadProfile();

// Load all projects
const projects = await loadProjects();

// Load a specific project
const project = await loadProject("ecommerce-platform");

// Load skill groups
const skillGroups = await loadSkillGroups();
```

### Loading MDX Content

```typescript
import {
  loadBlogPosts,
  loadBlogPost,
  loadCaseStudies,
  loadCaseStudy,
} from "@/lib/content";

// Load all blog posts
const posts = await loadBlogPosts();

// Load a specific blog post
const post = await loadBlogPost("getting-started-with-nextjs");

// Load case studies for a project
const caseStudies = await loadCaseStudiesForProject("ecommerce-platform");
```

### Content Validation

```typescript
import {
  validateWithDetails,
  validateAllContent,
  formatValidationReport,
} from "@/lib/content";

// Validate specific data
const result = validateWithDetails(data, ProjectSchema);
if (!result.success) {
  console.log("Validation errors:", result.errors);
}

// Validate all content files
const report = await validateAllContent();
if (!report.valid) {
  console.log(formatValidationReport(report));
}
```

## Content File Formats

### JSON Content Files

All JSON content files must follow the defined schemas. Example project file:

```json
{
  "slug": "my-project",
  "name": "My Awesome Project",
  "summary": "A brief description of the project",
  "tech": ["React", "TypeScript", "Node.js"],
  "links": {
    "live": "https://example.com",
    "repo": "https://github.com/user/repo"
  },
  "impact": ["Improved performance by 50%", "Reduced load times by 2 seconds"],
  "role": "Full-Stack Developer",
  "featured": true
}
```

### MDX Content Files

MDX files support frontmatter for metadata:

```mdx
---
title: My Blog Post
description: A great blog post about web development
date: 2024-01-15
tags: [React, TypeScript, Web Development]
featured: true
---

# My Blog Post

Content goes here with full Markdown support and React components.
```

## Validation and Error Handling

The system provides comprehensive validation with detailed error messages:

- **Schema validation** using Zod for runtime type checking
- **File existence checks** before attempting to load content
- **JSON parsing errors** with helpful error messages
- **Frontmatter parsing** for MDX files with fallback handling
- **Batch validation** for multiple content files

### Running Validation

```bash
# Validate all content files
npm run validate-content

# Type check the entire project
npm run type-check
```

## Best Practices

1. **Always validate content** before using it in components
2. **Use TypeScript interfaces** for type safety during development
3. **Handle loading errors gracefully** in your components
4. **Keep content files organized** by type and purpose
5. **Use meaningful slugs** for projects and blog posts
6. **Include comprehensive metadata** for better SEO and organization

## Error Handling

The system includes custom error types:

- `ContentParseError`: For validation and parsing failures
- `ContentNotFoundError`: For missing content files

```typescript
try {
  const project = await loadProject("non-existent");
} catch (error) {
  if (error instanceof ContentNotFoundError) {
    // Handle missing content
  } else if (error instanceof ContentParseError) {
    // Handle validation errors
    console.log(error.validationErrors);
  }
}
```

## Performance Considerations

- Content is loaded on-demand, not all at once
- Failed content loading doesn't break the entire system
- Validation errors are logged but don't crash the application
- Content can be cached at the application level if needed

## Extending the System

To add new content types:

1. Define TypeScript interfaces in `lib/schemas/content.ts`
2. Create Zod validation schemas
3. Add loading functions in `lib/content/parser.ts`
4. Export new functions from `lib/content/index.ts`
5. Create content files following the new schema
6. Update validation scripts to include new content types
