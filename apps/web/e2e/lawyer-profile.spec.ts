import { test, expect } from '@playwright/test';

test.describe('Lawyers Page', () => {
  test('should display lawyer cards - English', async ({ page }) => {
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    // Wait for lawyer cards to load
    const lawyerCard = page.locator('[class*="shadow"]').first();
    await expect(lawyerCard).toBeVisible();

    // Page should display lawyer information
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });

  test('should display lawyer cards - Hebrew', async ({ page }) => {
    await page.goto('/he/lawyers');
    await page.waitForLoadState('networkidle');

    // Wait for lawyer cards to load
    const lawyerCard = page.locator('[class*="shadow"]').first();
    await expect(lawyerCard).toBeVisible();

    // Page should display lawyer information
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });
});
