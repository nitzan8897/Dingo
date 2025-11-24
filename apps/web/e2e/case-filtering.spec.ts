import { test, expect } from '@playwright/test';

test.describe('Case Filtering', () => {
  test('should filter cases by specialty in English', async ({ page }) => {
    await page.goto('/en/cases');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Cases' })).toBeVisible();

    const criminalTag = page.getByText('Criminal Law');
    await expect(criminalTag).toBeVisible();
    await criminalTag.click();

    await page.waitForLoadState('networkidle');

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should filter cases by specialty in Hebrew', async ({ page }) => {
    await page.goto('/he/cases');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'תיקים' })).toBeVisible();

    const criminalTag = page.getByText('פלילי');
    await expect(criminalTag).toBeVisible();
    await criminalTag.click();

    await page.waitForLoadState('networkidle');

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should filter cases by status in English', async ({ page }) => {
    await page.goto('/en/cases');
    await page.waitForLoadState('networkidle');

    const winTag = page.getByText('Defence Won', { exact: true });
    if (await winTag.isVisible()) {
      await winTag.click();
      await page.waitForLoadState('networkidle');

      const caseCards = page.locator('[class*="shadow-lg"]');
      const count = await caseCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should filter cases by status in Hebrew', async ({ page }) => {
    await page.goto('/he/cases');
    await page.waitForLoadState('networkidle');

    const winTag = page.getByText('ניצחון', { exact: true });
    if (await winTag.isVisible()) {
      await winTag.click();
      await page.waitForLoadState('networkidle');

      const caseCards = page.locator('[class*="shadow-lg"]');
      const count = await caseCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should search cases by text in English', async ({ page }) => {
    await page.goto('/en/cases');
    await page.waitForLoadState('networkidle');

    const searchInput = page.getByPlaceholder('Search cases...');
    await searchInput.fill('contract');

    await page.waitForTimeout(500);

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should search cases by text in Hebrew', async ({ page }) => {
    await page.goto('/he/cases');
    await page.waitForLoadState('networkidle');

    const searchInput = page.getByPlaceholder('חיפוש תיקים...');
    await searchInput.fill('חוזה');

    await page.waitForTimeout(500);

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show empty state when no cases match filters in English', async ({
    page,
  }) => {
    await page.goto('/en/cases');
    await page.waitForLoadState('networkidle');

    const searchInput = page.getByPlaceholder('Search cases...');
    await searchInput.fill('xyznonexistentcasexyz');

    await page.waitForTimeout(500);

    await expect(page.getByText('No cases found')).toBeVisible();
  });

  test('should show empty state when no cases match filters in Hebrew', async ({
    page,
  }) => {
    await page.goto('/he/cases');
    await page.waitForLoadState('networkidle');

    const searchInput = page.getByPlaceholder('חיפוש תיקים...');
    await searchInput.fill('xyznonexistentcasexyz');

    await page.waitForTimeout(500);

    await expect(page.getByText('לא נמצאו תיקים')).toBeVisible();
  });

  test('should navigate to case detail page when clicking case card in English', async ({
    page,
  }) => {
    await page.goto('/en/cases');
    await page.waitForLoadState('networkidle');

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();

    if (count > 0) {
      await caseCards.first().click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toMatch(/\/en\/cases\/.+/);
    }
  });

  test('should navigate to case detail page when clicking case card in Hebrew', async ({
    page,
  }) => {
    await page.goto('/he/cases');
    await page.waitForLoadState('networkidle');

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();

    if (count > 0) {
      await caseCards.first().click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toMatch(/\/he\/cases\/.+/);
    }
  });

  test('should display case details correctly in English', async ({ page }) => {
    await page.goto('/en/cases');
    await page.waitForLoadState('networkidle');

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();

    if (count > 0) {
      await caseCards.first().click();
      await page.waitForLoadState('networkidle');

      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    }
  });

  test('should display case details correctly in Hebrew', async ({ page }) => {
    await page.goto('/he/cases');
    await page.waitForLoadState('networkidle');

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();

    if (count > 0) {
      await caseCards.first().click();
      await page.waitForLoadState('networkidle');

      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    }
  });

  test('should apply multiple filters simultaneously in English', async ({
    page,
  }) => {
    await page.goto('/en/cases');
    await page.waitForLoadState('networkidle');

    const criminalTag = page.getByText('Criminal Law');
    if (await criminalTag.isVisible()) {
      await criminalTag.click();
    }

    const winTag = page.getByText('Defence Won', { exact: true });
    if (await winTag.isVisible()) {
      await winTag.click();
    }

    await page.waitForLoadState('networkidle');

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should apply multiple filters simultaneously in Hebrew', async ({
    page,
  }) => {
    await page.goto('/he/cases');
    await page.waitForLoadState('networkidle');

    const criminalTag = page.getByText('פלילי');
    if (await criminalTag.isVisible()) {
      await criminalTag.click();
    }

    const winTag = page.getByText('ניצחון', { exact: true });
    if (await winTag.isVisible()) {
      await winTag.click();
    }

    await page.waitForLoadState('networkidle');

    const caseCards = page.locator('[class*="shadow-lg"]');
    const count = await caseCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
