#!/usr/bin/env tsx

/**
 * Test runner script to verify all testing infrastructure is working
 */

import { execSync } from "child_process";
import { existsSync } from "fs";

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
}

const tests: Array<{ name: string; command: string; required: boolean }> = [
  { name: "Unit Tests", command: "npm run test:run", required: true },
  {
    name: "Accessibility Tests",
    command: "npm run test:accessibility",
    required: true,
  },
  { name: "Type Check", command: "npm run type-check", required: true },
  { name: "Lint Check", command: "npm run lint", required: true },
  { name: "Format Check", command: "npm run format:check", required: false },
  {
    name: "Content Validation",
    command: "npm run validate-content",
    required: false,
  },
];

async function runTest(test: {
  name: string;
  command: string;
  required: boolean;
}): Promise<TestResult> {
  try {
    console.log(`Running ${test.name}...`);
    execSync(test.command, { stdio: "pipe", timeout: 60000 });
    console.log(`✅ ${test.name} passed`);
    return { name: test.name, success: true };
  } catch (error: any) {
    const errorMessage =
      error.stdout?.toString() || error.stderr?.toString() || error.message;
    console.log(`❌ ${test.name} failed: ${errorMessage.slice(0, 200)}...`);
    return { name: test.name, success: false, error: errorMessage };
  }
}

async function checkInfrastructure(): Promise<void> {
  console.log("🔍 Checking testing infrastructure...\n");

  // Check required files exist
  const requiredFiles = [
    "vitest.config.ts",
    "playwright.config.ts",
    "lighthouserc.js",
    "test/setup.ts",
    ".github/workflows/ci.yml",
  ];

  for (const file of requiredFiles) {
    if (existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  }

  console.log("\n📋 Running test suite...\n");

  const results: TestResult[] = [];

  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
  }

  console.log("\n📊 Test Results Summary:");
  console.log("========================");

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed Tests:");
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`  - ${r.name}`);
      });
  }

  console.log("\n🎯 Testing Infrastructure Status:");
  if (failed === 0) {
    console.log("✅ All tests passing - Testing infrastructure is ready!");
  } else {
    const requiredFailed = results.filter(
      r => !r.success && tests.find(t => t.name === r.name)?.required
    ).length;
    if (requiredFailed > 0) {
      console.log(
        "❌ Required tests failing - Testing infrastructure needs attention"
      );
      process.exit(1);
    } else {
      console.log(
        "⚠️  Optional tests failing - Testing infrastructure is mostly ready"
      );
    }
  }
}

// Run the check
checkInfrastructure().catch(error => {
  console.error("Error running infrastructure check:", error);
  process.exit(1);
});
