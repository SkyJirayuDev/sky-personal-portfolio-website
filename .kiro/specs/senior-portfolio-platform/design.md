# Design Document

## Overview

The Senior Portfolio Platform is a high-performance, accessible personal portfolio website built with Next.js latest (15.x) with App Router, designed to technical audiences (recruiters, tech leads, engineering peers). The architecture emphasizes clean system design, lightning-fast performance, and maintainable code with a focus on visual polish and smooth user interactions.

### Key Design Principles

- **Performance First**: Lighthouse scores 95+ performance, 100 accessibility
- **System Design Showcase**: Clean architecture demonstrating engineering excellence
- **Content-Driven**: Typed JSON schema with MDX support for maintainability
- **Accessibility**: WCAG 2.2 AA compliance with inclusive design patterns
- **Extensibility**: Modular components and clear separation of concerns

## Architecture

### High-Level Architecture

```mermaid
graph TB
    A[Client Browser] --> B[Next.js latest (15.x) App Router]
    B --> C[React Server Components]
    B --> D[Client Components]
    C --> E[Content Layer]
    C --> F[Static Assets]
    D --> G[Interactive Features]
    E --> H[JSON Schema]
    E --> I[MDX Content]
    F --> J[Optimized Images]
    G --> K[Forms & Analytics]

    subgraph "Deployment"
        L[Netlify Edge Network]
        M[CDN Assets]
        N[Analytics Provider]
    end

    B --> L
    F --> M
    K --> N
```

### Technology Stack

**Core Framework**

- Next.js latest (15.x) with App Router for file-based routing and React Server Components
- TypeScript for type safety and developer experience
- React 18 with Server Components for optimal performance

**UI & Styling**

- Tailwind CSS for utility-first styling with custom design tokens
- shadcn/ui for accessible, customizable component primitives
- Radix UI for headless component foundations
- Framer Motion for smooth animations and micro-interactions

**Content Management**

- Typed JSON schema for structured data (projects, skills, certifications)
- MDX for blog content with syntax highlighting and custom components
- next/image for optimized image delivery with blur placeholders

**Forms & Validation**

- React Hook Form for performant form handling
- Zod for runtime type validation and schema definition
- Use Next.js API routes running on Netlify Functions

**Analytics & Monitoring**

- Privacy-friendly analytics with configurable providers
- Core Web Vitals tracking for performance monitoring
- Error boundary implementation for graceful error handling

## Components and Interfaces

### Core Layout Components

**AppLayout**

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  metadata: SiteMetadata;
}
```

**Navigation**

```typescript
interface NavigationProps {
  sections: NavigationSection[];
  currentSection?: string;
  isMobile?: boolean;
}

interface NavigationSection {
  id: string;
  label: string;
  href: string;
  order: number;
}
```

### Content Components

**Hero Section**

```typescript
interface HeroProps {
  profile: ProfileData;
  trustBadges: TrustBadge[];
  ctaButtons: CTAButton[];
}

interface ProfileData {
  name: string;
  title: string;
  location: string;
  bio: string;
  links: ProfileLinks;
}
```

**Project Components**

```typescript
interface ProjectCardProps {
  project: Project;
  variant: "featured" | "grid";
  showTechStack?: boolean;
}

interface Project {
  slug: string;
  name: string;
  summary: string;
  tech: string[];
  links: ProjectLinks;
  impact: string[];
  role: string;
  featured?: boolean;
}
```

**Skills Matrix**

```typescript
interface SkillsMatrixProps {
  skillGroups: SkillGroup[];
  displayMode: "bars" | "tags" | "grid";
}

interface SkillGroup {
  group: string;
  items: Skill[];
}

interface Skill {
  name: string;
  proficiency?: number;
  category: string;
}
```

### Interactive Components

**Contact Form**

```typescript
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  successMessage: string;
  errorMessage?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  honeypot?: string; // Spam protection
}
```

**Theme Provider**

```typescript
interface ThemeContextValue {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  resolvedTheme: "light" | "dark";
}
```

## Data Models

### Content Schema

**Profile Schema**

```typescript
interface ProfileSchema {
  name: string;
  title: string;
  location: string;
  bio: string;
  links: {
    email: string;
    github: string;
    linkedin: string;
    resume: string;
    [key: string]: string;
  };
}
```

**Project Schema**

```typescript
interface ProjectSchema {
  slug: string;
  name: string;
  summary: string;
  description?: string;
  tech: string[];
  links: {
    live?: string;
    repo?: string;
    case_study?: string;
  };
  impact: string[];
  role: string;
  featured: boolean;
  images?: ImageAsset[];
  metrics?: ProjectMetric[];
}

interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
}
```

**Certification Schema**

```typescript
interface CertificationSchema {
  name: string;
  issuer: string;
  url: string;
  date?: string;
  credential_id?: string;
  skills?: string[];
}
```

### Content Validation

All content schemas will be validated using Zod schemas:

```typescript
import { z } from "zod";

export const ProjectSchemaValidator = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(10),
  tech: z.array(z.string()).min(1),
  links: z.object({
    live: z.string().url().optional(),
    repo: z.string().url().optional(),
  }),
  impact: z.array(z.string()).min(1),
  role: z.string().min(1),
  featured: z.boolean().default(false),
});
```

## Error Handling

### Error Boundary Strategy

**Global Error Boundary**

- Catches unhandled errors in the component tree
- Provides fallback UI with error reporting
- Logs errors to analytics for monitoring

**Route-Level Error Handling**

- Custom error.tsx files for route-specific error states
- 404 handling with suggested navigation
- Loading states with skeleton components

**Form Error Handling**

- Field-level validation with immediate feedback
- Server-side validation with detailed error messages
- Network error handling with retry mechanisms

### Error Recovery

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  showDetails?: boolean;
}
```

## Testing Strategy

### Unit Testing

**Component Testing with Vitest**

- Test component rendering and props handling
- Validate content schema and data transformations
- Mock external dependencies and API calls

**Utility Function Testing**

- Content parsing and validation functions
- Theme switching and persistence logic
- Form validation and submission handlers

### Integration Testing

**API Route Testing**

- Contact form submission and validation
- Content API endpoints for dynamic data
- Error handling and response formatting

### End-to-End Testing

**Critical User Flows with Playwright**

- Homepage loading and navigation
- Project filtering and case study access
- Contact form submission and validation
- Theme switching and persistence
- Mobile responsive behavior

**Performance Testing**

- Lighthouse CI integration for performance regression detection
- Core Web Vitals monitoring in production
- Image optimization and loading performance

### Accessibility Testing

**Automated Testing**

- axe-core integration for WCAG compliance
- Color contrast validation
- Keyboard navigation testing

**Manual Testing Checklist**

- Screen reader compatibility
- Focus management and tab order
- Reduced motion preference handling

## Performance Optimization

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: < 2.5s
- **Interaction to Next Paint (INP)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Strategies

**Image Optimization**

- next/image with responsive sizes and formats
- Blur placeholders for smooth loading experience
- WebP/AVIF format support with fallbacks

**Code Splitting**

- Route-level code splitting with App Router
- Dynamic imports for heavy components
- Bundle analysis and optimization

**Caching Strategy**

- Static generation for content pages
- Incremental Static Regeneration for dynamic content
- Edge caching with Netlify deployment

**Font Optimization**

- Font subsetting for reduced payload
- Font display swap for faster text rendering
- Preload critical fonts

## Deployment and Infrastructure

### Netlify Deployment Configuration

**Build Optimization**

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["framer-motion", "recharts"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
```

**Environment Configuration**

- Separate configurations for development, staging, and production
- Environment variables for analytics and form handling
- Feature flags for gradual rollout of new features

### Monitoring and Analytics

**Performance Monitoring**

- Real User Monitoring (RUM) for Core Web Vitals
- Error tracking and alerting
- Performance budget enforcement

**Privacy-Friendly Analytics**

- Configurable analytics provider (Plausible, Fathom, or similar)
- GDPR-compliant data collection
- Opt-out mechanisms for user privacy

## Security Considerations

### Content Security Policy

```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;
```

### Form Security

- CSRF protection with server-side validation
- Rate limiting for contact form submissions
- Honeypot fields for spam prevention
- Input sanitization and validation

### Data Protection

- No storage of personally identifiable information
- Secure handling of contact form data
- Privacy-compliant analytics implementation
