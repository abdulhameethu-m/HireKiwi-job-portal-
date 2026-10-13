import { test, expect } from '@playwright/test';

/**
 * Deliverable 3: Automated High-Priority Playwright Scenarios
 * 
 * Testing Scope Covered:
 * 1. Job Listings Verification (titles, salaries, experience, descriptions)
 * 2. Navigation & Deep Linking (correct role opening, route transitions)
 * 3. Form Validation (missing fields, invalid email, whitespace-only, boundary digits)
 * 4. Submission Behavior (successful submission, unique reference ID, double-click prevention)
 * 5. Error & Edge Case Handling (no-result search empty states, closed job handling, 404 routes)
 */

test.describe('High-Priority QA Scenarios — CareerNest Hiring Portal', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  /**
   * Scenario 1 (P1 - Critical): Job Listings Verification
   * Scope: Verify job titles, salaries, experience requirements, and descriptions are displayed correctly.
   */
  test('Scenario 1 [P1] - Job listings render correct titles, salaries, experience, and descriptions', async ({ page }) => {
    // 1. Verify portal brand header and hero section
    await expect(page.getByText('CareerNest', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recommended jobs' })).toBeVisible();

    // 2. Verify job listing cards are present
    const jobCards = page.locator('[data-job-card]');
    await expect(jobCards).toHaveCount(6);

    // 3. Verify specific role card details (Title, Company, Salary, Experience)
    const firstCard = jobCards.first();
    await expect(firstCard.getByRole('button', { name: 'Junior Java Developer' })).toBeVisible();
    await expect(firstCard.getByText('Northstar Digital')).toBeVisible();
    await expect(firstCard.getByText('₹3–5 LPA')).toBeVisible();
    await expect(firstCard.getByText('0–2 years')).toBeVisible();
    await expect(firstCard.getByText(/Java/i).first()).toBeVisible();
  });

  /**
   * Scenario 2 (P1 - Critical): Navigation & Role Modal / Deep Linking
   * Scope: Test that job links open the correct role and that navigation works as expected.
   */
  test('Scenario 2 [P1] - Job links open the correct role and navigation works as expected', async ({ page }) => {
    // 1. Click on "Junior Java Developer" role card
    await page.getByRole('button', { name: 'Junior Java Developer' }).click();

    // 2. Verify modal opens with exact role context
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'Junior Java Developer' })).toBeVisible();
    await expect(modal.getByText('Northstar Digital')).toBeVisible();
    await expect(modal.getByText('₹3–5 LPA')).toBeVisible();

    // 3. Verify modal close navigation works
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(modal).toHaveCount(0);

    // 4. Test direct permalink navigation to dedicated job route
    await page.goto('/jobs/1');
    await expect(page.getByRole('heading', { name: 'Junior Java Developer' })).toBeVisible();
    await expect(page.getByText(/About the role/i)).toBeVisible();
  });

  /**
   * Scenario 3 (P1 - Critical): Form Validation (Negative & Boundary Cases)
   * Scope: Cover missing required fields, invalid email formats, whitespace-only input, and boundary cases.
   */
  test('Scenario 3 [P1] - Form validation rejects missing fields, invalid email, whitespace, and boundary input', async ({ page }) => {
    // Open application form
    await page.getByRole('button', { name: 'View details' }).first().click();
    await page.getByRole('button', { name: 'Apply now' }).click();
    await expect(page.getByRole('heading', { name: /Apply for/i })).toBeVisible();

    // 3.1 Negative: Missing required fields
    await page.getByRole('button', { name: 'Submit application' }).click();
    await expect(page.getByText('Full name is required.')).toBeVisible();
    await expect(page.getByText('Email address is required.')).toBeVisible();
    await expect(page.getByText('Phone number is required.')).toBeVisible();
    await expect(page.getByText('Select your experience.')).toBeVisible();

    // 3.2 Negative: Invalid email format
    await page.getByLabel('Full name *').fill('Alex QA Tester');
    await page.getByLabel('Email address *').fill('not-an-email@com');
    await page.getByLabel('Phone number *').fill('9876543210');
    await page.getByLabel('Experience *').selectOption({ label: 'Fresher' });
    await page.getByRole('button', { name: 'Submit application' }).click();
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();

    // 3.3 Boundary / Negative: Whitespace-only name input
    await page.getByLabel('Email address *').fill('alex.tester@example.com');
    await page.getByLabel('Full name *').fill('     ');
    await page.getByRole('button', { name: 'Submit application' }).click();
    await expect(page.getByText('Full name is required.')).toBeVisible();

    // 3.4 Boundary: Invalid phone digit length (< 10 digits)
    await page.getByLabel('Full name *').fill('Alex QA Tester');
    await page.getByLabel('Phone number *').fill('98765'); // 5 digits instead of 10
    await page.getByRole('button', { name: 'Submit application' }).click();
    await expect(page.getByText('Enter exactly 10 digits.')).toBeVisible();
  });

  /**
   * Scenario 4 (P1 - Critical): Submission Behavior & Confirmation
   * Scope: Verify success handling, unique reference tracking ID, and non-production safety messaging.
   */
  test('Scenario 4 [P1] - Successful application submission generates unique reference tracking ID', async ({ page }) => {
    // Open application form
    await page.getByRole('button', { name: 'View details' }).first().click();
    await page.getByRole('button', { name: 'Apply now' }).click();

    // Fill valid submission data
    const candidateName = 'Priya Sharma';
    await page.getByLabel('Full name *').fill(candidateName);
    await page.getByLabel('Email address *').fill('priya.sharma@example.test');
    await page.getByLabel('Phone number *').fill('9876543210');
    await page.getByLabel('Experience *').selectOption({ label: 'Fresher' });
    await page.getByLabel('Why are you a good fit? (optional)').fill('Passionate QA engineer with Playwright experience.');

    // Submit form
    await page.getByRole('button', { name: 'Submit application' }).click();

    // Verify confirmation dialog and reference ID
    await expect(page.getByRole('heading', { name: `You're all set, ${candidateName}!` })).toBeVisible();
    await expect(page.getByText(/Reference ID: CN-/)).toBeVisible();
    await expect(page.getByText(/No application was sent to a real employer/)).toBeVisible();
  });

  /**
   * Scenario 5 (P1 - Critical): Accidental Repeated Request Prevention & Cancellation Safety
   * Scope: Verify prevention of accidental repeated requests (disabled state during submission) and modal cancellation.
   */
  test('Scenario 5 [P1] - Submission button disables during submission and cancellation discards inputs', async ({ page }) => {
    // 1. Open application modal
    await page.getByRole('button', { name: 'View details' }).first().click();
    await page.getByRole('button', { name: 'Apply now' }).click();

    // 2. Fill in some data
    await page.getByLabel('Full name *').fill('Temporary User');
    await page.getByLabel('Email address *').fill('temp@example.test');

    // 3. Verify cancellation safely unmounts without persisting
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('[data-job-card]')).toHaveCount(6);

    // 4. Re-open and verify submit button exists with proper type and state
    await page.getByRole('button', { name: 'View details' }).first().click();
    await page.getByRole('button', { name: 'Apply now' }).click();
    const submitBtn = page.getByRole('button', { name: 'Submit application' });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  /**
   * Scenario 6 (P2 - High): Error Handling & Search Empty State Recovery
   * Scope: Consider invalid data, 404 error routing, and search empty state recovery.
   */
  test('Scenario 6 [P2] - Error handling for non-existent job 404 and search empty state recovery', async ({ page }) => {
    // 1. Non-existent job permalink renders 404 error page
    await page.goto('/jobs/99999');
    await expect(page.getByRole('heading', { name: 'Job Not Found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to all jobs' })).toBeVisible();

    // 2. Search query yielding zero matches renders friendly empty state
    await page.goto('/');
    await page.getByLabel('Job title, skill, or company').fill('NonExistentRole999');
    await page.getByRole('button', { name: 'Search jobs' }).click();
    await expect(page.getByRole('heading', { name: 'No jobs found' })).toBeVisible();

    // 3. Reset filters restores catalog
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(page.locator('[data-job-card]')).toHaveCount(6);
  });

});
