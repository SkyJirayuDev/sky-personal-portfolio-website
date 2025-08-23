import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check that there's exactly one h1
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);

    // Check that headings follow proper hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingLevels = await headings.evaluateAll((elements) => 
      elements.map(el => parseInt(el.tagName.charAt(1)))
    );

    // First heading should be h1
    expect(headingLevels[0]).toBe(1);

    // Check that heading levels don't skip (e.g., h1 -> h3)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];
      
      // Current level should not be more than 1 level deeper than previous
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');

    // Test skip links
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toBeFocused();

    // Test that skip link works
    await page.keyboard.press('Enter');
    const mainContent = page.locator('#main');
    await expect(mainContent).toBeInViewport();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Test navigation menu keyboard access
    const navLinks = page.locator('nav a');
    const navLinkCount = await navLinks.count();

    if (navLinkCount > 0) {
      // Tab to first navigation link
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Skip the skip link
      
      await expect(navLinks.first()).toBeFocused();

      // Test arrow key navigation if implemented
      await page.keyboard.press('ArrowDown');
      // Note: This test assumes arrow key navigation is implemented
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');

    // Run axe with color contrast rules specifically
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/');

    // Check navigation has proper ARIA
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('role', 'navigation');
    await expect(nav).toHaveAttribute('aria-label');

    // Check main content area
    const main = page.locator('main');
    await expect(main).toHaveAttribute('role', 'main');

    // Check buttons have proper labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(hasAriaLabel || (hasText && hasText.trim().length > 0)).toBeTruthy();
    }
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Check that animations are disabled or reduced
    const animatedElements = page.locator('[data-testid*="animated"]');
    
    if (await animatedElements.count() > 0) {
      // Check that elements respect reduced motion
      const firstAnimated = animatedElements.first();
      const animationDuration = await firstAnimated.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.animationDuration;
      });
      
      // Animation should be disabled or very short
      expect(animationDuration === '0s' || animationDuration === 'none').toBeTruthy();
    }
  });

  test('should have proper form accessibility', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#contact"]');

    // Check form accessibility
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check that form fields have proper labels
    const inputs = form.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        // Check for associated label
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        
        // Input should have label, aria-label, or aria-labelledby
        expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });

  test('should have accessible images', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Images should have alt text or be marked as decorative
      expect(alt !== null || role === 'presentation').toBeTruthy();
    }
  });
});