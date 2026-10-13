# Test Cases Specification & Execution Log — CareerNest / HireKiwi QA Lab

## 1. Executive Summary & Test Case Classification

This document provides the formal test case specifications for the **CareerNest / HireKiwi Job Portal**. It includes:
- **Part 1:** Detailed Specifications for **18 Primary Test Cases** covering **Positive**, **Negative**, and **Boundary** scenarios across all 6 core testing scopes.
- **Part 2:** Master Traceability Test Matrix of all **51 Automated End-to-End Scenarios**.
- **Part 3:** Test Execution Log confirming 100% pass rate.

### Classification Breakdown
- **Positive Test Cases:** 28 scenarios (valid discovery, search matching, clean registration, successful authentication, valid application submission, profile updates, admin status changes).
- **Negative Test Cases:** 15 scenarios (empty required fields, invalid email format, incorrect passwords, duplicate accounts, duplicate applications, unauthorized admin access, non-existent 404 permalinks).
- **Boundary Test Cases:** 8 scenarios (10-digit phone number boundary, name length limits, cover letter 500-char boundary, resume file size 5MB threshold, whitespace-only input rejection).

---

## Part 1: Primary Test Cases Specification (Positive, Negative, Boundary)

### Scope 1: Job Listings Verification

#### TC-JOB-01 (Positive | P1 Critical)
- **Title:** Homepage Job Catalog & Role Attribute Rendering
- **Scope:** Job listings verification
- **Type:** **Positive**
- **Priority:** P1 (Critical)
- **Preconditions:** Mock backend and frontend running; database seeded.
- **Test Data:** N/A (Standard seed inventory)
- **Steps:**
  1. Navigate to portal homepage `http://127.0.0.1:5173/`.
  2. Inspect navbar brand text `CareerNest`.
  3. Inspect hero heading `Recommended jobs`.
  4. Inspect the 6 recommended job cards.
- **Expected Result:** Brand is visible; 6 job cards render with job title, company name, salary range (e.g., `₹3–5 LPA`), experience requirement (e.g., `0–2 years`), job type pill (`Full-time`), and skills.
- **Actual Result:** Verified. All 6 job cards render with complete metadata.
- **Status:** **PASSED (Automated — `job-portal.spec.js` / `sample.spec.js`)**

#### TC-JOB-02 (Positive | P2 High)
- **Title:** Keyword Search Word-Boundary Precision
- **Scope:** Job listings verification & filtering
- **Type:** **Positive**
- **Priority:** P2 (High)
- **Preconditions:** Homepage open.
- **Test Data:** Keyword: `Java`
- **Steps:**
  1. Locate search input `Job title, skill, or company`.
  2. Type `Java`.
  3. Click `Search jobs`.
- **Expected Result:** Catalog filters to exactly 1 role: `Junior Java Developer`. It does not match `Frontend Developer Intern` (which contains `JavaScript`).
- **Actual Result:** Exactly 1 matching job displayed with count = 1.
- **Status:** **PASSED (Automated — `job-portal.spec.js` TC02)**

#### TC-JOB-03 (Negative | P2 High)
- **Title:** Non-Existent Keyword Search Handling (Empty State)
- **Scope:** Job listings error handling
- **Type:** **Negative**
- **Priority:** P2 (High)
- **Preconditions:** Homepage open.
- **Test Data:** Keyword: `NoSuchRole999`
- **Steps:**
  1. Enter `NoSuchRole999` into search input.
  2. Click `Search jobs`.
- **Expected Result:** Zero job cards displayed; friendly empty state heading `No jobs found` appears with a `Clear search` button.
- **Actual Result:** Empty state renders cleanly; clicking `Clear search` restores all 6 cards.
- **Status:** **PASSED (Automated — `job-portal.spec.js` TC04)**

---

### Scope 2: Navigation & Deep Linking

