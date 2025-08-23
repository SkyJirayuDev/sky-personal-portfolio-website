# Requirements Document

## Introduction

This document outlines the requirements for a production-ready personal portfolio website for Jirayu Saisuwan, a Full-Stack Software & Web Platform Engineer | Cloud & AI. The portfolio targets technical audiences such as hiring managers, tech leads, and engineering peers, and aims to demonstrate credibility in system design, cloud, and AI through clean architecture, outstanding visual polish, and fast performance. The platform will be built with Next.js latest (15.x) and TypeScript, and will be deployed on Netlify, with a focus on extensibility, maintainability, and accessibility.

## Requirements

### Requirement 1

**User Story:** As a visitor interested in evaluating Jirayu Saisuwan’s expertise, I want to quickly understand his technical credibility and system design capabilities, so that I can recognize his strengths as a Full-Stack Software & Web Platform Engineer specializing in Cloud and AI.

#### Acceptance Criteria

1. WHEN a visitor lands on the homepage THEN the system SHALL display the candidate's name, title, and concise value proposition within 2 seconds
2. WHEN a visitor views the skills section THEN the system SHALL present technical capabilities organized by Frontend, Backend, Cloud/DevOps, and AI/Data stacks with proficiency indicators
3. WHEN a visitor accesses featured projects THEN the system SHALL display 3-6 project cards with problem-approach-impact structure and verifiable links
4. WHEN a visitor views the experience timeline THEN the system SHALL show role, company, and quantifiable impact metrics
5. WHEN a visitor accesses certifications THEN the system SHALL provide links to verifiable credentials from Meta and Oracle

### Requirement 2

**User Story:** As a technical audience (e.g., recruiter, tech lead, or peer engineer), I want to see detailed case studies of the candidate's work, so that I can understand their problem-solving approach and technical depth.

#### Acceptance Criteria

1. WHEN a visitor clicks on a featured project THEN the system SHALL navigate to a dedicated case study page with problem context, system diagrams, and architecture decisions
2. WHEN viewing a case study THEN the system SHALL display technical stack, implementation approach, and measurable outcomes
3. WHEN a case study loads THEN the system SHALL render system diagrams and architecture visualizations within 3 seconds
4. WHEN a visitor accesses project links THEN the system SHALL provide working links to live demos and source code repositories

### Requirement 3

**User Story:** As a website visitor, I want a fast and visually polished experience with smooth interactions, so that I have a positive impression of the candidate's attention to quality.

#### Acceptance Criteria

1. WHEN the website loads THEN the system SHALL achieve Lighthouse performance scores of 95+ and accessibility scores of 100
2. WHEN a visitor interacts with UI elements THEN the system SHALL provide micro-interactions and hover effects using framer-motion
3. WHEN a visitor scrolls through sections THEN the system SHALL reveal content with smooth in-view animations
4. WHEN a visitor hovers over project cards THEN the system SHALL apply 3D-tilt effects and display quick tech tags
5. WHEN a visitor uses the navigation THEN the system SHALL provide sticky top navigation with scrollspy and section hash links
6. WHEN a visitor accesses the site on mobile THEN the system SHALL display a responsive sheet menu with touch-friendly interactions

### Requirement 4

**User Story:** As a website visitor, I want to easily contact the candidate and navigate through different sections, so that I can engage with relevant content efficiently.

#### Acceptance Criteria

1. WHEN a visitor clicks the contact form THEN the system SHALL validate inputs using React Hook Form with Zod validation
2. WHEN a visitor submits the contact form THEN the system SHALL provide spam protection and display success/error states
3. WHEN a visitor clicks the email address THEN the system SHALL copy to clipboard with tooltip feedback
4. WHEN a visitor uses navigation links THEN the system SHALL scroll smoothly to the corresponding section with hash URL updates
5. WHEN a visitor clicks CTA buttons THEN the system SHALL provide magnetic hover effects and clear visual feedback

### Requirement 5

**User Story:** As the portfolio owner, I want a maintainable content system with typed data models, so that I can easily update portfolio information without code changes.

#### Acceptance Criteria

1. WHEN content is updated THEN the system SHALL use typed JSON schema for projects, skills, certifications, and profile data
2. WHEN blog content is added THEN the system SHALL support MDX format with syntax highlighting and responsive layouts
3. WHEN project data is modified THEN the system SHALL validate against TypeScript interfaces and display updates immediately
4. WHEN new case studies are created THEN the system SHALL generate dynamic routes using Next.js App Router
5. WHEN content includes images THEN the system SHALL optimize using next/image with responsive sizes and blur placeholders

### Requirement 6

