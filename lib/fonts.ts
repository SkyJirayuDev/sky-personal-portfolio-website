import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";

// Primary font - Inter for body text
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// Monospace font - JetBrains Mono for code
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  preload: false, // Only load when needed
  fallback: [
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ],
});

// Display font - Playfair Display for headings
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  preload: false, // Only load when needed
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// Font loading optimization utilities
export const fontVariables = [
  inter.variable,
  jetbrainsMono.variable,
  playfairDisplay.variable,
].join(" ");

// Preload critical fonts
export const preloadFonts = [
  {
    href: inter.style.fontFamily,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

// Font display strategies
export const fontDisplayStrategies = {
  critical: "swap", // For above-the-fold content
  deferred: "optional", // For below-the-fold content
  fallback: "fallback", // For non-critical text
} as const;
