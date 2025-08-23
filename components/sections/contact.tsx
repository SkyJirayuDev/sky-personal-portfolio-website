"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Send } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { type ContactFormData } from "@/lib/schemas/contact";

interface ContactSectionProps {
  className?: string;
}

export function ContactSection({ className = "" }: ContactSectionProps) {
  const handleFormSuccess = (data: ContactFormData) => {
    // Track successful form submission (analytics)
    console.log("Form submitted successfully:", data.name, data.email);

    // You could add analytics tracking here
    // analytics.track('contact_form_submitted', { name: data.name, company: data.company });
  };

  const handleFormError = (error: string) => {
    // Track form errors (analytics)
    console.error("Form submission error:", error);

    // You could add error tracking here
    // analytics.track('contact_form_error', { error });
  };

  return (
    <section
      id="contact"
      className={`py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${className}`}
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h2
              id="contact-heading"
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              Let&apos;s Work Together
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have a project in mind or want to discuss opportunities? I&apos;d
            love to hear from you and explore how we can create something
            amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Get In Touch
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Experienced full-stack software and web platform engineer with
                focus on Cloud and AI. I build scalable, high-performance web
                applications and modern developer workflows. Open to full-time
                and contract. Remote or hybrid. Based in Auckland, NZ. I reply
                within 24 hours.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Email
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    I typically respond within 24 hours
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-shrink-0">
                  <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Response Time & Availability
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Usually within 24 hours, often much sooner
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Open to full-time and contract. Start date flexible
                  </p>
                </div>
              </motion.div>
            </div>

            {/* What to Include */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                What to include in your message:
              </h4>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                <li>Role title and team, plus the business objective</li>
                <li>Core tech stack and scope of responsibilities</li>
                <li>
                  Employment type, location or work model, and target start date
                </li>
                <li>Compensation range and interview timeline</li>
                <li>Link to the job description and primary contact details</li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <ContactForm
              onSuccess={handleFormSuccess}
              onError={handleFormError}
              className="w-full"
            />
          </motion.div>
        </div>

        {/* Additional Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300">
            Prefer a different way to connect? Find me on{" "}
            <a
              href="https://www.linkedin.com/in/skyjirayu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              aria-label="View LinkedIn profile (opens in new tab)"
            >
              LinkedIn
            </a>{" "}
            or check out my work on{" "}
            <a
              href="https://github.com/SkyJirayuDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              aria-label="View GitHub profile (opens in new tab)"
            >
              GitHub
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
