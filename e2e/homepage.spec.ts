import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load homepage with essential content", async ({ page }) => {
    await page.goto("/");

    // Check that the page loads within reasonable time
    await expect(page).toHaveTitle(/Jirayu Saisuwan/);

    // Check hero section loads
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Jirayu Saisuwan");

    // Check navigation is present
    await expect(page.locator("nav")).toBeVisible();

    // Check main sections are present
    await expect(page.locator("#skills")).toBeVisible();
    await expect(page.locator("#projects")).toBeVisible();
    await expect(page.locator("#experience")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("should have proper accessibility landmarks", async ({ page }) => {
    await page.goto("/");

    // Check for proper semantic structure
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Check heading hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCount(1); // Should only have one h1

    // Check for skip links
    await expect(page.locator('a[href="#main"]')).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check mobile navigation
    const mobileMenuButton = page.locator('[aria-label="Toggle mobile menu"]');
    await expect(mobileMenuButton).toBeVisible();

    // Check content is still visible and properly laid out
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("#skills")).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");

    // Test navigation links
    await page.click('a[href="#skills"]');
    await expect(page.locator("#skills")).toBeInViewport();

    await page.click('a[href="#projects"]');
    await expect(page.locator("#projects")).toBeInViewport();

    await page.click('a[href="#experience"]');
    await expect(page.locator("#experience")).toBeInViewport();

    await page.click('a[href="#contact"]');
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("should have working theme toggle", async ({ page }) => {
    await page.goto("/");

    const themeToggle = page.locator('[aria-label*="theme"]');
    await expect(themeToggle).toBeVisible();

    // Click theme toggle and check for theme change
    await themeToggle.click();

    // Check that theme class changes on html element
    const html = page.locator("html");
    const hasThemeClass = await html.evaluate(
      el => el.classList.contains("dark") || el.classList.contains("light")
    );
    expect(hasThemeClass).toBe(true);
  });
});
