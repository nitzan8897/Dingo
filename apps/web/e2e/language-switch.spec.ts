import { test, expect } from '@playwright/test';

test.describe('Language Switch on Lawyers Page', () => {
  test('should maintain lawyers data when switching from Hebrew to English', async ({ page }) => {
    // Start on Hebrew lawyers page
    await page.goto('/he/lawyers');
    await page.waitForLoadState('networkidle');

    // Wait for lawyers to load and verify they are visible
    const lawyerCardsBefore = page.locator('[class*="shadow"]');
    await expect(lawyerCardsBefore.first()).toBeVisible({ timeout: 10000 });

    // Count the number of lawyer cards before language switch
    const lawyerCountBefore = await lawyerCardsBefore.count();
    expect(lawyerCountBefore).toBeGreaterThan(0);

    // Verify Hebrew content is displayed
    await expect(page.locator('body')).toHaveAttribute('dir', 'rtl');

    // Click the language switcher dropdown button (Globe icon)
    const languageSwitcherButton = page.locator('button[aria-label*="Switch"]').or(
      page.getByRole('button').filter({ has: page.locator('svg') }).first()
    );
    await languageSwitcherButton.click();

    // Click English option in the dropdown
    const englishOption = page.getByRole('menuitem', { name: /english/i });
    await englishOption.click();

    // Wait for navigation and page to stabilize
    await page.waitForURL('/en/lawyers');
    await page.waitForLoadState('networkidle');

    // Wait a bit for context to populate
    await page.waitForTimeout(1000);

    // Verify English content is displayed
    await expect(page.locator('body')).toHaveAttribute('dir', 'ltr');

    // Verify lawyers are still visible after language switch
    const lawyerCardsAfter = page.locator('[class*="shadow"]');
    await expect(lawyerCardsAfter.first()).toBeVisible({ timeout: 10000 });

    // Count the number of lawyer cards after language switch
    const lawyerCountAfter = await lawyerCardsAfter.count();

    // Verify that lawyers are displayed (context not empty)
    expect(lawyerCountAfter).toBeGreaterThan(0);
    expect(lawyerCountAfter).toBe(lawyerCountBefore);

    // Verify we're not showing empty state
    const emptyState = page.getByText(/no lawyers found/i);
    await expect(emptyState).not.toBeVisible();
  });

  test('should maintain lawyers data when switching from English to Hebrew', async ({ page }) => {
    // Start on English lawyers page
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    // Wait for lawyers to load and verify they are visible
    const lawyerCardsBefore = page.locator('[class*="shadow"]');
    await expect(lawyerCardsBefore.first()).toBeVisible({ timeout: 10000 });

    // Count the number of lawyer cards before language switch
    const lawyerCountBefore = await lawyerCardsBefore.count();
    expect(lawyerCountBefore).toBeGreaterThan(0);

    // Verify English content is displayed
    await expect(page.locator('body')).toHaveAttribute('dir', 'ltr');

    // Click the language switcher dropdown button (Globe icon)
    const languageSwitcherButton = page.locator('button[aria-label*="Switch"]').or(
      page.getByRole('button').filter({ has: page.locator('svg') }).first()
    );
    await languageSwitcherButton.click();

    // Click Hebrew option in the dropdown
    const hebrewOption = page.getByRole('menuitem', { name: /עברית/i });
    await hebrewOption.click();

    // Wait for navigation and page to stabilize
    await page.waitForURL('/he/lawyers');
    await page.waitForLoadState('networkidle');

    // Wait a bit for context to populate
    await page.waitForTimeout(1000);

    // Verify Hebrew content is displayed
    await expect(page.locator('body')).toHaveAttribute('dir', 'rtl');

    // Verify lawyers are still visible after language switch
    const lawyerCardsAfter = page.locator('[class*="shadow"]');
    await expect(lawyerCardsAfter.first()).toBeVisible({ timeout: 10000 });

    // Count the number of lawyer cards after language switch
    const lawyerCountAfter = await lawyerCardsAfter.count();

    // Verify that lawyers are displayed (context not empty)
    expect(lawyerCountAfter).toBeGreaterThan(0);
    expect(lawyerCountAfter).toBe(lawyerCountBefore);

    // Verify we're not showing empty state
    const emptyState = page.getByText(/לא נמצאו עורכי דין/);
    await expect(emptyState).not.toBeVisible();
  });

  test('should maintain search filters when switching languages', async ({ page }) => {
    // Start on English lawyers page
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');

    // Wait for lawyers to load
    await expect(page.locator('[class*="shadow"]').first()).toBeVisible({ timeout: 10000 });

    // Apply a specialty filter
    const dropdownButton = page.getByRole('combobox').filter({ hasText: /special/i });
    await dropdownButton.click();
    await page.getByLabel(/suggestion/i).getByText('Criminal Law').click();
    await expect(dropdownButton).toContainText('1');

    // Switch to Hebrew
    const languageSwitcherButton = page.locator('button[aria-label*="Switch"]').or(
      page.getByRole('button').filter({ has: page.locator('svg') }).first()
    );
    await languageSwitcherButton.click();
    const hebrewOption = page.getByRole('menuitem', { name: /עברית/i });
    await hebrewOption.click();

    // Wait for navigation
    await page.waitForURL('/he/lawyers');
    await page.waitForLoadState('networkidle');

    // Wait a bit for context to populate
    await page.waitForTimeout(1000);

    // Verify lawyers are still visible
    await expect(page.locator('[class*="shadow"]').first()).toBeVisible({ timeout: 10000 });

    // Verify the specialty filter is maintained (should show 1 selected)
    const hebrewDropdownButton = page.getByRole('combobox').filter({ hasText: /התמחויות/ });
    await expect(hebrewDropdownButton).toContainText('1');
  });

  test('should handle multiple language switches without losing data', async ({ page }) => {
    // Helper function for language switching
    const switchLanguage = async (languageName: string) => {
      const switcher = page.locator('button[aria-label*="Switch"]').or(
        page.getByRole('button').filter({ has: page.locator('svg') }).first()
      );
      await switcher.click();
      const option = page.getByRole('menuitem', { name: new RegExp(languageName, 'i') });
      await option.click();
    };

    // Start on English
    await page.goto('/en/lawyers');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[class*="shadow"]').first()).toBeVisible({ timeout: 10000 });
    const initialCount = await page.locator('[class*="shadow"]').count();

    // Switch to Hebrew
    await switchLanguage('עברית');
    await page.waitForURL('/he/lawyers');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.locator('[class*="shadow"]').first()).toBeVisible({ timeout: 10000 });
    const hebrewCount = await page.locator('[class*="shadow"]').count();
    expect(hebrewCount).toBe(initialCount);

    // Switch back to English
    await switchLanguage('English');
    await page.waitForURL('/en/lawyers');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.locator('[class*="shadow"]').first()).toBeVisible({ timeout: 10000 });
    const finalCount = await page.locator('[class*="shadow"]').count();
    expect(finalCount).toBe(initialCount);

    // Switch to Hebrew again
    await switchLanguage('עברית');
    await page.waitForURL('/he/lawyers');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.locator('[class*="shadow"]').first()).toBeVisible({ timeout: 10000 });
    const finalHebrewCount = await page.locator('[class*="shadow"]').count();
    expect(finalHebrewCount).toBe(initialCount);
  });
});
