import { test, expect } from '@playwright/test';

test.describe('Job Discovery & Details Suite', () => {
  test('TC_JOB_01 - dedicated /jobs page renders searchable inventory with pagination', async ({ page }) => {
    await page.goto('/jobs');

    await expect(page.getByRole('heading', { name: 'Explore Job Openings' })).toBeVisible();
    await expect(page.locator('#resultCount')).toBeVisible();

    const jobCards = page.locator('[data-job-card]');
    await expect(jobCards).toHaveCount(8); // Limit of 8 on /jobs

    // Verify pagination controls are visible
    await expect(page.getByRole('button', { name: /Next/ })).toBeVisible();
  });

  test('TC_JOB_02 - location filter on /jobs narrows results to selected city', async ({ page }) => {
    await page.goto('/jobs');

    await page.locator('#filterLocation').selectOption('Bengaluru');
    await expect(page.getByText('Technical Support Associate')).toBeVisible();
  });

  test('TC_JOB_03 - dedicated job route /jobs/:id displays complete details', async ({ page }) => {
    await page.goto('/jobs/1');

    await expect(page.getByRole('heading', { name: 'Junior Java Developer' })).toBeVisible();
    await expect(page.getByText('Northstar Digital')).toBeVisible();
    await expect(page.getByText('Key Responsibilities')).toBeVisible();
    await expect(page.getByText('Required Skills')).toBeVisible();
    await expect(page.locator('#applyNow')).toBeVisible();
  });

  test('TC_JOB_04 - non-existent job ID renders 404 not found page', async ({ page }) => {
    await page.goto('/jobs/99999');

    await expect(page.getByRole('heading', { name: 'Job Not Found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to all jobs' })).toBeVisible();
  });

  test('TC_JOB_05 - closed job displays closed status badge and disables apply button', async ({ page }) => {
    await page.goto('/jobs/16'); // Job 16 is Legacy Mainframe Support Specialist (closed)

    await expect(page.locator('span:has-text("Listing Closed")')).toBeVisible();
    const applyBtn = page.locator('#applyNow');
    await expect(applyBtn).toBeDisabled();
  });
});