**User Story:** As a developer extending this portfolio, I want clean architecture with comprehensive testing, so that I can add features confidently without breaking existing functionality.

#### Acceptance Criteria

1. WHEN the codebase is examined THEN the system SHALL follow Next.js latest App Router patterns with React Server Components
2. WHEN components are tested THEN the system SHALL include unit tests for content schema and UI utilities using Vitest
3. WHEN critical user flows are validated THEN the system SHALL include E2E smoke tests using Playwright
4. WHEN the project is built THEN the system SHALL implement route-level code splitting and critical CSS optimization
5. WHEN accessibility is tested THEN the system SHALL meet WCAG 2.2 AA standards with proper focus states and semantic landmarks

### Requirement 7

**User Story:** As a website visitor with accessibility needs, I want an inclusive experience that works with assistive technologies, so that I can access all portfolio content effectively.

#### Acceptance Criteria

1. WHEN using screen readers THEN the system SHALL provide semantic HTML landmarks and proper heading hierarchy
2. WHEN navigating with keyboard THEN the system SHALL display clear focus states and logical tab order
3. WHEN motion sensitivity is enabled THEN the system SHALL respect prefers-reduced-motion settings
4. WHEN color contrast is tested THEN the system SHALL maintain WCAG 2.2 AA compliance across all UI elements
5. WHEN images are displayed THEN the system SHALL include descriptive alt text for all visual content

### Requirement 8

**User Story:** As a website visitor, I want to filter and explore projects by technology or category, so that I can find relevant examples of the candidate's work.

#### Acceptance Criteria

1. WHEN visiting the projects page THEN the system SHALL display a filterable grid with technology tags
2. WHEN a filter is applied THEN the system SHALL update the project grid with smooth transitions
3. WHEN projects are displayed THEN the system SHALL show technology stack, role, and impact metrics
4. WHEN a project card is clicked THEN the system SHALL navigate to the detailed case study page
5. WHEN browsing projects THEN the system SHALL maintain filter state in URL parameters for shareable links

### Requirement 9

**User Story:** As a website visitor, I want theme customization options, so that I can view the portfolio in my preferred visual mode.

#### Acceptance Criteria

1. WHEN the theme switcher is clicked THEN the system SHALL toggle between light and dark modes with smooth transitions
2. WHEN a theme is selected THEN the system SHALL persist the preference across browser sessions
3. WHEN in dark mode THEN the system SHALL display tasteful gradients and soft glass effects with high contrast
4. WHEN theme changes occur THEN the system SHALL maintain color contrast ratios for accessibility compliance
5. WHEN the system loads THEN the system SHALL respect the user's system theme preference as default

### Requirement 10

**User Story:** As the portfolio owner, I want privacy-friendly analytics and performance monitoring, so that I can understand visitor engagement while respecting user privacy.

#### Acceptance Criteria

1. WHEN analytics are implemented THEN the system SHALL use privacy-friendly analytics with easy provider swapping
2. WHEN performance is monitored THEN the system SHALL track Core Web Vitals and loading metrics
3. WHEN user data is collected THEN the system SHALL comply with privacy regulations and provide opt-out mechanisms
4. WHEN analytics data is processed THEN the system SHALL avoid collecting personally identifiable information
5. WHEN the analytics provider needs changing THEN the system SHALL support configuration-based provider switching

