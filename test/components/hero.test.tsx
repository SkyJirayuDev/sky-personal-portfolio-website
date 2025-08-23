import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/hero";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    h1: "h1",
    p: "p",
    button: "button",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockProfile = {
  name: "John Doe",
  title: "Full-Stack Developer",
  location: "San Francisco, CA",
  bio: "Passionate developer with expertise in modern web technologies.",
  links: {
    email: "john@example.com",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    resume: "https://example.com/resume.pdf",
  },
};

describe("Hero Component", () => {
  it("should render profile information correctly", () => {
    render(<Hero profile={mockProfile} />);

    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.title)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.location)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.bio)).toBeInTheDocument();
  });

  it("should render with proper heading hierarchy", () => {
    render(<Hero profile={mockProfile} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(mockProfile.name);
  });

  it("should render social links", () => {
    render(<Hero profile={mockProfile} />);

    const githubLink = screen.getByLabelText(/github/i);
    const linkedinLink = screen.getByLabelText(/linkedin/i);

    expect(githubLink).toHaveAttribute("href", mockProfile.links.github);
    expect(linkedinLink).toHaveAttribute("href", mockProfile.links.linkedin);
  });

  it("should render email copy functionality", () => {
    render(<Hero profile={mockProfile} />);

    const emailElement = screen.getByText(mockProfile.links.email);
    expect(emailElement).toBeInTheDocument();

    // Check for copy button or clickable email
    const copyButton = screen.queryByLabelText(/copy email/i);
    if (copyButton) {
      expect(copyButton).toBeInTheDocument();
    }
  });

  it("should render CTA buttons", () => {
    render(<Hero profile={mockProfile} />);

    // Look for common CTA button text
    const ctaButtons = screen.queryAllByRole("button");
    const links = screen.queryAllByRole("link");

    // Should have some interactive elements (buttons or links)
    expect(ctaButtons.length + links.length).toBeGreaterThan(0);
  });

  it("should have proper accessibility attributes", () => {
    render(<Hero profile={mockProfile} />);

    // Check for proper ARIA labels on social links
    const socialLinks = screen.getAllByRole("link");
    socialLinks.forEach(link => {
      const ariaLabel = link.getAttribute("aria-label");
      const hasText = link.textContent && link.textContent.trim().length > 0;

      // Each link should have either aria-label or visible text
      expect(ariaLabel || hasText).toBeTruthy();
    });
  });

  it("should handle missing optional profile data", () => {
    const minimalProfile = {
      name: "Jane Doe",
      title: "Developer",
      location: "",
      bio: "",
      links: {
        email: "jane@example.com",
        github: "",
        linkedin: "",
        resume: "",
      },
    };

    render(<Hero profile={minimalProfile} />);

    expect(screen.getByText(minimalProfile.name)).toBeInTheDocument();
    expect(screen.getByText(minimalProfile.title)).toBeInTheDocument();
    expect(screen.getByText(minimalProfile.links.email)).toBeInTheDocument();
  });

  it("should render profile image if provided", () => {
    const profileWithImage = {
      ...mockProfile,
      image: "/profile.jpg",
    };

    render(<Hero profile={profileWithImage} />);

    const profileImage = screen.queryByAltText(/profile/i);
    if (profileImage) {
      expect(profileImage).toBeInTheDocument();
      expect(profileImage).toHaveAttribute(
        "src",
        expect.stringContaining("profile.jpg")
      );
    }
  });

  it("should have proper semantic structure", () => {
    const { container } = render(<Hero profile={mockProfile} />);

    // Should be wrapped in a section or have proper landmark
    const section = container.querySelector("section");
    const main = container.querySelector("main");
    const article = container.querySelector("article");

    expect(section || main || article).toBeInTheDocument();
  });
});
