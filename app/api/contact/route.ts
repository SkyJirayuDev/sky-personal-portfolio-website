import { NextRequest, NextResponse } from "next/server";
import {
  contactSubmissionSchema,
  contactSuccessSchema,
  contactErrorSchema,
} from "@/lib/schemas/contact";
import { validateWithDetails } from "@/lib/content/validation";

// Use Node.js runtime
export const runtime = "nodejs";

// Email - Resend
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_TO = process.env.CONTACT_TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per window

function getRateLimitKey(ip: string, userAgent: string): string {
  // Create a simple hash of IP + User Agent for rate limiting
  return `${ip}-${userAgent.slice(0, 50)}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (now > record.resetTime) {
    // Reset the window
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client information
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]?.trim() || "unknown"
      : "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Rate limiting
    const rateLimitKey = getRateLimitKey(ip, userAgent);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        contactErrorSchema.parse({
          success: false,
          error: "Too many requests. Please try again later.",
        }),
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Add server-side data
    const submissionData = {
      ...body,
      timestamp: Date.now(),
      userAgent,
      ip,
    };

    // Check honeypot field first (before validation)
    if (submissionData.honeypot && submissionData.honeypot.length > 0) {
      // Silent fail for bots - return success to avoid revealing honeypot
      return NextResponse.json(
        contactSuccessSchema.parse({
          success: true,
          message: "Thank you for your message! I'll get back to you soon.",
          timestamp: Date.now(),
        })
      );
    }

    // Validate the submission (excluding honeypot from validation)
    const validation = validateWithDetails(
      submissionData,
      contactSubmissionSchema
    );

    if (!validation.success) {
      return NextResponse.json(
        contactErrorSchema.parse({
          success: false,
          error: "Validation failed",
          details: validation.errors.map(error => ({
            field: error.field,
            message: error.message,
          })),
        }),
        { status: 400 }
      );
    }

    const validData = validation.data!;

    // Ensure email envs exist
    if (!process.env.RESEND_API_KEY || !CONTACT_TO) {
      console.error("Email env missing", {
        hasKey: !!process.env.RESEND_API_KEY,
        hasTo: !!CONTACT_TO,
      });
      return NextResponse.json(
        contactErrorSchema.parse({
          success: false,
          error: "Email service is not configured.",
        }),
        { status: 500 }
      );
    }

    // Build email content
    const subject = `New contact from ${validData.name}`;
    const text = [
      `Name: ${validData.name}`,
      `Email: ${validData.email}`,
      validData.company ? `Company: ${validData.company}` : null,
      `IP: ${validData.ip}`,
      `User-Agent: ${validData.userAgent}`,
      `When: ${new Date(validData.timestamp).toISOString()}`,
      "",
      "Message:",
      validData.message,
    ]
      .filter(Boolean)
      .join("\n");

    // Send email via Resend
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: CONTACT_TO,
        subject,
        text,
        // Let you click Reply and respond to the sender
        replyTo: validData.email,
      });
    } catch (err) {
      console.error("Email send failed:", err);
      return NextResponse.json(
        contactErrorSchema.parse({
          success: false,
          error: "Could not send email at this time.",
        }),
        { status: 502 }
      );
    }

    // For now, we'll just log the message (in production, use proper logging)
    console.log("Contact form submission:", {
      name: validData.name,
      email: validData.email,
      company: validData.company,
      message: validData.message,
      timestamp: new Date(validData.timestamp).toISOString(),
      ip: validData.ip,
    });

    // Clean up old rate limit entries periodically
    if (Math.random() < 0.1) {
      // 10% chance
      cleanupRateLimit();
    }

    // Return success response
    return NextResponse.json(
      contactSuccessSchema.parse({
        success: true,
        message: "Thank you for your message! I'll get back to you soon.",
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      contactErrorSchema.parse({
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
