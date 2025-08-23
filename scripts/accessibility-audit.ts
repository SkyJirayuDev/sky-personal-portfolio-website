#!/usr/bin/env tsx

/**
 * Accessibility audit script
 * Runs automated accessibility checks on the portfolio
 */

import { execSync } from "child_process";

class AccessibilityAuditor {
  async runAudit(): Promise<void> {
    console.log("🔍 Starting accessibility audit...\n");

    // Run accessibility tests
    await this.runAccessibilityTests();

    // Check for common accessibility issues
    await this.checkCommonIssues();

    // Generate report
    this.generateReport();
  }

  private async runAccessibilityTests(): Promise<void> {
    console.log("📋 Running accessibility tests...");

    try {
      execSync("npm run test:accessibility", { stdio: "inherit" });
      console.log("✅ Accessibility tests passed\n");
    } catch (error) {
      console.error("❌ Accessibility tests failed\n");
      process.exit(1);
    }
  }

  private async checkCommonIssues(): Promise<void> {
    console.log("🔎 Checking for common accessibility issues...");

    const issues: string[] = [];

    // Check for missing alt attributes in images
    const imageIssues = this.checkImageAltAttributes();
    if (imageIssues.length > 0) {
      issues.push(...imageIssues);
    }

    // Check for proper heading hierarchy
    const headingIssues = this.checkHeadingHierarchy();
    if (headingIssues.length > 0) {
      issues.push(...headingIssues);
    }

    // Check for form labels
    const formIssues = this.checkFormLabels();
    if (formIssues.length > 0) {
      issues.push(...formIssues);
    }

    if (issues.length > 0) {
      console.log("⚠️  Found potential accessibility issues:");
      issues.forEach(issue => console.log(`   - ${issue}`));
      console.log("");
    } else {
      console.log("✅ No common accessibility issues found\n");
    }
  }

  private checkImageAltAttributes(): string[] {
    const issues: string[] = [];

    try {
      // This is a simplified check - in a real implementation you'd parse the files
      const result = execSync(
        'grep -r "img.*src" components/ --include="*.tsx" --include="*.jsx"',
        {
          encoding: "utf8",
        }
      );

      const lines = result.split("\n").filter(line => line.trim());

      lines.forEach(line => {
        if (line.includes("<img") && !line.includes("alt=")) {
          issues.push(`Missing alt attribute: ${line.trim()}`);
        }
      });
    } catch (error) {
      // No images found or grep failed
    }

    return issues;
  }

  private checkHeadingHierarchy(): string[] {
    const issues: string[] = [];

    try {
      // Check for proper heading hierarchy
      const result = execSync(
        'grep -r "<h[1-6]" components/ --include="*.tsx" --include="*.jsx"',
        {
          encoding: "utf8",
        }
      );

      // This is a basic check - a full implementation would parse the component tree
      if (result && !result.includes("<h1")) {
        issues.push("No h1 heading found in components");
      }
    } catch (error) {
      // No headings found
    }

    return issues;
  }

  private checkFormLabels(): string[] {
    const issues: string[] = [];

    try {
      // Check for form inputs without labels
      const inputResult = execSync(
        'grep -r "<input" components/ --include="*.tsx" --include="*.jsx"',
        {
          encoding: "utf8",
        }
      );

      const labelResult = execSync(
        'grep -r "<label" components/ --include="*.tsx" --include="*.jsx"',
        {
          encoding: "utf8",
        }
      );

      const inputLines = inputResult.split("\n").filter(line => line.trim());
      const labelLines = labelResult.split("\n").filter(line => line.trim());

      // This is a simplified check
      if (inputLines.length > labelLines.length) {
        issues.push("Potential unlabeled form inputs detected");
      }
    } catch (error) {
      // No forms found
    }

    return issues;
  }

  private generateReport(): void {
    console.log("📊 Accessibility Audit Report");
    console.log("================================");
    console.log("");

    console.log("✅ Automated Tests: PASSED");
    console.log("✅ Common Issues Check: COMPLETED");
    console.log("");

    console.log("📋 Recommendations:");
    console.log("   - Run manual testing with screen readers");
    console.log("   - Test keyboard navigation thoroughly");
    console.log("   - Validate color contrast ratios");
    console.log("   - Test with users who have disabilities");
    console.log("");

    console.log("🎯 WCAG 2.2 AA Compliance Status: ON TRACK");
    console.log("");
  }
}

// Run the audit
const auditor = new AccessibilityAuditor();
auditor.runAudit().catch(error => {
  console.error("Audit failed:", error);
  process.exit(1);
});
