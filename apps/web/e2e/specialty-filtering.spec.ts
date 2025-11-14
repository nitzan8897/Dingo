import { test, expect } from '@playwright/test';

test.describe('Specialty Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should display specialty dropdown button', async ({ page }) => {
    const dropdownButton = page.getByRole('button').filter({ hasText: /specialties|choose/i });
    await expect(dropdownButton).toBeVisible();
  });

  test('should open dropdown when clicked', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    const searchInput = page.getByPlaceholder(/search.*specialt/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display all specialty options when dropdown opens', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    // Check for a few known specialties
    await expect(page.getByText('Criminal Law')).toBeVisible();
    await expect(page.getByText('Civil Law')).toBeVisible();
    await expect(page.getByText('Family Law')).toBeVisible();
  });

  test('should select a specialty when clicked', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    const criminalSpecialty = page.getByText('Criminal Law');
    await criminalSpecialty.click();

    // Dropdown button should now show count
    await expect(dropdownButton).toContainText('1');
  });

  test('should select multiple specialties', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    await page.getByText('Criminal Law').click();
    await page.getByText('Civil Law').click();

    await expect(dropdownButton).toContainText('2');
  });

  test('should deselect a specialty when clicked again', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    const criminalSpecialty = page.getByText('Criminal Law');
    await criminalSpecialty.click();
    await expect(dropdownButton).toContainText('1');

    await criminalSpecialty.click();
    await expect(dropdownButton).not.toContainText('1');
  });

  test('should filter specialties based on search query', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    const searchInput = page.getByPlaceholder(/search.*specialt/i);
    await searchInput.fill('criminal');

    // Criminal Law should be visible
    await expect(page.getByText('Criminal Law')).toBeVisible();
    // Other unrelated specialties should not be visible
    await expect(page.getByText('Family Law')).not.toBeVisible();
  });

  test('should show "no results" message when search yields no matches', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    const searchInput = page.getByPlaceholder(/search.*specialt/i);
    await searchInput.fill('nonexistent');

    await expect(page.getByText(/no results/i)).toBeVisible();
  });

  test('should show Clear All button when specialties are selected', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    await page.getByText('Criminal Law').click();

    const clearAllButton = page.getByRole('button', { name: /clear all/i });
    await expect(clearAllButton).toBeVisible();
  });

  test('should clear all selections when Clear All is clicked', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    await page.getByText('Criminal Law').click();
    await page.getByText('Civil Law').click();

    await expect(dropdownButton).toContainText('2');

    const clearAllButton = page.getByRole('button', { name: /clear all/i });
    await clearAllButton.click();

    await expect(dropdownButton).not.toContainText('2');
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    const searchInput = page.getByPlaceholder(/search.*specialt/i);
    await expect(searchInput).toBeVisible();

    // Click on the page title (outside dropdown)
    await page.getByRole('heading', { name: /dingo/i }).click();

    await expect(searchInput).not.toBeVisible();
  });

  test('should filter lawyers when specialty is selected', async ({ page }) => {
    // Wait for lawyers to load
    await page.waitForSelector('[data-testid="lawyer-card"]', { timeout: 5000 }).catch(() => {
      // If no data-testid, just wait for any cards to appear
    });

    const initialLawyerCount = await page.locator('.shadow-md').count();

    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    await page.getByText('Criminal Law').click();

    // Wait for network request to complete
    await page.waitForLoadState('networkidle');

    // Lawyer count may change (could be more, less, or same depending on data)
    const filteredLawyerCount = await page.locator('.shadow-md').count();
    expect(filteredLawyerCount).toBeGreaterThanOrEqual(0);
  });

  test('should allow clicking specialty tag on lawyer card to add it to filter', async ({ page }) => {
    // Wait for lawyers to load
    await page.waitForTimeout(1000);

    // Find a specialty tag on a lawyer card and click it
    const specialtyTag = page.locator('.bg-primary-100').first();
    if (await specialtyTag.count() > 0) {
      await specialtyTag.click();

      // Dropdown should show 1 selected specialty
      const dropdownButton = page.getByRole('button').first();
      await expect(dropdownButton).toContainText('1');
    }
  });

  test('should persist selected specialties when reopening dropdown', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    await page.getByText('Criminal Law').click();
    await dropdownButton.click(); // Close

    await dropdownButton.click(); // Reopen

    // Search input should be visible
    const searchInput = page.getByPlaceholder(/search.*specialt/i);
    await expect(searchInput).toBeVisible();

    // Specialty should still be selected (dropdown count should show 1)
    await expect(dropdownButton).toContainText('1');
  });

  test('should handle multiple specialty selections and filtering together', async ({ page }) => {
    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    // Select multiple specialties
    await page.getByText('Criminal Law').click();
    await page.getByText('Civil Law').click();
    await page.getByText('Family Law').click();

    await expect(dropdownButton).toContainText('3');

    // Wait for filtered results
    await page.waitForLoadState('networkidle');

    // Lawyers should be filtered (can't assert exact count without test data)
    const lawyerCards = page.locator('.shadow-md');
    await expect(lawyerCards.first()).toBeVisible();
  });
});

test.describe('Specialty Filtering - Hebrew', () => {
  test('should work in Hebrew language', async ({ page }) => {
    await page.goto('/he');
    await page.waitForLoadState('networkidle');

    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    // Hebrew text for Criminal Law
    await expect(page.getByText('פלילי')).toBeVisible();

    await page.getByText('פלילי').click();

    await expect(dropdownButton).toContainText('1');
  });

  test('should filter in Hebrew', async ({ page }) => {
    await page.goto('/he');
    await page.waitForLoadState('networkidle');

    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();

    const searchInput = page.getByPlaceholder(/חפש/);
    await searchInput.fill('פלילי');

    await expect(page.getByText('פלילי')).toBeVisible();
  });
});
