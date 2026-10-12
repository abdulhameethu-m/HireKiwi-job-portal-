import { test, expect } from '@playwright/test';

test.describe('Registration Workflow Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('TC_REG_01 - valid registration creates account and redirects to dashboard', async ({ page }) => {
    const uniqueEmail = `new.candidate.${Date.now()}@example.com`;

    await page.locator('#regFullName').fill('Aarav Patel');
    await page.locator('#regEmail').fill(uniqueEmail);
    await page.locator('#regPhone').fill('9876543210');
    await page.locator('#regPassword').fill('Password123!');
    await page.locator('#regConfirmPassword').fill('Password123!');
    await page.locator('#regTerms').check();

    await page.locator('#registerSubmitBtn').click();

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Aarav Patel' })).toBeVisible();
  });

  test('TC_REG_02 - duplicate email registration is rejected', async ({ page }) => {
    await page.locator('#regFullName').fill('Existing User');
    await page.locator('#regEmail').fill('candidate@example.com');
    await page.locator('#regPhone').fill('9876543210');
    await page.locator('#regPassword').fill('Password123!');
    await page.locator('#regConfirmPassword').fill('Password123!');
    await page.locator('#regTerms').check();

    await page.locator('#registerSubmitBtn').click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('already exists');
  });

  test('TC_REG_03 - password mismatch displays field error', async ({ page }) => {
    await page.locator('#regFullName').fill('Aarav Patel');
    await page.locator('#regEmail').fill('aarav@example.com');
    await page.locator('#regPhone').fill('9876543210');
    await page.locator('#regPassword').fill('Password123!');
    await page.locator('#regConfirmPassword').fill('DifferentPassword123!');
    await page.locator('#regTerms').check();

    await page.locator('#registerSubmitBtn').click();

    await expect(page.getByText('Passwords do not match.')).toBeVisible();
  });

  test('TC_REG_04 - whitespace-only name is rejected', async ({ page }) => {
    await page.locator('#regFullName').fill('     ');
    await page.locator('#regEmail').fill('valid@example.com');
    await page.locator('#regPhone').fill('9876543210');
    await page.locator('#regPassword').fill('Password123!');
    await page.locator('#regConfirmPassword').fill('Password123!');
    await page.locator('#regTerms').check();

    await page.locator('#registerSubmitBtn').click();

    await expect(page.getByText('Full name is required.')).toBeVisible();
  });

  test('TC_REG_05 - invalid phone length is rejected', async ({ page }) => {
    await page.locator('#regFullName').fill('Aarav Patel');
    await page.locator('#regEmail').fill('aarav@example.com');
    await page.locator('#regPhone').fill('12345');
    await page.locator('#regPassword').fill('Password123!');
    await page.locator('#regConfirmPassword').fill('Password123!');
    await page.locator('#regTerms').check();

    await page.locator('#registerSubmitBtn').click();

    await expect(page.getByText('Enter exactly 10 digits.')).toBeVisible();
  });

  test('TC_REG_06 - unaccepted terms prevents account creation', async ({ page }) => {
    await page.locator('#regFullName').fill('Aarav Patel');
    await page.locator('#regEmail').fill('aarav@example.com');
    await page.locator('#regPhone').fill('9876543210');
    await page.locator('#regPassword').fill('Password123!');
    await page.locator('#regConfirmPassword').fill('Password123!');

    await page.locator('#registerSubmitBtn').click();

    await expect(page.getByText('You must accept the terms and conditions.')).toBeVisible();
  });
});
