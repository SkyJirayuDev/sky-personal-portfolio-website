import fs from "fs/promises";
import path from "path";
import { z } from "zod";

// =============================================================================
// MDX Content Types
// =============================================================================

export interface MDXFrontmatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
  author?: string;
  image?: string;
  [key: string]: any;
}

export interface MDXContent {
  slug: string;
  frontmatter: MDXFrontmatter;
  content: string;
  readingTime?: number;
}

export interface BlogPost extends MDXContent {
  frontmatter: MDXFrontmatter & {
    title: string;
    date: string;
  };
}

export interface CaseStudy extends MDXContent {
  frontmatter: MDXFrontmatter & {
    title: string;
    project: string;
    problem?: string;
    approach?: string;
    impact?: string;
  };
}

// =============================================================================
// Zod Schemas for MDX Content
// =============================================================================

export const MDXFrontmatterSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
    author: z.string().optional(),
    image: z.string().optional(),
  })
  .catchall(z.any());

export const BlogPostFrontmatterSchema = MDXFrontmatterSchema.extend({
  title: z.string().min(1, "Blog post title is required"),
  date: z.string().min(1, "Blog post date is required"),
});

export const CaseStudyFrontmatterSchema = MDXFrontmatterSchema.extend({
  title: z.string().min(1, "Case study title is required"),
  project: z.string().min(1, "Project reference is required"),
  problem: z.string().optional(),
  approach: z.string().optional(),
  impact: z.string().optional(),
});

// =============================================================================
// MDX Parsing Utilities
// =============================================================================

/**
 * Parse frontmatter from MDX content
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, any>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {},
      content: content,
    };
  }

  const [, frontmatterStr, bodyContent] = match;

  if (!frontmatterStr || !bodyContent) {
    return {
      frontmatter: {},
      content: content,
    };
  }

  try {
    // Simple YAML-like parsing for frontmatter
    const frontmatter: Record<string, any> = {};
    const lines = frontmatterStr.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) continue;

      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex === -1) continue;

      const key = trimmedLine.slice(0, colonIndex).trim();
      let value: any = trimmedLine.slice(colonIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Parse arrays (simple format: [item1, item2])
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((item: string) => item.trim().replace(/^["']|["']$/g, ""))
          .filter((item: string) => item.length > 0);
      }

      // Parse booleans
      if (value === "true") value = true;
      if (value === "false") value = false;

      frontmatter[key] = value;
    }

    return {
      frontmatter,
      content: bodyContent.trim(),
    };
  } catch (error) {
    console.warn("Failed to parse frontmatter:", error);
    return {
      frontmatter: {},
      content: content,
    };
  }
}

/**
 * Calculate estimated reading time
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Load and parse MDX file
 */
async function loadMDXFile(filePath: string): Promise<MDXContent | null> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = await fs.readFile(fullPath, "utf-8");
    const { frontmatter, content } = parseFrontmatter(fileContent);

    const slug = path.basename(filePath, ".mdx");
    const readingTime = calculateReadingTime(content);

    return {
      slug,
      frontmatter: frontmatter as MDXFrontmatter,
      content,
      readingTime,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get all MDX files in a directory
 */
async function getMDXFilesInDirectory(dirPath: string): Promise<string[]> {
  try {
    const fullPath = path.join(process.cwd(), dirPath);
    const files = await fs.readdir(fullPath);
    return files
      .filter(file => file.endsWith(".mdx"))
      .map(file => path.join(dirPath, file));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

// =============================================================================
// Blog Post Utilities
// =============================================================================

/**
 * Load a single blog post
 */
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = `content/blog/${slug}.mdx`;
  const mdxContent = await loadMDXFile(filePath);

  if (!mdxContent) {
    return null;
  }

  try {
    const validatedFrontmatter = BlogPostFrontmatterSchema.parse(
      mdxContent.frontmatter
    );

    return {
      ...mdxContent,
      frontmatter: validatedFrontmatter,
    } as BlogPost;
  } catch (error) {
    console.warn(`Invalid blog post frontmatter in ${filePath}:`, error);
    return null;
  }
}

/**
 * Load all blog posts
 */
export async function loadBlogPosts(): Promise<BlogPost[]> {
  const blogFiles = await getMDXFilesInDirectory("content/blog");
  const posts: BlogPost[] = [];

  for (const filePath of blogFiles) {
    try {
      const mdxContent = await loadMDXFile(filePath);
      if (!mdxContent) continue;

      const validatedFrontmatter = BlogPostFrontmatterSchema.parse(
        mdxContent.frontmatter
      );

      // Skip draft posts in production
      if (process.env.NODE_ENV === "production" && validatedFrontmatter.draft) {
        continue;
      }

      posts.push({
        ...mdxContent,
        frontmatter: validatedFrontmatter,
      } as BlogPost);
    } catch (error) {
      console.warn(`Failed to load blog post from ${filePath}:`, error);
    }
  }

  // Sort posts by date (most recent first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB.getTime() - dateA.getTime();
  });
}

// =============================================================================
// Case Study Utilities
// =============================================================================

/**
 * Load a single case study
 */
export async function loadCaseStudy(slug: string): Promise<CaseStudy | null> {
  const filePath = `content/case-studies/${slug}.mdx`;
  const mdxContent = await loadMDXFile(filePath);

  if (!mdxContent) {
    return null;
  }

  try {
    const validatedFrontmatter = CaseStudyFrontmatterSchema.parse(
      mdxContent.frontmatter
    );

    return {
      ...mdxContent,
      frontmatter: validatedFrontmatter,
    } as CaseStudy;
  } catch (error) {
    console.warn(`Invalid case study frontmatter in ${filePath}:`, error);
    return null;
  }
}

/**
 * Load all case studies
 */
export async function loadCaseStudies(): Promise<CaseStudy[]> {
  const caseStudyFiles = await getMDXFilesInDirectory("content/case-studies");
  const caseStudies: CaseStudy[] = [];

  for (const filePath of caseStudyFiles) {
    try {
      const mdxContent = await loadMDXFile(filePath);
      if (!mdxContent) continue;

      const validatedFrontmatter = CaseStudyFrontmatterSchema.parse(
        mdxContent.frontmatter
      );

      caseStudies.push({
        ...mdxContent,
        frontmatter: validatedFrontmatter,
      } as CaseStudy);
    } catch (error) {
      console.warn(`Failed to load case study from ${filePath}:`, error);
    }
  }

  // Sort case studies by title
  return caseStudies.sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title)
  );
}

/**
 * Load case studies for a specific project
 */
export async function loadCaseStudiesForProject(
  projectSlug: string
): Promise<CaseStudy[]> {
  const allCaseStudies = await loadCaseStudies();
  return allCaseStudies.filter(
    caseStudy => caseStudy.frontmatter.project === projectSlug
  );
}
