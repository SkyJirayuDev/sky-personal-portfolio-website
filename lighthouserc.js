module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000"],
      startServerCommand: "npm run build && npm run start",
      startServerReadyPattern: "ready on",
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1.0 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "categories:pwa": "off", // PWA not required for this project

        // Core Web Vitals
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],

        // Other performance metrics
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
        "speed-index": ["error", { maxNumericValue: 3000 }],
        interactive: ["error", { maxNumericValue: 3800 }],

        // Accessibility requirements
        "color-contrast": "error",
        "heading-order": "error",
        "html-has-lang": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",
        list: "error",
        "meta-viewport": "error",

        // Best practices
        "uses-https": "error",
        "uses-http2": "warn",
        "no-vulnerable-libraries": "error",
        "csp-xss": "warn",

        // SEO
        "document-title": "error",
        "meta-description": "error",
        "robots-txt": "warn",
        canonical: "warn",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
