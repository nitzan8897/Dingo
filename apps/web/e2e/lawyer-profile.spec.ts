import { test, expect } from '@playwright/test';

test.describe('Lawyer Profile Page', () => {
  test('should navigate to lawyer profile when card is clicked - English', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Wait for lawyer cards to load
    const lawyerCard = page.locator('.shadow-md').first();
    await expect(lawyerCard).toBeVisible();

    // Click on the first lawyer card
    await lawyerCard.click();

    // Should navigate to profile page
    await page.waitForLoadState('networkidle');

    // URL should contain /lawyers/
    expect(page.url()).toContain('/en/lawyers/');

    // Profile page should display lawyer information
    await expect(page.locator('h1, h2, h3')).toHaveCount({ minimum: 1 });
  });

  test('should navigate to lawyer profile when card is clicked - Hebrew', async ({ page }) => {
    await page.goto('/he');
    await page.waitForLoadState('networkidle');

    // Wait for lawyer cards to load
    const lawyerCard = page.locator('.shadow-md').first();
    await expect(lawyerCard).toBeVisible();

    // Click on the first lawyer card
    await lawyerCard.click();

    // Should navigate to profile page
    await page.waitForLoadState('networkidle');

    // URL should contain /lawyers/
    expect(page.url()).toContain('/he/lawyers/');

    // Profile page should display lawyer information
    await expect(page.locator('h1, h2, h3')).toHaveCount({ minimum: 1 });
  });

  test('should load profile page directly via URL', async ({ page }) => {
    // First, get a lawyer ID from the home page
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('.shadow-md').first();
    await expect(firstCard).toBeVisible();

    // Extract href from the link
    const href = await firstCard.locator('..').getAttribute('href');

    if (href) {
      // Navigate directly to the profile page
      await page.goto(href);
      await page.waitForLoadState('networkidle');

      // Should display profile content
      expect(page.url()).toContain('/lawyers/');
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
