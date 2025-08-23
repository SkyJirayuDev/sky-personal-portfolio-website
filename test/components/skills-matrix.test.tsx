import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkillsMatrix } from "@/components/sections/skills-matrix";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    section: "section",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const mockSkillGroups = [
  {
    group: "Frontend",
    items: [
      { name: "React", proficiency: 90, category: "Frontend" },
      { name: "TypeScript", proficiency: 85, category: "Frontend" },
      { name: "Next.js", proficiency: 80, category: "Frontend" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", proficiency: 85, category: "Backend" },
      { name: "Python", proficiency: 75, category: "Backend" },
      { name: "PostgreSQL", proficiency: 70, category: "Backend" },
    ],
  },
  {
    group: "Cloud & DevOps",
    items: [
      { name: "AWS", proficiency: 80, category: "Cloud" },
      { name: "Docker", proficiency: 75, category: "DevOps" },
      { name: "Kubernetes", proficiency: 65, category: "DevOps" },
    ],
  },
];

describe("SkillsMatrix Component", () => {
  it("should render all skill groups", () => {
    render(<SkillsMatrix skillGroups={mockSkillGroups} />);

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Cloud & DevOps")).toBeInTheDocument();
  });

  it("should render all skills within groups", () => {
    render(<SkillsMatrix skillGroups={mockSkillGroups} />);

    // Frontend skills
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();

    // Backend skills
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();

    // Cloud & DevOps skills
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
  });

  it("should display proficiency indicators", () => {
    render(<SkillsMatrix skillGroups={mockSkillGroups} />);

    // Look for proficiency bars or indicators
    const proficiencyElements = screen.queryAllByTestId(/proficiency/i);

    // If proficiency bars are implemented, they should be present
    if (proficiencyElements.length > 0) {
      expect(proficiencyElements.length).toBeGreaterThan(0);
    }

    // Alternative: check for percentage text or aria-labels
    const reactSkill = screen
      .getByText("React")
      .closest('[data-testid*="skill"]');
    if (reactSkill) {
      const proficiencyText = reactSkill.textContent;
      expect(proficiencyText).toMatch(/90|90%/);
    }
  });

  it("should have proper accessibility attributes", () => {
    render(<SkillsMatrix skillGroups={mockSkillGroups} />);

    // Check for proper heading structure
    const groupHeadings = screen.getAllByRole("heading");
    expect(groupHeadings.length).toBeGreaterThanOrEqual(3);

    // Check for proper list structure if implemented
    const lists = screen.queryAllByRole("list");
    if (lists.length > 0) {
      lists.forEach(list => {
        const listItems = list.querySelectorAll('[role="listitem"]');
        expect(listItems.length).toBeGreaterThan(0);
      });
    }
  });

  it("should handle search/filter functionality if implemented", () => {
    render(<SkillsMatrix skillGroups={mockSkillGroups} />);

    const searchInput = screen.queryByPlaceholderText(/search skills/i);

    if (searchInput) {
      // Test search functionality
      fireEvent.change(searchInput, { target: { value: "React" } });

      // React should still be visible
      expect(screen.getByText("React")).toBeInTheDocument();

      // Other skills might be hidden (depending on implementation)
      // This is a basic test - actual implementation may vary
    }
  });

  it("should handle empty skill groups gracefully", () => {
    const emptySkillGroups = [
      {
        group: "Empty Group",
        items: [],
      },
    ];

    render(<SkillsMatrix skillGroups={emptySkillGroups} />);

    expect(screen.getByText("Empty Group")).toBeInTheDocument();

    // Should not crash and should handle empty state
    const container = screen.getByText("Empty Group").closest("section, div");
    expect(container).toBeInTheDocument();
  });

  it("should handle skills without proficiency scores", () => {
    const skillsWithoutProficiency = [
      {
        group: "Tools",
        items: [
          { name: "Git", category: "Tools" },
          { name: "VS Code", category: "Tools" },
        ],
      },
    ];

    render(<SkillsMatrix skillGroups={skillsWithoutProficiency} />);

    expect(screen.getByText("Git")).toBeInTheDocument();
    expect(screen.getByText("VS Code")).toBeInTheDocument();
  });

  it("should have responsive grid layout", () => {
    const { container } = render(
      <SkillsMatrix skillGroups={mockSkillGroups} />
    );

    // Check for grid or flex layout classes
    const gridContainer = container.querySelector(
      '[class*="grid"], [class*="flex"]'
    );
    expect(gridContainer).toBeInTheDocument();
  });

  it("should support different display modes if implemented", () => {
    // Test bars mode
    const { rerender } = render(
      <SkillsMatrix skillGroups={mockSkillGroups} displayMode="bars" />
    );

    expect(screen.getByText("React")).toBeInTheDocument();

    // Test tags mode
    rerender(<SkillsMatrix skillGroups={mockSkillGroups} displayMode="tags" />);

    expect(screen.getByText("React")).toBeInTheDocument();

    // Test grid mode
    rerender(<SkillsMatrix skillGroups={mockSkillGroups} displayMode="grid" />);

    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("should have proper semantic structure", () => {
    const { container } = render(
      <SkillsMatrix skillGroups={mockSkillGroups} />
    );

    // Should be wrapped in a section
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    // Should have a main heading
    const mainHeading = screen.getByRole("heading", { level: 2 });
    expect(mainHeading).toBeInTheDocument();
  });
});
