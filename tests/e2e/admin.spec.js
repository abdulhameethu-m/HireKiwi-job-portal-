import { test, expect } from '@playwright/test';

test.describe('Admin Governance & Role Authorization Suite', () => {
  test('TC_ADMIN_01 - candidate user is forbidden from accessing /admin', async ({ page }) => {
    // Sign in as applicant
    await page.goto('/login');
    await page.locator('#loginEmail').fill('candidate@example.com');
    await page.locator('#loginPassword').fill('CandidatePass123!');
    await page.locator('#loginSubmitBtn').click();
    await expect(page).toHaveURL(/.*dashboard/);

    // Attempt direct navigation to /admin
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*unauthorized/);
    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
  });

  test('TC_ADMIN_02 - admin login loads dashboard overview and platform KPIs', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#loginEmail').fill('admin@careernest.test');
    await page.locator('#loginPassword').fill('AdminPass123!');
    await page.locator('#loginSubmitBtn').click();

    await expect(page).toHaveURL(/.*admin/);
    await expect(page.getByRole('heading', { name: 'Recruitment Management Dashboard' })).toBeVisible();

    // KPI cards
    await expect(page.getByText('Total Job Listings')).toBeVisible();
    await expect(page.getByText('Active Vacancies')).toBeVisible();
    await expect(page.getByText('Total Applications')).toBeVisible();
  });

  test('TC_ADMIN_03 - admin can publish a new job vacancy', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#loginEmail').fill('admin@careernest.test');
    await page.locator('#loginPassword').fill('AdminPass123!');
    await page.locator('#loginSubmitBtn').click();
    await expect(page).toHaveURL(/.*admin/);

    // Open create job modal
    await page.locator('#createJobBtn').click();
    await expect(page.getByRole('heading', { name: 'Post New Vacancy' })).toBeVisible();

    const jobTitle = `SDET Automation Lead ${Date.now()}`;
    await page.locator('#adminJobTitle').fill(jobTitle);
    await page.locator('#adminJobCompany').fill('Apex Innovations');
    await page.locator('#adminJobLocation').fill('Bengaluru');
    await page.locator('#adminJobExperience').fill('3-5 years');
    await page.locator('#adminJobSalary').fill('₹15-22 LPA');
    await page.locator('#adminJobSkills').fill('Playwright, TypeScript, Docker');
    await page.locator('#adminJobDescription').fill('Lead the next generation test automation framework.');

    await page.locator('#adminJobSubmitBtn').click();

    // Verify confirmation and appearance in table
    await expect(page.getByText('Job published successfully.')).toBeVisible();
    await expect(page.getByText(jobTitle)).toBeVisible();
  });

  test('TC_ADMIN_04 - admin can toggle job status between active and closed', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#loginEmail').fill('admin@careernest.test');
    await page.locator('#loginPassword').fill('AdminPass123!');
    await page.locator('#loginSubmitBtn').click();
    await expect(page).toHaveURL(/.*admin/);

    // Find first active status pill button in the jobs table
    const statusPill = page.locator('tbody button:has-text("active")').first();
    await expect(statusPill).toBeVisible();
    await statusPill.click();

    await expect(page.getByText(/Job marked as/)).toBeVisible();
  });

  test('TC_ADMIN_05 - admin can update candidate application progression status', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#loginEmail').fill('admin@careernest.test');
    await page.locator('#loginPassword').fill('AdminPass123!');
    await page.locator('#loginSubmitBtn').click();
    await expect(page).toHaveURL(/.*admin/);

    // Switch to applicant submissions tab
    await page.getByRole('button', { name: /Applicant Submissions/ }).click();

    // Change status dropdown of the first application
    const statusSelect = page.locator('tbody select').first();
    await expect(statusSelect).toBeVisible();
    await statusSelect.selectOption('Shortlisted');

    await expect(page.getByText(/Application status changed to Shortlisted/)).toBeVisible();
  });
});
