import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),

  company: z
    .string()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),

  // Honeypot field for spam protection (checked manually in API)
  honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Server-side validation schema (includes additional fields)
export const contactSubmissionSchema = contactFormSchema.extend({
  timestamp: z.number(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
});

export type ContactSubmissionData = z.infer<typeof contactSubmissionSchema>;

// Response schemas
export const contactSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  timestamp: z.number(),
});

export const contactErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      })
    )
    .optional(),
});

export type ContactResponse =
  | z.infer<typeof contactSuccessSchema>
  | z.infer<typeof contactErrorSchema>;
