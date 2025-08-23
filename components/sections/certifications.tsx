"use client";

import { motion } from "framer-motion";
import { ExternalLink, Calendar, Award, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-scroll-animation";
import type { Certification } from "@/lib/schemas/content";

interface CertificationsProps {
  certifications: Certification[];
  className?: string;
}

export function Certifications({
  certifications,
  className,
}: CertificationsProps) {
  return (
    <section id="certifications" className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Certifications & Credentials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional certifications that validate my expertise across cloud
            platforms, development frameworks, and industry best practices.
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((certification, index) => (
            <CertificationCard
              key={`${certification.issuer}-${certification.name}`}
              certification={certification}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CertificationCardProps {
  certification: Certification;
  index: number;
}

function CertificationCard({ certification, index }: CertificationCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getIssuerLogo = (issuer: string) => {
    // You could extend this to return actual logo components or images
    const issuerMap: Record<string, string> = {
      Meta: "🔵",
      Oracle: "🔴",
      "Amazon Web Services": "🟠",
      "Google Cloud": "🟡",
      Microsoft: "🟢",
    };
    return issuerMap[issuer] || "🏆";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -4 }}
      className="group relative p-6 rounded-lg border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getIssuerLogo(certification.issuer)}</div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {certification.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {certification.issuer}
            </p>
          </div>
        </div>

        {/* Verification Badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
          className="flex-shrink-0"
        >
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>Verified</span>
          </div>
        </motion.div>
      </div>

      {/* Description */}
      {certification.description && (
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {certification.description}
        </p>
      )}

      {/* Date and Credential ID */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 text-sm text-muted-foreground">
        {certification.date && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Earned {formatDate(certification.date)}</span>
          </div>
        )}
        {certification.credential_id && (
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span className="font-mono text-xs">
              ID: {certification.credential_id}
            </span>
          </div>
        )}
      </div>

      {/* Skills */}
      {certification.skills && certification.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Skills Validated
          </h4>
          <div className="flex flex-wrap gap-2">
            {certification.skills.map((skill, skillIndex) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1 + skillIndex * 0.02 + 0.5,
                }}
              >
                <Badge variant="outline" className="text-xs">
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Verify Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
      >
        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
          onClick={() =>
            window.open(certification.url, "_blank", "noopener,noreferrer")
          }
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Verify Credential
        </Button>
      </motion.div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
