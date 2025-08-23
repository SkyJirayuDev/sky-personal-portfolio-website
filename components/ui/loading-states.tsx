import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function HeroSkeleton() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="space-y-2">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </motion.div>
      <motion.div variants={staggerItem} className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </motion.div>
      <motion.div variants={staggerItem} className="flex space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </motion.div>
    </motion.div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="p-6 border border-border rounded-lg space-y-4"
    >
      <motion.div variants={staggerItem} className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </motion.div>
      <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </motion.div>
      <motion.div
        variants={staggerItem}
        className="flex justify-between items-center"
      >
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </motion.div>
    </motion.div>
  );
}

export function SkillGroupSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceItemSkeleton() {
  return (
    <div className="flex space-x-4">
      <div className="flex flex-col items-center">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-16 w-0.5" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function ContactFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Navigation skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="h-8 w-8" />
            <div className="hidden md:flex space-x-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-16" />
              ))}
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9 md:hidden" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-16">
            {/* Hero section */}
            <section className="py-12">
              <HeroSkeleton />
            </section>

            {/* Skills section */}
            <section className="py-12">
              <div className="space-y-8">
                <Skeleton className="h-8 w-48 mx-auto" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SkillGroupSkeleton />
                  <SkillGroupSkeleton />
                </div>
              </div>
            </section>

            {/* Projects section */}
            <section className="py-12">
              <div className="space-y-8">
                <Skeleton className="h-8 w-48 mx-auto" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
