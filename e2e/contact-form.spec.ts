import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should display contact form with proper validation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to contact section
    await page.click('a[href="#contact"]');
    await expect(page.locator('#contact')).toBeInViewport();

    // Check that form is visible
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check required form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#contact"]');

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for validation messages
    const nameField = page.locator('input[name="name"]');
    const emailField = page.locator('input[name="email"]');
    const messageField = page.locator('textarea[name="message"]');

    // Check that fields are marked as invalid or have error messages
    await expect(nameField).toHaveAttribute('aria-invalid', 'true');
    await expect(emailField).toHaveAttribute('aria-invalid', 'true');
    await expect(messageField).toHaveAttribute('aria-invalid', 'true');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#contact"]');

    // Fill form with invalid email
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'Test message');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check that email field shows validation error
    const emailField = page.locator('input[name="email"]');
    await expect(emailField).toHaveAttribute('aria-invalid', 'true');
  });

  test('should submit form with valid data', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#contact"]');

    // Fill form with valid data
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message for the contact form.');

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for success state or loading state
    // Note: This might show a success message or redirect
    await expect(submitButton).toBeDisabled();
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#contact"]');

    // Check that all form fields have proper labels
    const nameField = page.locator('input[name="name"]');
    const emailField = page.locator('input[name="email"]');
    const messageField = page.locator('textarea[name="message"]');

    // Check for labels or aria-label attributes
    await expect(nameField).toHaveAttribute('aria-label');
    await expect(emailField).toHaveAttribute('aria-label');
    await expect(messageField).toHaveAttribute('aria-label');
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#contact"]');

    // Test tab navigation through form
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="name"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="email"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('textarea[name="message"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should copy email to clipboard', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#contact"]');

    // Look for email copy button
    const copyButton = page.locator('[data-testid="copy-email"]');
    
    if (await copyButton.isVisible()) {
      await copyButton.click();
      
      // Check for success feedback (tooltip or message)
      await expect(page.locator('[data-testid="copy-success"]')).toBeVisible();
    }
  });
});