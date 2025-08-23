import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { testAccessibility, testAriaAttributes } from "./accessibility-utils";
import { SkipLinks } from "@/components/accessibility/skip-links";
import { AccessibilityProvider } from "@/components/providers/accessibility-provider";
import { Navigation } from "@/components/layout/navigation";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    header: "header",
    button: "button",
    a: "a",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: () => 0,
}));

describe("Accessibility Features", () => {
  describe("SkipLinks", () => {
    it("should render skip links with proper accessibility attributes", async () => {
      await testAccessibility(<SkipLinks />);
    });

    it("should have proper ARIA attributes", () => {
      const { container } = render(<SkipLinks />);
      testAriaAttributes(container);
    });

    it("should render default skip links", () => {
      render(<SkipLinks />);

      expect(screen.getByText("Skip to main content")).toBeInTheDocument();
      expect(screen.getByText("Skip to navigation")).toBeInTheDocument();
      expect(screen.getByText("Skip to footer")).toBeInTheDocument();
    });

    it("should render custom skip links", () => {
      const customLinks = [
        { href: "#custom", label: "Skip to custom section" },
      ];

      render(<SkipLinks links={customLinks} />);
      expect(screen.getByText("Skip to custom section")).toBeInTheDocument();
    });
  });

  describe("AccessibilityProvider", () => {
    it("should provide accessibility context", () => {
      render(
        <AccessibilityProvider>
          <div>Test content</div>
        </AccessibilityProvider>
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should not have accessibility violations", async () => {
      await testAccessibility(
        <AccessibilityProvider>
          <div>Test content</div>
        </AccessibilityProvider>
      );
    });
  });

  describe("Navigation", () => {
    it("should have proper navigation landmarks", () => {
      const { container } = render(<Navigation />);

      const nav = container.querySelector("nav");
      expect(nav).toHaveAttribute("role", "navigation");
      expect(nav).toHaveAttribute("aria-label", "Main navigation");
    });

    it("should have accessible mobile menu button", () => {
      render(<Navigation />);

      const menuButton = screen.getByLabelText("Toggle mobile menu");
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
      expect(menuButton).toHaveAttribute("aria-controls", "mobile-menu");
    });

    it("should not have accessibility violations", async () => {
      await testAccessibility(<Navigation />);
    });
  });

  describe("Focus Management", () => {
    it("should have visible focus indicators", () => {
      render(<SkipLinks />);

      const links = screen.getAllByRole("link");
      links.forEach(link => {
        expect(link).toHaveClass("focus-visible:outline-none");
        expect(link).toHaveClass("focus-visible:ring-2");
      });
    });
  });

  describe("ARIA Labels and Roles", () => {
    it("should have proper heading hierarchy", () => {
      render(
        <div>
          <h1>Main Title</h1>
          <h2>Section Title</h2>
          <h3>Subsection Title</h3>
        </div>
      );

      const h1 = screen.getByRole("heading", { level: 1 });
      const h2 = screen.getByRole("heading", { level: 2 });
      const h3 = screen.getByRole("heading", { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });

    it("should have proper landmark roles", () => {
      render(
        <div>
          <main role="main">Main content</main>
          <nav role="navigation">Navigation</nav>
          <footer role="contentinfo">Footer</footer>
        </div>
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("should have screen reader only content", () => {
      render(
        <div>
          <span className="sr-only">Screen reader only text</span>
          <span>Visible text</span>
        </div>
      );

      const srOnlyText = screen.getByText("Screen reader only text");
      expect(srOnlyText).toHaveClass("sr-only");
    });

    it("should have proper alt text for images", () => {
      render(<img src="/test.jpg" alt="Test image description" />);

      const image = screen.getByAltText("Test image description");
      expect(image).toBeInTheDocument();
    });
  });
});