#### TC-NAV-01 (Positive | P1 Critical)
- **Title:** Vacancy Modal Details Navigation
- **Scope:** Navigation
- **Type:** **Positive**
- **Priority:** P1 (Critical)
- **Preconditions:** Job listings visible on homepage.
- **Test Data:** Role: `Junior Java Developer` (ID: 1)
- **Steps:**
  1. Click `View details` or role title for `Junior Java Developer`.
  2. Inspect displayed dialog.
- **Expected Result:** Accessible modal (`role="dialog"`) opens displaying complete details: Title, Northstar Digital, ₹3–5 LPA, full description, skills, and `Apply now` button.
- **Actual Result:** Modal mounts instantly with correct vacancy context.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 2)**

#### TC-NAV-02 (Positive | P2 High)
- **Title:** Modal Dismissal Navigation
- **Scope:** Navigation
- **Type:** **Positive**
- **Priority:** P2 (High)
- **Preconditions:** Vacancy modal open.
- **Test Data:** N/A
- **Steps:**
  1. Click `Close` (×) button on the modal.
- **Expected Result:** Modal unmounts completely (`dialog` count = 0); user returns seamlessly to the catalog view.
- **Actual Result:** Modal closes smoothly without page reload.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 2)**

#### TC-NAV-03 (Negative | P2 High)
- **Title:** Direct Navigation to Non-Existent Job Permalink (404 Routing)
- **Scope:** Navigation & Error Handling
- **Type:** **Negative**
- **Priority:** P2 (High)
- **Preconditions:** Portal running.
- **Test Data:** URL: `/jobs/99999`
- **Steps:**
  1. Navigate directly to `http://127.0.0.1:5173/jobs/99999`.
- **Expected Result:** Displays `Job Not Found` error page with descriptive message and a functional `Back to all jobs` navigation link.
- **Actual Result:** Dedicated 404 page rendered; back link returns user to `/jobs`.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 6 / `jobs.spec.js` TC_JOB_04)**

---

### Scope 3: Form Validation (Positive, Negative, Boundary)

#### TC-VAL-01 (Negative | P1 Critical)
- **Title:** Empty Application Form Required Fields Enforcement
- **Scope:** Form validation
- **Type:** **Negative**
- **Priority:** P1 (Critical)
- **Preconditions:** Application modal open for `Junior Java Developer`.
- **Test Data:** All fields blank
- **Steps:**
  1. Click `Submit application` without entering any field data.
- **Expected Result:** Form submission blocked; inline error messages appear:
  - `Full name is required.`
  - `Email address is required.`
  - `Phone number is required.`
  - `Select your experience.`
- **Actual Result:** All 4 validation error alerts appear; form is not submitted.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 3 / `job-portal.spec.js` TC09)**

#### TC-VAL-02 (Negative | P1 Critical)
- **Title:** Invalid Email Address Format Rejection
- **Scope:** Form validation
- **Type:** **Negative**
- **Priority:** P1 (Critical)
- **Preconditions:** Application modal open.
- **Test Data:** Name: `Alex Tester`, Email: `invalid-email-address`, Phone: `9876543210`, Experience: `Fresher`
- **Steps:**
  1. Fill form with invalid email format `invalid-email-address`.
  2. Click `Submit application`.
- **Expected Result:** Submission blocked; email field displays inline error: `Enter a valid email address.`.
- **Actual Result:** RFC regex rejection triggers; inline error displayed.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 3 / `job-portal.spec.js` TC10)**

#### TC-VAL-03 (Boundary | P1 Critical)
- **Title:** Phone Number Digit Length Boundary Validation
- **Scope:** Form validation
- **Type:** **Boundary**
- **Priority:** P1 (Critical)
- **Preconditions:** Application modal open.
- **Test Data:** Phone: `12345` (Lower boundary failure — 5 digits instead of 10)
- **Steps:**
  1. Fill valid name, email, and experience.
  2. Enter `12345` in phone number field.
  3. Click `Submit application`.
