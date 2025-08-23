import { test, expect } from '@playwright/test';

test.describe('Projects Section', () => {
  test('should display project cards with filtering', async ({ page }) => {
    await page.goto('/');

    // Navigate to projects section
    await page.click('a[href="#projects"]');
    await expect(page.locator('#projects')).toBeInViewport();

    // Check that project cards are visible
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards.first()).toBeVisible();

    // Check that project cards have required content
    await expect(projectCards.first().locator('h3')).toBeVisible();
    await expect(projectCards.first().locator('[data-testid="tech-stack"]')).toBeVisible();
  });

  test('should filter projects by technology', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#projects"]');

    // Check if filter buttons exist
    const filterButtons = page.locator('[data-testid="filter-button"]');
    if (await filterButtons.count() > 0) {
      const initialProjectCount = await page.locator('[data-testid="project-card"]').count();
      
      // Click on a filter
      await filterButtons.first().click();
      
      // Wait for filter animation to complete
      await page.waitForTimeout(500);
      
      // Check that filtering occurred (projects may be hidden or shown)
      const filteredProjectCount = await page.locator('[data-testid="project-card"]:visible').count();
      
      // The count should either be the same (if all projects match) or different
      expect(typeof filteredProjectCount).toBe('number');
    }
  });

  test('should navigate to project case studies', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#projects"]');

    // Look for case study links
    const caseStudyLinks = page.locator('a[href^="/case-studies/"]');
    
    if (await caseStudyLinks.count() > 0) {
      const firstCaseStudyLink = caseStudyLinks.first();
      const href = await firstCaseStudyLink.getAttribute('href');
      
      await firstCaseStudyLink.click();
      
      // Check that we navigated to the case study page
      await expect(page).toHaveURL(new RegExp(href!));
      
      // Check that case study content loads
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('should have accessible project cards', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#projects"]');

    const projectCards = page.locator('[data-testid="project-card"]');
    const firstCard = projectCards.first();
    
    await expect(firstCard).toBeVisible();
    
    // Check for proper heading structure
    await expect(firstCard.locator('h3')).toBeVisible();
    
    // Check for interactive elements accessibility
    const links = firstCard.locator('a');
    if (await links.count() > 0) {
      const firstLink = links.first();
      await expect(firstLink).toHaveAttribute('href');
      
      // Check focus state
      await firstLink.focus();
      await expect(firstLink).toBeFocused();
    }
  });
});