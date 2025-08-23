"use client";

import { motion } from "framer-motion";
import type { ProjectMetric } from "@/lib/schemas/content";

interface MetricsDisplayProps {
  metrics: ProjectMetric[];
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-12"
      >
        Key Results
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
              {metric.value}
            </div>
            <div className="text-lg font-semibold mb-2">{metric.label}</div>
            {metric.description && (
              <div className="text-sm text-muted-foreground">
                {metric.description}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