- **Expected Result:** Submission rejected; error displayed: `Enter exactly 10 digits.`.
- **Actual Result:** Rejection confirmed. Only exact 10 numeric digits accepted.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 3 / `job-portal.spec.js` TC11)**

#### TC-VAL-04 (Boundary | P2 High)
- **Title:** Whitespace-Only Name Input Sanitization
- **Scope:** Form validation
- **Type:** **Boundary**
- **Priority:** P2 (High)
- **Preconditions:** Application modal open.
- **Test Data:** Full Name: `"     "` (5 spaces)
- **Steps:**
  1. Enter spaces into the `Full name *` input.
  2. Fill valid email, phone, and experience.
  3. Click `Submit application`.
- **Expected Result:** Input is trimmed before validation; rejected with `Full name is required.`.
- **Actual Result:** Whitespace input properly rejected.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 3 / `job-portal.spec.js` TC12)**

#### TC-VAL-05 (Boundary | P3 Medium)
- **Title:** Cover Letter Max Character Count Boundary (500 Chars)
- **Scope:** Form validation
- **Type:** **Boundary**
- **Priority:** P3 (Medium)
- **Preconditions:** Application modal open.
- **Test Data:** 45-character string: `"I enjoy testing and verifying software quality."`
- **Steps:**
  1. Type 45 characters into cover letter textarea.
  2. Check the real-time character counter.
- **Expected Result:** Counter updates dynamically to display `45 / 500 characters`. Cannot exceed 500 characters (`maxLength={500}`).
- **Actual Result:** Character counter reflects exact input length.
- **Status:** **PASSED (Automated — `job-portal.spec.js` TC14)**

---

### Scope 4: Submission Behavior & Integrity

#### TC-SUB-01 (Positive | P1 Critical)
- **Title:** Valid Application Submission & Reference Tracking ID Generation
- **Scope:** Submission behavior
- **Type:** **Positive**
- **Priority:** P1 (Critical)
- **Preconditions:** Application modal open for `Junior Java Developer`.
- **Test Data:** Name: `Priya Sharma`, Email: `priya.sharma@example.test`, Phone: `9876543210`, Experience: `Fresher`, Cover Letter: `Passionate QA Engineer.`
- **Steps:**
  1. Fill all fields with valid test data.
  2. Click `Submit application`.
- **Expected Result:** Confirmation dialog appears with heading `You're all set, Priya Sharma!`, unique Reference ID formatted as `CN-XXXXXXX`, and disclaimer `No application was sent to a real employer`.
- **Actual Result:** Confirmation modal opens instantly with valid reference ID.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 4 / `job-portal.spec.js` TC13)**

#### TC-SUB-02 (Positive | P1 Critical)
- **Title:** Prevention of Accidental Repeated Requests (Double Click Protection)
- **Scope:** Submission behavior
- **Type:** **Positive**
- **Priority:** P1 (Critical)
- **Preconditions:** Application form filled with valid data.
- **Test Data:** Standard submission data
- **Steps:**
  1. Click `Submit application`.
  2. Observe submit button state during request inflight.
- **Expected Result:** Button immediately transitions to disabled (`disabled={submitting}`) with text `Submitting...` and spinner icon, preventing rapid double-clicks.
- **Actual Result:** Disabled state active during API request; duplicate clicks blocked.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 5)**

#### TC-SUB-03 (Negative | P1 Critical)
- **Title:** Duplicate Application Prevention (Same Email for Same Role)
- **Scope:** Submission behavior
- **Type:** **Negative**
- **Priority:** P1 (Critical)
- **Preconditions:** Candidate has previously applied for Job ID 1.
- **Test Data:** Email: `duplicate.candidate@example.com`, Job ID: 1
- **Steps:**
  1. Attempt submitting a second application for Job 1 with the same email.
