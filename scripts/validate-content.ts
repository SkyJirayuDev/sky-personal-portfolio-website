#!/usr/bin/env tsx

import { validateAllContent } from "../lib/content";

/**
 * Content validation script
 * Run with: npx tsx scripts/validate-content.ts
 */
async function main() {
  console.log("🔍 Validating content files...\n");

  try {
    const result = await validateAllContent();

    if (result.valid) {
      console.log("✅ All content files are valid!");
      console.log(`📊 Validated ${result.errors.length} files successfully.`);
    } else {
      console.log("❌ Content validation failed!");
      console.log(`📊 Found errors in ${result.errors.length} files:\n`);

      for (const fileError of result.errors) {
        console.log(`📄 ${fileError.file}:`);
        for (const error of fileError.errors) {
          console.log(`   ❌ ${error}`);
        }
        console.log("");
      }
    }

    process.exit(result.valid ? 0 : 1);
  } catch (error) {
    console.error("💥 Validation script failed:", error);
    process.exit(1);
  }
}

// Run the validation if this script is executed directly
if (require.main === module) {
  main();
}
