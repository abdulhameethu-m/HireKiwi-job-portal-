import { test, expect } from '@playwright/test';

test.describe('Applicant Dashboard Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as candidate
    await page.goto('/login');
    await page.locator('#loginEmail').fill('candidate@example.com');
    await page.locator('#loginPassword').fill('CandidatePass123!');
    await page.locator('#loginSubmitBtn').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC_DASH_01 - candidate sees pre-seeded applications with reference IDs', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Test Candidate' })).toBeVisible();
    await expect(page.getByText('Your Applications')).toBeVisible();

    // Verify application reference IDs are visible
    await expect(page.getByText(/Reference ID:/).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /View Job Details/ }).first()).toBeVisible();
  });

  test('TC_DASH_02 - status badges reflect current application state', async ({ page }) => {
    // Verify status badges are present
    const statusBadges = page.locator('span:has-text("Submitted"), span:has-text("Under Review")');
    await expect(statusBadges.first()).toBeVisible();
  });

  test('TC_DASH_03 - candidate can update professional headline', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Candidate Profile' })).toBeVisible();

    const newHeadline = `Certified QA Specialist - Tested on ${Date.now()}`;
    await page.locator('input[placeholder*="Software Test Engineer"]').fill(newHeadline);
    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(page.getByText('Profile updated successfully!')).toBeVisible();
  });
});
