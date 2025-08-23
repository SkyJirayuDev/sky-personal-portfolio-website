import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AccessibilityProvider } from "@/components/providers/accessibility-provider";
import { inter, fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Jirayu Saisuwan - Full-Stack Software & Web Platform Engineer",
  description:
    "Full-Stack Software & Web Platform Engineer specializing in Cloud & AI. Experienced in system design, scalable web applications, and modern development practices.",
  keywords: [
    "Full-Stack Developer",
    "Software Engineer",
    "Cloud",
    "AI",
    "System Design",
    "TypeScript",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Jirayu Saisuwan" }],
  creator: "Jirayu Saisuwan",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Jirayu Saisuwan - Full-Stack Software & Web Platform Engineer",
    description:
      "Full-Stack Software & Web Platform Engineer specializing in Cloud & AI",
    siteName: "Jirayu Saisuwan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jirayu Saisuwan - Full-Stack Software & Web Platform Engineer",
    description:
      "Full-Stack Software & Web Platform Engineer specializing in Cloud & AI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNS prefetch for external image domains */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//via.placeholder.com" />
        <link rel="dns-prefetch" href="//githubusercontent.com" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider>{children}</AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
