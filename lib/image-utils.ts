import type { ImageAsset } from "@/lib/schemas/content";

// Image optimization utilities
export const imageConfig = {
  // Responsive breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },

  // Quality settings
  quality: {
    thumbnail: 60,
    medium: 75,
    high: 85,
    lossless: 100,
  },

  // Format preferences
  formats: ["image/avif", "image/webp", "image/jpeg"] as const,
} as const;

// Generate responsive image sizes string
export function generateSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  defaultSize?: string;
}): string {
  const {
    mobile = "100vw",
    tablet = "50vw",
    desktop = "33vw",
    defaultSize = "100vw",
  } = config;

  return [
    `(max-width: ${imageConfig.breakpoints.md}px) ${mobile}`,
    `(max-width: ${imageConfig.breakpoints.lg}px) ${tablet}`,
    `(max-width: ${imageConfig.breakpoints.xl}px) ${desktop}`,
    defaultSize,
  ].join(", ");
}

// Generate blur data URL for placeholder
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = "#e5e7eb"
): string {
  const canvas =
    typeof window !== "undefined" ? document.createElement("canvas") : null;

  if (!canvas) {
    // Fallback for SSR
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
      </svg>`
    ).toString("base64")}`;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL("image/jpeg", 0.1);
}

// Optimize image asset configuration
export function optimizeImageAsset(
  asset: ImageAsset,
  context: "thumbnail" | "gallery" | "hero" | "content" = "content"
): ImageAsset & {
  sizes?: string;
  quality?: number;
  priority?: boolean;
  blurDataURL?: string;
} {
  const contextConfig = {
    thumbnail: {
      quality: imageConfig.quality.medium,
      sizes: generateSizes({
        mobile: "150px",
        tablet: "200px",
        desktop: "250px",
        defaultSize: "200px",
      }),
      priority: false,
    },
    gallery: {
      quality: imageConfig.quality.high,
      sizes: generateSizes({
        mobile: "100vw",
        tablet: "50vw",
        desktop: "33vw",
      }),
      priority: false,
    },
    hero: {
      quality: imageConfig.quality.high,
      sizes: generateSizes({
        mobile: "100vw",
        tablet: "100vw",
        desktop: "100vw",
      }),
      priority: true,
    },
    content: {
      quality: imageConfig.quality.medium,
      sizes: generateSizes({
        mobile: "100vw",
        tablet: "75vw",
        desktop: "50vw",
      }),
      priority: false,
    },
  };

  const config = contextConfig[context];

  return {
    ...asset,
    ...config,
    blurDataURL: generateBlurDataURL(asset.width || 10, asset.height || 10),
  };
}

// Validate image URL and generate fallback
export function validateImageUrl(url: string, fallback?: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    return fallback || "/images/placeholder.jpg";
  }
}

// Generate srcSet for responsive images
export function generateSrcSet(
  baseSrc: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  // For external URLs (like Unsplash), generate different sizes
  if (baseSrc.includes("unsplash.com")) {
    return widths.map(width => `${baseSrc}&w=${width} ${width}w`).join(", ");
  }

  // For local images, assume Next.js will handle optimization
  return widths.map(width => `${baseSrc}?w=${width} ${width}w`).join(", ");
}

// Image loading strategies
export const loadingStrategies = {
  eager: "eager" as const,
  lazy: "lazy" as const,
  auto: "auto" as const,
};

// Get loading strategy based on context
export function getLoadingStrategy(
  context: "above-fold" | "below-fold" | "user-interaction",
  index: number = 0
): "eager" | "lazy" {
  switch (context) {
    case "above-fold":
      return index < 2 ? "eager" : "lazy";
    case "below-fold":
      return "lazy";
    case "user-interaction":
      return "lazy";
    default:
      return "lazy";
  }
}

// Image preloading utilities
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

// Image format detection
export function supportsWebP(): boolean {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

export function supportsAVIF(): boolean {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
}
