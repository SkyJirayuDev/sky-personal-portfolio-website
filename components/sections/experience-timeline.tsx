"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-scroll-animation";
import type { Experience } from "@/lib/schemas/content";

interface ExperienceTimelineProps {
  experiences: Experience[];
  className?: string;
}

export function ExperienceTimeline({
  experiences,
  className,
}: ExperienceTimelineProps) {
  return (
    <section
      id="experience"
      className={cn("py-16 md:py-24", className)}
      aria-labelledby="experience-heading"
    >
      <div className="container mx-auto px-6 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="experience-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Professional Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A journey through my professional career, highlighting key roles,
            achievements, and the impact I&apos;ve made at each organization.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:transform md:-translate-x-0.5"
            aria-hidden="true"
          />

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <ExperienceItem
                key={`${experience.company}-${experience.role}`}
                experience={experience}
                index={index}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ExperienceItemProps {
  experience: Experience;
  index: number;
  isEven: boolean;
}

function ExperienceItem({ experience, index, isEven }: ExperienceItemProps) {
  const prefersReducedMotion = useReducedMotion();

  const isPresent = (v?: string | null) =>
    !!v && /^(present|current|now)$/i.test(v.trim());

  const safeParseDate = (v?: string | null): Date | undefined => {
    if (!v || isPresent(v)) return undefined;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString || isPresent(dateString)) return "Present";
    const d = safeParseDate(dateString);
    return d
      ? d.toLocaleDateString("en-US", { year: "numeric", month: "short" })
      : "Unknown";
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = safeParseDate(startDate);
    const end = safeParseDate(endDate) ?? new Date();
    if (!start) return "";

    let months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (months < 0) months = 0;

    if (months < 12) return `${months} month${months !== 1 ? "s" : ""}`;

    const years = Math.floor(months / 12);
    const remaining = months % 12;
    if (remaining === 0) return `${years} year${years !== 1 ? "s" : ""}`;
    return `${years} year${years !== 1 ? "s" : ""} ${remaining} month${
      remaining !== 1 ? "s" : ""
    }`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "relative flex items-center",
        "md:justify-center",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
        className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10 md:transform md:-translate-x-1/2"
      />

      {/* Content Card */}
      <motion.div
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        transition={prefersReducedMotion ? {} : { duration: 0.2 }}
        className={cn(
          "ml-12 md:ml-0 w-full md:w-5/12 p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300",
          "hover:border-primary/20"
        )}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-foreground mb-1">
            {experience.role}
          </h3>
          <h4 className="text-lg font-medium text-primary mb-2">
            {experience.company}
          </h4>

          {/* Date and Location */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(experience.startDate)} -{" "}
                {experience.endDate
                  ? formatDate(experience.endDate)
                  : "Present"}
              </span>
              <span className="text-xs">
                ({calculateDuration(experience.startDate, experience.endDate)})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{experience.location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {experience.description}
        </p>

        {/* Key Achievements */}
        <div className="mb-4">
          <h5 className="font-medium text-foreground mb-2 flex items-center gap-1">
            <ChevronRight className="w-4 h-4" />
            Key Achievements
          </h5>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, achievementIndex) => (
              <motion.li
                key={achievementIndex}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1 + achievementIndex * 0.05 + 0.5,
                }}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{achievement}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        {/* {experience.tech && experience.tech.length > 0 && (
          <div>
            <h5 className="font-medium text-foreground mb-2 text-sm">
              Technologies Used
            </h5>
            <div className="flex flex-wrap gap-2">
              {experience.tech.map((tech, techIndex) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1 + techIndex * 0.02 + 0.7,
                  }}
                >
                  <Badge variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )} */}
      </motion.div>

      {/* Spacer for desktop layout */}
      <div className="hidden md:block w-5/12" />
    </motion.div>
  );
}
