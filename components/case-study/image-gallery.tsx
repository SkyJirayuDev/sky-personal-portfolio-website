"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/lib/schemas/content";

interface ImageGalleryProps {
  images: ImageAsset[];
  title?: string;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  enableDownload?: boolean;
}

export function ImageGallery({
  images,
  title = "Project Gallery",
  className,
  columns = 2,
  enableDownload = false,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const openLightbox = useCallback((index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setIsZoomed(false);
    document.body.style.overflow = "unset";
  }, []);

  const navigateImage = useCallback(
    (direction: "prev" | "next") => {
      if (selectedImage === null) return;

      if (direction === "prev") {
        setSelectedImage(
          selectedImage === 0 ? images.length - 1 : selectedImage - 1
        );
      } else {
        setSelectedImage(
          selectedImage === images.length - 1 ? 0 : selectedImage + 1
        );
      }
      setIsZoomed(false);
    },
    [selectedImage, images.length]
  );

  const toggleZoom = useCallback(() => {
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  const downloadImage = useCallback(
    async (imageUrl: string, filename: string) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download image:", error);
      }
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          navigateImage("prev");
          break;
        case "ArrowRight":
          navigateImage("next");
          break;
        case " ":
          e.preventDefault();
          toggleZoom();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, closeLightbox, navigateImage, toggleZoom]);

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <>
      <div className={cn("max-w-6xl mx-auto", className)}>
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12"
          >
            {title}
          </motion.h2>
        )}

        <div className={cn("grid gap-6", gridCols[columns])}>
          {images.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 800}
                  height={image.height || 600}
                  className="w-full h-auto object-cover"
                  enableHover
                />

                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="bg-white/90 dark:bg-black/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>

              {image.caption && (
                <p className="text-sm text-muted-foreground mt-3 text-center leading-relaxed">
                  {image.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && images[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-7xl max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{
                  scale: isZoomed ? 1.5 : 1,
                  cursor: isZoomed ? "zoom-out" : "zoom-in",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={toggleZoom}
                className="relative"
              >
                <OptimizedImage
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  width={images[selectedImage].width || 1200}
                  height={images[selectedImage].height || 800}
                  className="max-w-full max-h-[90vh] object-contain"
                  showLoadingState={false}
                />
              </motion.div>

              {/* Image info and caption */}
              {images[selectedImage].caption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6"
                >
                  <p className="text-center text-sm md:text-base">
                    {images[selectedImage].caption}
                  </p>
                </motion.div>
              )}

              {/* Top toolbar */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="text-white/80 text-sm">
                  {selectedImage + 1} / {images.length}
                </div>

                <div className="flex gap-2">
                  {enableDownload && selectedImage !== null && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => {
                        if (selectedImage !== null && images[selectedImage]) {
                          downloadImage(
                            images[selectedImage].src,
                            `image-${selectedImage + 1}.jpg`
                          );
                        }
                      }}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={toggleZoom}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={closeLightbox}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 transition-all duration-200"
                    onClick={() => navigateImage("prev")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 transition-all duration-200"
                    onClick={() => navigateImage("next")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Keyboard hints */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center">
                <div className="bg-black/40 rounded px-3 py-1">
                  Press ESC to close • ← → to navigate • SPACE to zoom
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
