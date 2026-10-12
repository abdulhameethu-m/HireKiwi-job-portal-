import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('TC01 - homepage shows brand and job recommendations', async ({ page }) => {
  await expect(page.getByText('CareerNest', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recommended jobs' })).toBeVisible();
  await expect(page.locator('[data-job-card]')).toHaveCount(6);
});

test('TC02 - keyword search filters jobs', async ({ page }) => {
  await page.getByLabel('Job title, skill, or company').fill('Java');
  await page.getByRole('button', { name: 'Search jobs' }).click();
  await expect(page.locator('[data-job-card]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Junior Java Developer' })).toBeVisible();
});

test('TC03 - location filter updates results', async ({ page }) => {
  await page.locator('#filterLocation').selectOption('Coimbatore');
  await expect(page.locator('[data-job-card]')).toHaveCount(2);
  await expect(page.getByText('Junior Java Developer')).toBeVisible();
  await expect(page.getByText('Frontend Developer Intern')).toBeVisible();
});

test('TC04 - no-result search shows helpful empty state', async ({ page }) => {
  await page.getByLabel('Job title, skill, or company').fill('NoSuchRole999');
  await page.getByRole('button', { name: 'Search jobs' }).click();
  await expect(page.getByRole('heading', { name: 'No jobs found' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear search' })).toBeVisible();
});

test('TC05 - clear filters restores all jobs', async ({ page }) => {
  await page.locator('#filterLocation').selectOption('Chennai');
  await expect(page.locator('[data-job-card]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('[data-job-card]')).toHaveCount(6);
});

test('TC06 - opening a job shows expected details', async ({ page }) => {
  await page.getByRole('button', { name: 'Junior Java Developer' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Junior Java Developer' })).toBeVisible();
  await expect(page.getByText('Northstar Digital')).toBeVisible();
  await expect(page.getByText('₹3–5 LPA')).toBeVisible();
});

test('TC07 - job details can be closed', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('TC08 - application form opens from job details', async ({ page }) => {
  await page.getByRole('button', { name: 'Junior Java Developer' }).click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await expect(page.getByRole('heading', { name: 'Apply for Junior Java Developer' })).toBeVisible();
  await expect(page.getByLabel('Full name *')).toBeVisible();
});

test('TC09 - empty application shows required-field errors', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect(page.getByText('Full name is required.')).toBeVisible();
  await expect(page.getByText('Email address is required.')).toBeVisible();
  await expect(page.getByText('Phone number is required.')).toBeVisible();
  await expect(page.getByText('Select your experience.')).toBeVisible();
});

test('TC10 - invalid email is rejected', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await page.getByLabel('Full name *').fill('Test Candidate');
  await page.getByLabel('Email address *').fill('abc123');
  await page.getByLabel('Phone number *').fill('9876543210');
  await page.getByLabel('Experience *').selectOption({ label: 'Fresher' });
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
});

test('TC11 - phone number must contain exactly 10 digits', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await page.getByLabel('Full name *').fill('Test Candidate');
  await page.getByLabel('Email address *').fill('candidate@example.com');
  await page.getByLabel('Phone number *').fill('12345');
  await page.getByLabel('Experience *').selectOption({ label: 'Fresher' });
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect(page.getByText('Enter exactly 10 digits.')).toBeVisible();
});

test('TC12 - whitespace-only name is rejected', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await page.getByLabel('Full name *').fill('   ');
  await page.getByLabel('Email address *').fill('candidate@example.com');
  await page.getByLabel('Phone number *').fill('9876543210');
  await page.getByLabel('Experience *').selectOption({ label: 'Fresher' });
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect(page.getByText('Full name is required.')).toBeVisible();
});

test('TC13 - valid application displays confirmation', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await page.getByLabel('Full name *').fill('Test Candidate');
  await page.getByLabel('Email address *').fill('candidate@example.com');
  await page.getByLabel('Phone number *').fill('9876543210');
  await page.getByLabel('Experience *').selectOption({ label: 'Fresher' });
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect(page.getByRole('heading', { name: "You're all set, Test Candidate!" })).toBeVisible();
  await expect(page.getByText(/Reference ID: CN-/)).toBeVisible();
  await expect(page.getByText(/No application was sent to a real employer/)).toBeVisible();
});

test('TC14 - cover letter character count updates', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await page.getByLabel('Why are you a good fit? (optional)').fill('I enjoy testing.');
  await expect(page.locator('#charCount')).toHaveText('16');
});

test('TC15 - application can be cancelled without submission', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('[data-job-card]')).toHaveCount(6);
});

test('TC16 - popular keyword shortcut filters listings', async ({ page }) => {
  await page.getByRole('button', { name: 'QA testing' }).click();
  await expect(page.locator('[data-job-card]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'QA Engineer' })).toBeVisible();
});

test('TC17 - optional cover letter can remain empty', async ({ page }) => {
  await page.getByRole('button', { name: 'View details' }).first().click();
  await page.getByRole('button', { name: 'Apply now' }).click();
  await page.getByLabel('Full name *').fill('Test Candidate');
  await page.getByLabel('Email address *').fill('candidate@example.com');
  await page.getByLabel('Phone number *').fill('9876543210');
  await page.getByLabel('Experience *').selectOption({ label: 'Fresher' });
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect(page.getByRole('heading', { name: "You're all set, Test Candidate!" })).toBeVisible();
});