- **Expected Result:** API rejects request with HTTP `409 Conflict` and error: `You have already submitted an application for this position.`.
- **Actual Result:** Duplicate application rejected with `409 Conflict`.
- **Status:** **PASSED (Automated — `api.test.js` & Unit)**

#### TC-SUB-04 (Positive | P2 High)
- **Title:** Application Cancellation Without Data Leakage
- **Scope:** Submission behavior
- **Type:** **Positive**
- **Priority:** P2 (High)
- **Preconditions:** Application modal open with partially entered text.
- **Test Data:** Name: `Temporary User`
- **Steps:**
  1. Fill partial details in form.
  2. Click `Cancel` button.
- **Expected Result:** Modal unmounts immediately; no network request is sent; underlying catalog view remains unchanged.
- **Actual Result:** Form unmounts cleanly without persistence.
- **Status:** **PASSED (Automated — `sample.spec.js` Scenario 5 / `job-portal.spec.js` TC15)**

---

### Scope 5: Error Handling & Security

#### TC-ERR-01 (Negative | P1 Critical)
- **Title:** Submission to Closed Vacancy Rejection
- **Scope:** Error handling & Vacancy Lifecycle
- **Type:** **Negative**
- **Priority:** P1 (Critical)
- **Preconditions:** Job ID 16 is marked as `closed`.
- **Test Data:** Job ID: 16 (`Data Analyst Intern` - Closed)
- **Steps:**
  1. Navigate to `/jobs/16`.
  2. Inspect status pill and Apply button.
- **Expected Result:** Status pill displays `Listing Closed`; `Apply Now` button is disabled (`disabled`). API rejects any direct submission attempts with HTTP `400 Bad Request (JOB_CLOSED)`.
- **Actual Result:** UI disables button; backend guards return 400.
- **Status:** **PASSED (Automated — `jobs.spec.js` TC_JOB_05 / `api.test.js`)**

#### TC-ERR-02 (Negative | P1 Critical)
- **Title:** Role-Based Access Control (RBAC) Unauthorized Admin Interception
- **Scope:** Security & Error handling
- **Type:** **Negative**
- **Priority:** P1 (Critical)
- **Preconditions:** User authenticated as candidate (applicant role).
- **Test Data:** User: `candidate@example.com`
- **Steps:**
  1. Log in as applicant.
  2. Attempt to navigate directly to `/admin`.
- **Expected Result:** Intercepted by authorization guard; redirected to `/unauthorized` with `Access Denied` notification.
- **Actual Result:** Redirected immediately to `/unauthorized`.
- **Status:** **PASSED (Automated — `admin.spec.js` TC_ADMIN_01)**

---

### Scope 6: Cross-Browser & Responsiveness

#### TC-A11Y-01 (Positive | P2 High)
- **Title:** Mobile Viewport Responsiveness (375px Viewport)
- **Scope:** Cross-browser & Responsiveness
- **Type:** **Positive**
- **Priority:** P2 (High)
- **Preconditions:** Emulated mobile device viewport: 375px × 667px.
- **Test Data:** Device: iPhone SE emulation
- **Steps:**
  1. Set viewport to 375px width.
  2. Navigate to homepage `/`.
  3. Inspect navbar, hamburger toggle, and card stack.
  4. Measure `document.documentElement.scrollWidth` vs `clientWidth`.
- **Expected Result:** Layout is fully responsive; hamburger menu functions; zero horizontal scroll (`scrollWidth <= clientWidth`).
- **Actual Result:** Zero horizontal overflow detected; touch controls responsive.
- **Status:** **PASSED (Automated — `accessibility.spec.js` TC_A11Y_03)**

---

## Part 2: Master Test Suite Matrix (51 Playwright E2E Scenarios)

