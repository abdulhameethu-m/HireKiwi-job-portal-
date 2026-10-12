import { test, expect } from '@playwright/test';

test.describe('Authentication Workflow Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC_AUTH_01 - valid applicant sign in navigates to dashboard', async ({ page }) => {
    await page.locator('#loginEmail').fill('candidate@example.com');
    await page.locator('#loginPassword').fill('CandidatePass123!');
    await page.locator('#loginSubmitBtn').click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Test Candidate' })).toBeVisible();
    await expect(page.getByText('Your Applications')).toBeVisible();
  });

  test('TC_AUTH_02 - invalid credentials display generic error message', async ({ page }) => {
    await page.locator('#loginEmail').fill('candidate@example.com');
    await page.locator('#loginPassword').fill('WrongPassword123!');
    await page.locator('#loginSubmitBtn').click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
  });

  test('TC_AUTH_03 - empty login fields trigger validation indicators', async ({ page }) => {
    await page.locator('#loginSubmitBtn').click();

    await expect(page.getByText('Email address is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });

  test('TC_AUTH_04 - password show and hide toggle changes field visibility', async ({ page }) => {
    const passwordInput = page.locator('#loginPassword');
    await passwordInput.fill('SecretPassword');

    expect(await passwordInput.getAttribute('type')).toBe('password');

    // Click show password button
    await page.getByLabel('Show password').click();
    expect(await passwordInput.getAttribute('type')).toBe('text');

    // Click hide password button
    await page.getByLabel('Hide password').click();
    expect(await passwordInput.getAttribute('type')).toBe('password');
  });

  test('TC_AUTH_05 - unauthenticated access to /dashboard redirects to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login.*redirect=%2Fdashboard/);
  });

  test('TC_AUTH_06 - signing out invalidates session and restores public navbar', async ({ page }) => {
    // Sign in first
    await page.locator('#loginEmail').fill('candidate@example.com');
    await page.locator('#loginPassword').fill('CandidatePass123!');
    await page.locator('#loginSubmitBtn').click();
    await expect(page).toHaveURL(/.*dashboard/);

    // Click sign out
    await page.getByRole('button', { name: 'Sign out' }).click();

    // Verify redirected and public sign in button restored
    await expect(page.locator('#profileBtn')).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: 'Create account' })).toBeVisible();
  });
});
