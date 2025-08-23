"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { OptimizedImage } from "./optimized-image";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  lowQualitySrc?: string;
  priority?: boolean;
  sizes?: string | undefined;
  onLoad?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  lowQualitySrc,
  priority = false,
  sizes,
  onLoad,
}: ProgressiveImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate low quality placeholder if not provided
  const defaultLowQuality = lowQualitySrc || generateLowQualityPlaceholder(src);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      {/* Low quality placeholder */}
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={defaultLowQuality}
            alt={alt}
            width={width || 800}
            height={height || 600}
            className={cn("blur-sm scale-110", className)}
            showLoadingState={false}
          />
        </motion.div>
      )}

      {/* High quality image */}
      {(isInView || priority) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <OptimizedImage
            src={src}
            alt={alt}
            width={width || 800}
            height={height || 600}
            className={className || ""}
            priority={priority}
            sizes={sizes}
            onLoad={handleLoad}
          />
        </motion.div>
      )}
    </div>
  );
}

// Helper function to generate a low quality placeholder
function generateLowQualityPlaceholder(src: string): string {
  // For demo purposes, we'll use a simple approach
  // In a real implementation, you might want to generate actual low-quality versions
  if (src.includes("unsplash.com")) {
    return src.replace(/w=\d+/, "w=50").replace(/h=\d+/, "h=50");
  }

  // Fallback to a generic placeholder
  return `https://via.placeholder.com/50x50/e5e7eb/9ca3af?text=${encodeURIComponent(src.split("/").pop()?.split(".")[0] || "Image")}`;
}
