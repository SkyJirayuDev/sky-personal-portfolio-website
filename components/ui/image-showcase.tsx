"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { OptimizedImage } from "./optimized-image";
import { ProgressiveImage } from "./progressive-image";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { optimizeImageAsset } from "@/lib/image-utils";
import type { ImageAsset } from "@/lib/schemas/content";

interface ImageShowcaseProps {
  images: ImageAsset[];
  title?: string;
  className?: string;
  variant?: "grid" | "masonry" | "carousel";
  showOptimizationInfo?: boolean;
}

export function ImageShowcase({
  images,
  title,
  className,
  variant = "grid",
  showOptimizationInfo = false,
}: ImageShowcaseProps) {
  const [selectedVariant, setSelectedVariant] = useState<
    "standard" | "progressive"
  >("standard");
  const [showDetails, setShowDetails] = useState(false);

  const optimizedImages = images.map(img => optimizeImageAsset(img, "gallery"));

  const renderImage = (
    image: ImageAsset & { sizes?: string; quality?: number },
    index: number
  ) => {
    const ImageComponent =
      selectedVariant === "progressive" ? ProgressiveImage : OptimizedImage;

    return (
      <motion.div
        key={`${image.src}-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative"
      >
        <div className="relative overflow-hidden rounded-lg bg-muted">
          <ImageComponent
            src={image.src}
            alt={image.alt}
            width={image.width || 600}
            height={image.height || 400}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={image.sizes || undefined}
            priority={index < 2}
          />

          {showOptimizationInfo && (
            <div className="absolute top-2 right-2 space-y-1">
              <Badge variant="secondary" className="text-xs">
                {selectedVariant === "progressive" ? "Progressive" : "Standard"}
              </Badge>
              {image.quality && (
                <Badge variant="outline" className="text-xs">
                  Q{image.quality}
                </Badge>
              )}
            </div>
          )}
        </div>

        {image.caption && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {image.caption}
          </p>
        )}

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 p-3 bg-muted/50 rounded text-xs space-y-1"
          >
            <div>
              Dimensions: {image.width}×{image.height}
            </div>
            {image.sizes && <div>Sizes: {image.sizes}</div>}
            {image.quality && <div>Quality: {image.quality}%</div>}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const gridClasses = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    masonry: "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6",
    carousel: "flex gap-6 overflow-x-auto pb-4",
  };

  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">
            Demonstrating image optimization with Next.js
          </p>
        </div>
      )}

      {showOptimizationInfo && (
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedVariant === "standard" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedVariant("standard")}
          >
            Standard Loading
          </Button>
          <Button
            variant={selectedVariant === "progressive" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedVariant("progressive")}
          >
            Progressive Loading
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide" : "Show"} Details
          </Button>
        </div>
      )}

      <div className={gridClasses[variant]}>
        {optimizedImages.map((image, index) => renderImage(image, index))}
      </div>

      {showOptimizationInfo && (
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            Images are automatically optimized with WebP/AVIF formats,
            responsive sizes, and blur placeholders.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <span>✓ Format optimization (WebP/AVIF)</span>
            <span>✓ Responsive sizing</span>
            <span>✓ Lazy loading</span>
            <span>✓ Blur placeholders</span>
          </div>
        </div>
      )}
    </div>
  );
}
