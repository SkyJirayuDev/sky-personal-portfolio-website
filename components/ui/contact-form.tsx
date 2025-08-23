"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  contactFormSchema,
  type ContactFormData,
  type ContactResponse,
} from "@/lib/schemas/contact";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
  className?: string;
  onSuccess?: (data: ContactFormData) => void;
  onError?: (error: string) => void;
}

export function ContactForm({
  className = "",
  onSuccess,
  onError,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      honeypot: "", // Hidden honeypot field
    },
  });

  const watchedFields = watch();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ContactResponse = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(result.message);
        reset(); // Clear form on success
        onSuccess?.(data);
      } else {
        setSubmitStatus("error");
        setSubmitMessage(result.error);
        onError?.(result.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "Network error. Please check your connection and try again."
      );
      onError?.("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: keyof ContactFormData) => {
    return errors[fieldName]?.message;
  };

  const isFieldValid = (fieldName: keyof ContactFormData) => {
    return (
      !errors[fieldName] &&
      watchedFields[fieldName] &&
      watchedFields[fieldName].length > 0
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-2xl mx-auto ${className}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Honeypot field - hidden from users */}
        <input
          {...register("honeypot")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0,
          }}
          aria-hidden="true"
        />

        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Name *
          </label>
          <div className="relative">
            <input
              {...register("name")}
              type="text"
              id="name"
              autoComplete="name"
              className={`
                w-full px-4 py-3 rounded-lg border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${
                  getFieldError("name")
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : isFieldValid("name")
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                }
                text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
              `}
              placeholder="Your full name"
              aria-invalid={!!getFieldError("name")}
              aria-describedby={
                getFieldError("name") ? "name-error" : undefined
              }
            />
            {isFieldValid("name") && (
              <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
            )}
          </div>
          <AnimatePresence>
            {getFieldError("name") && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                id="name-error"
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {getFieldError("name")}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Email *
          </label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              id="email"
              autoComplete="email"
              className={`
                w-full px-4 py-3 rounded-lg border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${
                  getFieldError("email")
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : isFieldValid("email")
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                }
                text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
              `}
              placeholder="your.email@example.com"
              aria-invalid={!!getFieldError("email")}
              aria-describedby={
                getFieldError("email") ? "email-error" : undefined
              }
            />
            {isFieldValid("email") && (
              <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
            )}
          </div>
          <AnimatePresence>
            {getFieldError("email") && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                id="email-error"
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {getFieldError("email")}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Company Field (Optional) */}
        <div className="space-y-2">
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Company <span className="text-gray-500 text-xs">(optional)</span>
          </label>
          <div className="relative">
            <input
              {...register("company")}
              type="text"
              id="company"
              autoComplete="organization"
              className={`
                w-full px-4 py-3 rounded-lg border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${
                  getFieldError("company")
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : isFieldValid("company")
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                }
                text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
              `}
              placeholder="Your company name"
              aria-invalid={!!getFieldError("company")}
              aria-describedby={
                getFieldError("company") ? "company-error" : undefined
              }
            />
            {isFieldValid("company") && (
              <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
            )}
          </div>
          <AnimatePresence>
            {getFieldError("company") && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                id="company-error"
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {getFieldError("company")}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Message *
          </label>
          <div className="relative">
            <textarea
              {...register("message")}
              id="message"
              rows={6}
              className={`
                w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-vertical
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${
                  getFieldError("message")
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : isFieldValid("message")
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                }
                text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
              `}
              placeholder="Tell me about your project, question, or how I can help you..."
              aria-invalid={!!getFieldError("message")}
              aria-describedby={
                getFieldError("message") ? "message-error" : undefined
              }
            />
            {isFieldValid("message") && (
              <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
            )}
          </div>
          <div className="flex justify-between items-center">
            <AnimatePresence>
              {getFieldError("message") && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  id="message-error"
                  className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {getFieldError("message")}
                </motion.p>
              )}
            </AnimatePresence>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {watchedFields.message?.length || 0}/2000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isValid || !isDirty || isSubmitting}
            className={`
              w-full py-3 px-6 rounded-lg font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isSubmitting
                  ? "bg-blue-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }
              text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
            `}
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Message
                </>
              )}
            </span>
          </Button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                p-4 rounded-lg border flex items-center gap-3
                ${
                  submitStatus === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                }
              `}
            >
              {submitStatus === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{submitMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
