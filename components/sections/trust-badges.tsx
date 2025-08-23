"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/hooks/use-scroll-animation";

interface TrustBadge {
  name: string;
  logo?: string;
  description: string;
  verified?: boolean;
}

const trustBadges: TrustBadge[] = [
  {
    name: "Master’s Degree (NZ)",
    description: "Master of Information Technology",
    verified: true,
  },
  {
    name: "Meta Certified",
    description: "Full-Stack Engineer, Front-End and Back-End",
    verified: true,
  },
  {
    name: "Oracle Certified",
    description: "Oracle Cloud Infrastructure Foundations",
    verified: true,
  },
  {
    name: "Atlassian Certified",
    description: "Agile with Atlassian Jira",
    verified: true,
  },
];

export function TrustBadges() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-8 py-8">
      <motion.p
        className="text-sm text-muted-foreground/70 uppercase tracking-wider font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Key Highlights
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {trustBadges.map((badge, index) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={prefersReducedMotion ? {} : { y: -5, scale: 1.02 }}
            className="group"
          >
            <div className="relative p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              {badge.verified && (
                <div className="absolute -top-2 -right-2">
                  <Badge
                    variant="default"
                    className="text-xs bg-green-500 hover:bg-green-500"
                  >
                    ✓ Verified
                  </Badge>
                </div>
              )}

              <div className="text-center space-y-2">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {badge.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social Proof Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-border/30 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            6+
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Years Experience
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            12+
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Projects Delivered
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            100%
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Client Satisfaction
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