### Requirement 11
Instruction:
Update the portfolio website content to match the following latest CV details. Do not change the Hero Section (keep the header, name, and title as they are). Only update the content sections below.
Education
Master of Information Technology (MIT), Auckland Institute of Studies (AIS), New Zealand (Jan 2024 - Present, Expected Aug 2025)
Award: Academic Excellence in Postgraduate Studies (MIT) 2024
Bachelor of Science (Computer Science), Kasetsart University, Thailand
Certifications
Professional Certificates: Meta Front-End Developer
Specializations: Responsive Website Development and Design (University of London), User Experience Research and Design (University of Michigan), Software Development Lifecycle (University of Minnesota), HTML, CSS, and JavaScript for Web Developers (Johns Hopkins University), Advanced JavaScript (Scrimba)
Other: Oracle Cloud Infrastructure Foundations, Agile with Atlassian Jira, Algorithmic Toolbox and Data Structures (UC San Diego), Datacom Software Development Simulation (Forage)
Key Projects & Achievements
Wellness Websites - Freelance Builds (6 sites across AU / NZ)
Built responsive marketing websites using Nuxt.js / Vue 3, Tailwind CSS, SCSS, deployed via AWS S3 + CloudFront.
Implemented SEO, mobile-first layouts, and lightweight assets for performance.
Shopwise - Intelligent E-Commerce Platform
Full-stack marketplace with GPT-powered chatbot, personalised recommendations, fuzzy search, admin dashboard (React.js, Next.js, TypeScript, MongoDB, AI API).
Automated testing and CI/CD with GitHub Actions and Vercel.
AI-FinForecaster - Financial Forecasting Web App
Developed FastAPI + Prophet backend and Next.js dashboard for 30-360 day revenue projections.
CSV/PDF export, CI pipeline on Railway for rapid iterations, Recharts visualisation.
Little Lemon Restaurant - Meta Capstone (React)
Delivered mobile-first React site meeting Meta certification requirements with reusable components and accessibility focus.
Cinema Finder - Datacom Job Simulation (Forage)
Performed code reviews, resolved bugs, and organised Agile backlog in enterprise setting.
Static Restaurant Site Project
Built single-page Bootstrap site with AJAX + JSON, handling dynamic data and responsive design.
Professional Summary
Full-Stack Software & Web Platform Engineer with 6 years of experience building high-performance websites and cloud solutions for enterprise and SME clients in New Zealand and Southeast Asia. Key projects include multilingual portals for CP ALL Plc (7-Eleven), wellness brand marketing websites, and AI-enabled platforms like Shopwise (e-commerce chatbot and recommendations) and AI-FinForecaster (financial dashboard).
Skilled across React.js, Next.js, Vue.js, Nuxt.js, Node.js, FastAPI, SQL, and MongoDB, with CI/CD deployments on AWS, Vercel, and GitHub Actions. Recognised for clean code, user-centred UX, SEO, and effective Agile collaboration.
Technical Skills
Frontend: HTML, CSS, JavaScript, TypeScript, React.js, Next.js, Vue.js, Nuxt.js, Tailwind CSS, SCSS, Bootstrap, RWD
Backend & APIs: Node.js, Express, Python (FastAPI, Prophet, Pandas), REST, RESTful APIs
Database: SQL, MongoDB (Mongoose), JSON, CSV Handling, Fuse.js, Reacts
Authentication & Security: NextAuth.js, JWT, bcrypt.js, Form Validation
Cloud & DevOps: Git, GitHub Actions, Bitbucket, CI/CD, AWS, CloudFront, Vercel
Testing & Tools: VS Code, Postman, Agile (Scrum), Figma, Google Analytics
AI: OpenAI API (Chatbots, Recommendations)
Experience
Software Engineer/Developer (Intern to Freelance), Brightdesignth - Auckland, NZ (Sep 2024 - Present)
Built responsive websites for NZ & AU clients using Nuxt.js, Vue, Tailwind CSS, Next.js.
Implemented SEO, collaborated in Agile sprints, managed branching in GitHub/Bitbucket.
CI/CD on AWS S3 + CloudFront with GitHub Actions.
Full Stack Engineer (Project-Based), Auckland Institute of Studies (AIS) - Auckland, NZ (Sep 2024 - Jul 2025)
Led postgraduate builds: Shopwise e-commerce and AI-FinForecaster financial forecasting.
Architected with Next.js, TypeScript, FastAPI, MongoDB; automated tests with GitHub Actions.
Deployed to Vercel and Railway.
Webmaster Specialist, CP ALL Plc (7-Eleven) - Bangkok, Thailand (Feb 2018 - Oct 2022)
Managed multilingual corporate portals (Thailand, Laos, Cambodia).
Directed UX/UI, branding, and performance optimisation under KPIs.
Coordinated cross-functional teams, led incident responses, and used analytics for rollouts.
Duty Manager, Restaurant - Auckland, NZ (Jan 2023 - Present)
Supervised staff, schedules, and service issue resolution in a high-pressure environment.
Developed leadership and transferable problem-solving skills.

# Non-Functional Requirements (NFR)

## Performance

- The system SHALL achieve Lighthouse ≥95 and Core Web Vitals in the “Good” range (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- The homepage SHALL load essential content within 2 seconds on a 3G connection.

## Accessibility

- The system SHALL comply with WCAG 2.2 AA standards across all pages.
- The system SHALL provide semantic HTML, keyboard navigation, focus states, and motion alternatives.

## Maintainability

- The system SHALL use typed JSON schema and TypeScript models for all content.
- The system SHALL maintain modular, reusable components within the Next.js App Router.
- The system SHALL maintain automated testing (unit + e2e).

## Deployment

- The system SHALL build and run reliably on **Netlify**, with support for ISR, revalidation, and next/image CDN.
- The system SHALL include `.env.example` for environment configuration.

## Security & Privacy

- The system SHALL validate all inputs and implement spam protection.
- The system SHALL not log or collect sensitive personal data.
- The analytics SHALL be privacy-friendly and configurable without PII collection.
