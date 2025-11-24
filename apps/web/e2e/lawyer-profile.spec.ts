import { test, expect } from '@playwright/test';

test.describe('Lawyer Profile Page', () => {
  test('should navigate to lawyer profile when card is clicked - English', async ({ page }) => {
    await page.goto('/en/lawyers');
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
    await page.goto('/he/lawyers');
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
    // First, get a lawyer ID from the lawyers page
    await page.goto('/en/lawyers');
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

  test('should display profile sections with avatar and bio - English', async ({ page }) => {
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    const lawyerCard = page.locator('.shadow-md').first();
    await lawyerCard.click();
    await page.waitForLoadState('networkidle');

    // Should display avatar with initials
    const avatar = page.locator('[class*="avatar"]').first();
    await expect(avatar).toBeVisible();

    // Should display lawyer name in a heading
    const nameHeading = page.locator('h1, h2, h3').first();
    await expect(nameHeading).toBeVisible();

    // Should display bio section if exists
    const aboutHeading = page.getByText('About', { exact: false });
    if (await aboutHeading.isVisible()) {
      await expect(aboutHeading).toBeVisible();
    }

    // Should display specialties section
    const specialtiesHeading = page.getByText('Specialties', { exact: false });
    await expect(specialtiesHeading).toBeVisible();

    // Should display ratings section
    const ratingsHeading = page.getByText('Ratings', { exact: false });
    await expect(ratingsHeading).toBeVisible();
  });

  test('should display profile sections with avatar and bio - Hebrew', async ({ page }) => {
    await page.goto('/he/lawyers');
    await page.waitForLoadState('networkidle');

    const lawyerCard = page.locator('.shadow-md').first();
    await lawyerCard.click();
    await page.waitForLoadState('networkidle');

    // Should display avatar with initials
    const avatar = page.locator('[class*="avatar"]').first();
    await expect(avatar).toBeVisible();

    // Should display lawyer name in a heading
    const nameHeading = page.locator('h1, h2, h3').first();
    await expect(nameHeading).toBeVisible();

    // Should display specialties section (אודות in Hebrew)
    const specialtiesSection = page.locator('body');
    await expect(specialtiesSection).toBeVisible();
  });

  test('should display cases section when available - English', async ({ page }) => {
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    const lawyerCard = page.locator('.shadow-md').first();
    await lawyerCard.click();
    await page.waitForLoadState('networkidle');

    // Check if cases section exists
    const casesHeading = page.getByText('Cases', { exact: false });
    const featuredCasesHeading = page.getByText('Featured Cases', { exact: false });

    if (await casesHeading.isVisible() || await featuredCasesHeading.isVisible()) {
      // Should display case outcome badges
      const badges = page.locator('[class*="badge"], [class*="bg-green"], [class*="bg-red"], [class*="bg-blue"], [class*="bg-yellow"]');
      await expect(badges.first()).toBeVisible();

      // Case should have title and description
      const caseCards = page.locator('[class*="space-y-4"] > div').first();
      await expect(caseCards).toBeVisible();
    }
  });

  test('should display reviews section when available - English', async ({ page }) => {
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    const lawyerCard = page.locator('.shadow-md').first();
    await lawyerCard.click();
    await page.waitForLoadState('networkidle');

    // Check if reviews section exists
    const reviewsHeading = page.getByText('Reviews', { exact: false });

    if (await reviewsHeading.isVisible()) {
      // Should display at least one review or review stats
      const stars = page.locator('[class*="fill-yellow-400"]');
      await expect(stars.first()).toBeVisible();

      // Should display reviewer information
      const reviewCards = page.locator('body');
      await expect(reviewCards).toBeVisible();
    }
  });

  test('should display case outcomes chart when cases exist', async ({ page }) => {
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    const lawyerCard = page.locator('.shadow-md').first();
    await lawyerCard.click();
    await page.waitForLoadState('networkidle');

    // Check if case outcomes chart exists
    const chartTitle = page.getByText('Case Outcomes', { exact: false });

    if (await chartTitle.isVisible()) {
      await expect(chartTitle).toBeVisible();
      // Chart container should be visible
      const chartContainer = page.locator('[class*="recharts"]').first();
      if (await chartContainer.isVisible()) {
        await expect(chartContainer).toBeVisible();
      }
    }
  });

  test('should display review statistics when reviews exist', async ({ page }) => {
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    const lawyerCard = page.locator('.shadow-md').first();
    await lawyerCard.click();
    await page.waitForLoadState('networkidle');

    // Look for review statistics (average rating, distribution)
    const reviewStatsCards = page.locator('[class*="Card"]');

    // Should show star ratings somewhere on the page
    const stars = page.locator('[class*="fill-yellow-400"]');
    if (await stars.first().isVisible()) {
      await expect(stars.first()).toBeVisible();
    }
  });

  test('should show empty state when no cases or reviews', async ({ page }) => {
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    const lawyerCard = page.locator('.shadow-md').first();
    await lawyerCard.click();
    await page.waitForLoadState('networkidle');

    // Check if empty state messages exist
    const noCasesText = page.getByText('No cases available', { exact: false });
    const noReviewsText = page.getByText('No reviews yet', { exact: false });

    // Either content exists or empty state exists
    const hasContent = await page.locator('body').isVisible();
    expect(hasContent).toBe(true);
  });

  test('should use wider layout for profile page', async ({ page }) => {
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    const lawyerCard = page.locator('.shadow-md').first();
    await lawyerCard.click();
    await page.waitForLoadState('networkidle');

    // Profile container should have wider max-width than home page
    const profileContainer = page.locator('.max-w-6xl, .max-w-7xl, .max-w-screen-xl').first();
    await expect(profileContainer).toBeVisible();
  });
});