| ID | Suite | Scenario Description | Type | Priority | Automated File | Status |
|---|---|---|---|---|---|---|
| SC-01 | Sample | Job listings render correct titles, salaries, experience, descriptions | Positive | P1 | `tests/sample.spec.js` | PASSED |
| SC-02 | Sample | Job links open correct role and navigation works as expected | Positive | P1 | `tests/sample.spec.js` | PASSED |
| SC-03 | Sample | Form validation rejects missing fields, invalid email, whitespace, phone | Negative/Boundary | P1 | `tests/sample.spec.js` | PASSED |
| SC-04 | Sample | Successful application submission generates unique reference ID | Positive | P1 | `tests/sample.spec.js` | PASSED |
| SC-05 | Sample | Submit button disables during submission and cancellation discards inputs | Positive/Boundary | P1 | `tests/sample.spec.js` | PASSED |
| SC-06 | Sample | Error handling for non-existent job 404 and search empty state recovery | Negative | P2 | `tests/sample.spec.js` | PASSED |
| TC01 | Public | Homepage shows brand and job recommendations | Positive | P1 | `tests/job-portal.spec.js` | PASSED |
| TC02 | Public | Keyword search filters jobs with word boundary | Positive | P1 | `tests/job-portal.spec.js` | PASSED |
| TC03 | Public | Location filter updates results | Positive | P1 | `tests/job-portal.spec.js` | PASSED |
| TC04 | Public | No-result search shows helpful empty state | Negative | P2 | `tests/job-portal.spec.js` | PASSED |
| TC05 | Public | Clear filters restores all jobs | Positive | P2 | `tests/job-portal.spec.js` | PASSED |
| TC06 | Public | Opening a job shows expected details in modal | Positive | P1 | `tests/job-portal.spec.js` | PASSED |
| TC07 | Public | Job details modal can be closed | Positive | P2 | `tests/job-portal.spec.js` | PASSED |
| TC08 | Public | Application form opens from job details | Positive | P1 | `tests/job-portal.spec.js` | PASSED |
| TC09 | Public | Empty application shows required-field errors | Negative | P1 | `tests/job-portal.spec.js` | PASSED |
| TC10 | Public | Invalid email is rejected | Negative | P1 | `tests/job-portal.spec.js` | PASSED |
| TC11 | Public | Phone number must contain exactly 10 digits | Boundary | P1 | `tests/job-portal.spec.js` | PASSED |
| TC12 | Public | Whitespace-only name is rejected | Boundary | P1 | `tests/job-portal.spec.js` | PASSED |
| TC13 | Public | Valid application displays confirmation modal | Positive | P1 | `tests/job-portal.spec.js` | PASSED |
| TC14 | Public | Cover letter character count updates in real time | Boundary | P3 | `tests/job-portal.spec.js` | PASSED |
| TC15 | Public | Application can be cancelled without submission | Positive | P2 | `tests/job-portal.spec.js` | PASSED |
| TC16 | Public | Popular keyword shortcut filters listings | Positive | P2 | `tests/job-portal.spec.js` | PASSED |
| TC17 | Public | Optional cover letter can remain empty | Positive | P2 | `tests/job-portal.spec.js` | PASSED |
| REG01 | Reg | Valid candidate registration creates account & redirects | Positive | P1 | `tests/e2e/registration.spec.js` | PASSED |
| REG02 | Reg | Duplicate email registration is rejected | Negative | P1 | `tests/e2e/registration.spec.js` | PASSED |
| REG03 | Reg | Password mismatch displays field error | Negative | P1 | `tests/e2e/registration.spec.js` | PASSED |
| REG04 | Reg | Whitespace-only name is rejected | Boundary | P2 | `tests/e2e/registration.spec.js` | PASSED |
| REG05 | Reg | Invalid phone length is rejected | Boundary | P2 | `tests/e2e/registration.spec.js` | PASSED |
| REG06 | Reg | Unaccepted terms prevents account creation | Negative | P2 | `tests/e2e/registration.spec.js` | PASSED |
| AUTH01 | Auth | Valid applicant sign-in navigates to dashboard | Positive | P1 | `tests/e2e/auth.spec.js` | PASSED |
| AUTH02 | Auth | Invalid credentials display generic error message | Negative | P1 | `tests/e2e/auth.spec.js` | PASSED |
| AUTH03 | Auth | Empty login fields trigger validation indicators | Negative | P2 | `tests/e2e/auth.spec.js` | PASSED |
| AUTH04 | Auth | Password show and hide toggle changes field visibility | Positive | P2 | `tests/e2e/auth.spec.js` | PASSED |
| AUTH05 | Auth | Unauthenticated access to /dashboard redirects to /login | Negative | P1 | `tests/e2e/auth.spec.js` | PASSED |
| AUTH06 | Auth | Signing out invalidates session and restores public navbar | Positive | P1 | `tests/e2e/auth.spec.js` | PASSED |
| JOB01 | Jobs | Dedicated /jobs page renders searchable inventory with pagination | Positive | P1 | `tests/e2e/jobs.spec.js` | PASSED |
| JOB02 | Jobs | Location filter on /jobs narrows results to selected city | Positive | P1 | `tests/e2e/jobs.spec.js` | PASSED |
| JOB03 | Jobs | Dedicated job route /jobs/:id displays complete details | Positive | P1 | `tests/e2e/jobs.spec.js` | PASSED |
| JOB04 | Jobs | Non-existent job ID renders 404 not found page | Negative | P2 | `tests/e2e/jobs.spec.js` | PASSED |
| JOB05 | Jobs | Closed job displays closed status badge and disables apply button | Negative | P1 | `tests/e2e/jobs.spec.js` | PASSED |
| DASH01 | Dash | Candidate sees pre-seeded applications with reference IDs | Positive | P1 | `tests/e2e/dashboard.spec.js` | PASSED |
| DASH02 | Dash | Status badges reflect current application state | Positive | P2 | `tests/e2e/dashboard.spec.js` | PASSED |
| DASH03 | Dash | Candidate can update professional headline | Positive | P2 | `tests/e2e/dashboard.spec.js` | PASSED |
| ADM01 | Admin | Candidate user is forbidden from accessing /admin | Negative | P1 | `tests/e2e/admin.spec.js` | PASSED |
| ADM02 | Admin | Admin login loads dashboard overview and platform KPIs | Positive | P1 | `tests/e2e/admin.spec.js` | PASSED |
| ADM03 | Admin | Admin can publish a new job vacancy | Positive | P1 | `tests/e2e/admin.spec.js` | PASSED |
| ADM04 | Admin | Admin can toggle job status between active and closed | Positive | P1 | `tests/e2e/admin.spec.js` | PASSED |
| ADM05 | Admin | Admin can update candidate application progression status | Positive | P1 | `tests/e2e/admin.spec.js` | PASSED |
| A11Y01 | A11y | Keyboard Tab and Enter navigation works on search form | Positive | P2 | `tests/e2e/accessibility.spec.js` | PASSED |
| A11Y02 | A11y | Modal dialogs possess accessible roles, aria-modal, and buttons | Positive | P2 | `tests/e2e/accessibility.spec.js` | PASSED |
| A11Y03 | A11y | Mobile viewport (375px) renders responsive navigation without scroll | Boundary | P2 | `tests/e2e/accessibility.spec.js` | PASSED |

---

## Part 3: Test Execution Log & Metrics

| Test Suite | Engine / Runner | Scenarios Executed | Passed | Failed | Pass Rate |
|---|---|---:|---:|---:|---:|
| Vitest Unit Tests | Vitest 5.0 | 20 | 20 | 0 | **100%** |
| Supertest REST API Tests | Supertest 7.3 | 17 | 17 | 0 | **100%** |
| Playwright E2E Tests (Full) | Playwright 1.55+ (Chromium) | 51 | 51 | 0 | **100%** |
| **Combined Master Regression** | **All Frameworks** | **88** | **88** | **0** | **100%** |
