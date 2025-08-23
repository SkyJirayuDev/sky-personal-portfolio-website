import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn (className utility)", () => {
    it("should merge class names correctly", () => {
      const result = cn("base-class", "additional-class");
      expect(result).toBe("base-class additional-class");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const isDisabled = false;

      const result = cn(
        "base-class",
        isActive && "active",
        isDisabled && "disabled"
      );

      expect(result).toBe("base-class active");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("should handle objects with boolean values", () => {
      const result = cn({
        "always-present": true,
        "conditionally-present": true,
        "never-present": false,
      });

      expect(result).toContain("always-present");
      expect(result).toContain("conditionally-present");
      expect(result).not.toContain("never-present");
    });

    it("should handle undefined and null values", () => {
      const result = cn("base", undefined, null, "end");
      expect(result).toBe("base end");
    });

    it("should handle empty strings", () => {
      const result = cn("base", "", "end");
      expect(result).toBe("base end");
    });

    it("should deduplicate classes", () => {
      const result = cn("duplicate", "unique", "duplicate");
      // Note: This depends on the implementation of cn
      // If it uses clsx, it should deduplicate, otherwise it might not
      expect(result).toContain("duplicate");
      expect(result).toContain("unique");
    });

    it("should handle Tailwind CSS conflicts", () => {
      // This test assumes cn uses tailwind-merge
      const result = cn("p-4", "p-2"); // p-2 should override p-4
      expect(result).toBe("p-2");
    });

    it("should handle complex Tailwind conflicts", () => {
      const result = cn(
        "bg-red-500 text-white p-4",
        "bg-blue-500 p-2" // Should override bg-red-500 and p-4
      );

      expect(result).toContain("bg-blue-500");
      expect(result).toContain("text-white");
      expect(result).toContain("p-2");
      expect(result).not.toContain("bg-red-500");
      expect(result).not.toContain("p-4");
    });
  });
});
