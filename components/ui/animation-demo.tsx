"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { MagneticButton } from "./magnetic-button";
import {
  ScrollReveal,
  ScrollFadeIn,
  ScrollSlideLeft,
  ScrollSlideRight,
  ScrollScale,
} from "./scroll-reveal";
import { StaggeredList, StaggeredGrid } from "./staggered-list";
import { Badge } from "./badge";
// Card component import removed - using div instead
import { staggerContainer, staggerItem } from "@/lib/animations";

/**
 * Demo component showcasing all animation features
 * This component demonstrates the various animation utilities and components
 * available in the portfolio platform.
 */
export function AnimationDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const demoItems = [
    "Scroll-triggered animations",
    "Magnetic button interactions",
    "Staggered list reveals",
    "Hover micro-interactions",
    "Reduced motion support",
    "Page transitions",
  ];

  const demoCards = [
    { title: "Performance", description: "Lightning fast animations" },
    { title: "Accessibility", description: "Respects user preferences" },
    { title: "Smooth", description: "Buttery smooth transitions" },
    { title: "Interactive", description: "Engaging micro-interactions" },
  ];

  return (
    <div className="space-y-16 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Animation System Demo</h2>
        <p className="text-muted-foreground mb-8">
          Showcasing the comprehensive animation system with scroll triggers,
          magnetic interactions, and accessibility support.
        </p>

        <Button onClick={() => setShowDemo(!showDemo)} className="mb-8">
          {showDemo ? "Hide Demo" : "Show Demo"}
        </Button>
      </div>

      {showDemo && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-16"
        >
          {/* Basic Scroll Reveals */}
          <section className="space-y-8">
            <motion.h3
              variants={staggerItem}
              className="text-2xl font-semibold text-center"
            >
              Scroll Reveal Animations
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScrollFadeIn>
                <div className="p-6 bg-card border rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Fade In Up</h4>
                  <p className="text-sm text-muted-foreground">
                    Classic fade and slide animation
                  </p>
                </div>
              </ScrollFadeIn>

              <ScrollSlideLeft>
                <div className="p-6 bg-card border rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Slide Left</h4>
                  <p className="text-sm text-muted-foreground">
                    Slides in from the left
                  </p>
                </div>
              </ScrollSlideLeft>

              <ScrollSlideRight>
                <div className="p-6 bg-card border rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Slide Right</h4>
                  <p className="text-sm text-muted-foreground">
                    Slides in from the right
                  </p>
                </div>
              </ScrollSlideRight>

              <ScrollScale>
                <div className="p-6 bg-card border rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Scale In</h4>
                  <p className="text-sm text-muted-foreground">
                    Scales up from center
                  </p>
                </div>
              </ScrollScale>
            </div>
          </section>

          {/* Magnetic Buttons */}
          <section className="space-y-8">
            <ScrollReveal>
              <h3 className="text-2xl font-semibold text-center">
                Magnetic Button Interactions
              </h3>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="flex flex-wrap justify-center gap-4">
                <MagneticButton variant="default">
                  Primary Magnetic
                </MagneticButton>
                <MagneticButton variant="outline">
                  Outline Magnetic
                </MagneticButton>
                <MagneticButton variant="secondary" magneticStrength={0.5}>
                  Strong Magnetic
                </MagneticButton>
              </div>
            </ScrollReveal>
          </section>

          {/* Staggered Lists */}
          <section className="space-y-8">
            <ScrollReveal>
              <h3 className="text-2xl font-semibold text-center">
                Staggered Animations
              </h3>
            </ScrollReveal>

            <StaggeredList className="space-y-4">
              {demoItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-card border rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{item}</span>
                  <Badge variant="secondary" className="ml-auto">
                    Item {index + 1}
                  </Badge>
                </div>
              ))}
            </StaggeredList>
          </section>

          {/* Staggered Grid */}
          <section className="space-y-8">
            <ScrollReveal>
              <h3 className="text-2xl font-semibold text-center">
                Staggered Grid Layout
              </h3>
            </ScrollReveal>

            <StaggeredGrid columns={2} className="max-w-4xl mx-auto">
              {demoCards.map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-card border rounded-lg hover-glow cursor-pointer"
                >
                  <h4 className="font-semibold mb-2">{card.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </StaggeredGrid>
          </section>

          {/* Hover Effects */}
          <section className="space-y-8">
            <ScrollReveal>
              <h3 className="text-2xl font-semibold text-center">
                Hover Micro-interactions
              </h3>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div
                  className="p-6 bg-card border rounded-lg text-center hover-lift cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="font-semibold mb-2">Hover Lift</h4>
                  <p className="text-sm text-muted-foreground">
                    Lifts up on hover
                  </p>
                </motion.div>

                <motion.div
                  className="p-6 bg-card border rounded-lg text-center hover-scale cursor-pointer"
                  whileHover={{ rotate: 2 }}
                >
                  <h4 className="font-semibold mb-2">Hover Rotate</h4>
                  <p className="text-sm text-muted-foreground">
                    Slight rotation on hover
                  </p>
                </motion.div>

                <motion.div
                  className="p-6 bg-card border rounded-lg text-center hover-glow cursor-pointer"
                  whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                >
                  <h4 className="font-semibold mb-2">Hover Glow</h4>
                  <p className="text-sm text-muted-foreground">
                    Glowing shadow effect
                  </p>
                </motion.div>
              </div>
            </ScrollReveal>
          </section>

          {/* Accessibility Note */}
          <ScrollReveal>
            <div className="bg-muted/50 p-6 rounded-lg text-center max-w-2xl mx-auto">
              <h4 className="font-semibold mb-2">♿ Accessibility First</h4>
              <p className="text-sm text-muted-foreground">
                All animations respect the user&apos;s{" "}
                <code>prefers-reduced-motion</code> setting. Users who prefer
                reduced motion will see simplified, faster animations or no
                animations at all.
              </p>
            </div>
          </ScrollReveal>
        </motion.div>
      )}
    </div>
  );
}
