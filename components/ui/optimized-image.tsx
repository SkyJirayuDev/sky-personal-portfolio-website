"use client";

import { useState, forwardRef } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface OptimizedImageProps extends Omit<ImageProps, "placeholder"> {
  className?: string;
  containerClassName?: string;
  showLoadingState?: boolean;
  enableHover?: boolean;
  blurDataURL?: string;
}

// Default blur placeholder - a minimal 1x1 transparent image
const DEFAULT_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(
  (
    {
      className,
      containerClassName,
      showLoadingState = true,
      enableHover = false,
      blurDataURL = DEFAULT_BLUR_DATA_URL,
      alt,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", containerClassName)}
      >
        {/* Loading skeleton */}
        {showLoadingState && isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse rounded-md" />
        )}

        {/* Error state */}
        {hasError ? (
          <div className="absolute inset-0 bg-muted rounded-md flex items-center justify-center">
            <div className="text-muted-foreground text-sm text-center p-4">
              <div className="w-8 h-8 mx-auto mb-2 opacity-50">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              Failed to load image
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className={enableHover ? "group" : ""}
          >
            <Image
              {...props}
              alt={alt}
              className={cn(
                "transition-all duration-300",
                enableHover && "group-hover:scale-105",
                className
              )}
              placeholder="blur"
              blurDataURL={blurDataURL}
              onLoad={handleLoad}
              onError={handleError}
              quality={85}
              priority={props.priority || false}
            />
          </motion.div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";
