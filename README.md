# Senior Portfolio Platform

A high-performance, accessible personal portfolio website built with Next.js latest (15.x) with App Router, designed for technical audiences.

## Tech Stack

- **Framework**: Next.js 15.x with App Router
- **Language**: TypeScript (strict configuration)
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Code Quality**: ESLint + Prettier

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
├── content/               # Content data (JSON/MDX)
│   ├── projects/          # Project case studies
│   └── blog/              # Blog posts
└── .kiro/                 # Kiro specs and configuration
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Features

- ⚡ Next.js 15.x with App Router and React Server Components
- 🎨 Tailwind CSS with custom design tokens and dark theme
- 🧩 shadcn/ui components with Radix UI primitives
- 🎭 Framer Motion for smooth animations
- 📱 Fully responsive design
- ♿ WCAG 2.2 AA accessibility compliance
- 🚀 Optimized for performance (Lighthouse 95+)
- 🔧 TypeScript strict mode for type safety
- 📝 ESLint + Prettier for code quality

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

## Deployment

This project is optimized for deployment on Netlify with support for:

- Static generation and ISR
- next/image CDN optimization
- Edge caching
- Environment-specific configurations

## License

MIT License - see LICENSE file for details.
