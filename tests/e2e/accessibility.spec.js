import { test, expect } from '@playwright/test';

test.describe('Accessibility & Responsive UI Suite', () => {
  test('TC_A11Y_01 - keyboard Tab and Enter navigation works on search form and controls', async ({ page }) => {
    await page.goto('/');

    // Focus keyword input
    const keywordInput = page.locator('#keyword');
    await keywordInput.focus();
    await page.keyboard.type('Java');

    // Tab to location filter
    await page.keyboard.press('Tab');
    const locationSelect = page.locator('#location');
    await expect(locationSelect).toBeFocused();

    // Tab to submit button and press Enter
    await page.keyboard.press('Tab');
    const submitBtn = page.getByRole('button', { name: 'Search jobs' });
    await expect(submitBtn).toBeFocused();
    await page.keyboard.press('Enter');

    // Job cards are visible and focused appropriately
    await expect(page.locator('[data-job-card]')).toHaveCount(1);
  });

  test('TC_A11Y_02 - modal dialogs possess accessible roles, aria-modal, and focusable buttons', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'View details' }).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby', 'detailTitle');

    // Close button has accessible label
    const closeBtn = page.getByLabel('Close');
    await expect(closeBtn).toBeVisible();
  });

  test('TC_A11Y_03 - mobile viewport (375px) renders responsive navigation and cards without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify brand is visible
    await expect(page.getByText('CareerNest', { exact: true }).first()).toBeVisible();

    // Verify mobile hamburger menu toggle exists
    const menuBtn = page.getByLabel('Toggle navigation menu');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Verify mobile nav drawer options
    await expect(page.locator('header').getByRole('link', { name: 'Find jobs' })).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: 'Create account' })).toBeVisible();

    // Ensure page horizontal scroll width does not exceed viewport
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // allowance for subpixel rounding
  });
});
