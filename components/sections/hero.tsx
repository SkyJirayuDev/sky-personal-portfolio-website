"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import { TrustBadges } from "./trust-badges";
import { MagneticButton } from "../ui/magnetic-button";
import { CopyToClipboard } from "../ui/copy-to-clipboard";
import type { ProfileData } from "@/lib/schemas/content";

interface HeroProps {
  profile: ProfileData;
}

export function Hero({ profile }: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Debug: Log profile data
  console.log("Profile data:", profile);
  console.log("Profile image:", profile.profileImage);

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pb-16 md:pb-24"
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center min-h-[85vh] py-8 lg:py-0">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left lg:pr-8 order-2 lg:order-1 px-4 lg:px-0"
            >
              {/* Animated Name and Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <motion.h1
                  id="hero-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {profile.name}
                </motion.h1>

                <motion.div
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <AnimatedTitle title={profile.title} />
                </motion.div>

                <motion.p
                  className="text-lg text-muted-foreground/80 flex items-center justify-center lg:justify-start gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  📍 {profile.location}
                </motion.p>
              </motion.div>

              {/* Bio/Value Proposition */}
              <motion.p
                className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {profile.bio}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <MagneticButton
                  href="#contact"
                  variant="default"
                  size="lg"
                  className="group"
                >
                  <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Get In Touch
                </MagneticButton>

                <MagneticButton
                  href={profile.links.resume}
                  variant="outline"
                  size="lg"
                  external
                  className="group"
                >
                  <ExternalLink className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  View Resume
                </MagneticButton>
              </motion.div>

              {/* Contact Links */}
              <motion.div
                className="flex items-center justify-center lg:justify-start gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <CopyToClipboard
                  text={profile.links.email}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">
                    {profile.links.email}
                  </span>
                </CopyToClipboard>

                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-1"
                  aria-label="View GitHub profile (opens in new tab)"
                >
                  <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-1"
                  aria-label="View LinkedIn profile (opens in new tab)"
                >
                  <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
              </motion.div>
            </motion.div>

            {/* Right Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center lg:justify-end order-1 lg:order-2"
            >
              <div className="relative">
                {/* Profile Image Container */}
                <motion.div
                  className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] xl:w-[450px] xl:h-[450px] mx-auto"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background Decorative Elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl transform -translate-x-4 translate-y-4" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-secondary/20 to-secondary/5 rounded-full blur-2xl transform translate-x-4 -translate-y-4" />

                  {/* Main Image */}
                  <div className="profile-image-container relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl bg-gradient-to-br from-muted/50 to-muted/20">
                    <img
                      src="/images/profile.png"
                      alt={`${profile.name} - Profile Photo`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "40% 50%" }}
                      onError={e => {
                        console.log(
                          "Image failed to load: /images/profile.png"
                        );
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/profile-placeholder.svg";
                      }}
                      onLoad={() => {
                        console.log(
                          "Image loaded successfully: /images/profile.png"
                        );
                      }}
                    />
                    {/* Fallback placeholder */}
                    <div
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5"
                      style={{ display: "none" }}
                    >
                      <div className="text-6xl md:text-7xl lg:text-8xl text-primary/30">
                        {profile.name.charAt(0)}
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-6 -left-6 w-12 h-12 bg-secondary/20 rounded-full blur-sm"
                    animate={{
                      y: [0, 10, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Trust Badges - Centered below both columns */}
          <motion.div
            className="text-center mt-8 sm:mt-12 md:mt-16 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <TrustBadges />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-2/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Animated Title Component
function AnimatedTitle({ title }: { title: string }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < title.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + title[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [currentIndex, title]);

  return (
    <span className="font-medium">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-6 bg-primary ml-1"
      />
    </span>
  );
}
