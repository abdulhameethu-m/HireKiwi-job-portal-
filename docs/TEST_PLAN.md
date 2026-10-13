# Comprehensive QA Test Plan — CareerNest / HireKiwi Job Portal

## 1. Executive Summary & Purpose
This QA Test Plan defines the complete testing strategy, scope, execution rules, and defect management framework for the **CareerNest / HireKiwi Job Portal**.

The system is a recruitment web platform designed for candidates to discover job openings, inspect detailed vacancy requirements, submit job applications safely, and track application lifecycles, with an administrative portal for vacancy governance and pipeline progression.

In strict compliance with QA testing rules, all destructive and data-altering tests are executed against an isolated, high-fidelity local mock application stack (`127.0.0.1:5173` frontend and `127.0.0.1:5000` backend API with deterministic database seeding) to prevent polluting live production systems or dispatching unsolicited candidate submissions to real employers.

---

## 2. Testing Rules & Compliance
- **Safe Exploratory Testing:** Safe, non-destructive exploratory testing is performed on public views.
- **Local Mock Application for Mutation:** All scenarios requiring test data creation, application submissions, authentication credentials, and database mutations run against the local mock recruitment portal.
- **Zero Production Pollution:** No fake applications are sent to real employers; zero production data alterations.
- **No Load Testing on Live Infrastructure:** Stress and load testing are restricted to isolated mock environments.

---

## 3. Scope of Testing

The test plan systematically covers the 6 core pillars of the testing scope:

### 3.1 Job Listings Verification
- **Verification Elements:** Job titles, company names, salary ranges (e.g. `₹3–5 LPA`), experience requirements (e.g. `0–2 years`, `Fresher`), employment type badges (`Full-time`, `Internship`, `Hybrid`), required skill tags, and role descriptions.
- **Catalog Rendering:** Proper card layout on homepage (6 recommended roles) and searchable inventory on `/jobs` (8 paginated roles per page).
- **Keyword Filtering Precision:** Exact word-boundary keyword filtering (ensuring searching for "Java" matches only Java vacancies and does not accidentally match "JavaScript").
- **Location Multi-Filter:** Filtering by city (Coimbatore, Chennai, Bengaluru, Hyderabad, Remote) and category dropdowns.

### 3.2 Navigation & Deep Linking
- **Role Links:** Clicking a job title or "View details" button opens the dedicated role details modal or permalink route (`/jobs/:id`).
- **Deep Linking / Permalinks:** Navigating directly to `/jobs/1` loads the complete vacancy details with responsibilities, requirements, and an active apply button.
- **Modal Dismissal:** Clicking the "Close" (×) button, "Cancel" button, or pressing `Escape` unmounts modals cleanly and returns focus to the underlying page without page reloads.
- **Global Navigation:** Navigating between Homepage (`/`), Dedicated Job Search (`/jobs`), Authentication (`/login`, `/register`), Candidate Dashboard (`/dashboard`), and Admin Portal (`/admin`).
- **Pagination Navigation:** Prev/Next page navigation with boundary controls on page 1 and last page.

### 3.3 Form Validation (Positive, Negative & Boundary)
- **Required Fields:** Ensures `fullName`, `email`, `phone`, and `experience` fields enforce mandatory completion with clear inline error messages.
- **Email Format Validation:** Rejects missing `@`, missing domain, spaces, and malformed strings (e.g., `invalid-email`, `user@`, `user@domain`).
- **Whitespace-Only Input Handling:** Fields containing only whitespace characters (e.g., `"   "`) are rejected with `Full name is required.`.
- **Boundary Cases:**
  - **Phone Number:** Enforces exactly 10 numeric digits. Rejects boundary failures (< 10 digits like `12345` and > 10 digits).
  - **Name Length:** Rejects names < 2 characters and > 80 characters.
  - **Cover Letter Character Limit:** Real-time character counter (`0 / 500 characters`) enforcing max 500 characters.
  - **Resume File Upload:** Rejects unauthorized MIME types/extensions (accepts only `.pdf`, `.doc`, `.docx`, `.txt`) and files exceeding the 5MB size threshold.

### 3.4 Submission Behavior & Integrity
- **Success Handling:** Valid submissions generate an immediate confirmation modal displaying a unique reference tracking ID (e.g., `CN-1029384` or `APP-2026-001`).
- **Non-Production Disclaimer:** Confirmation explicitly displays `No application was sent to a real employer` to maintain candidate clarity.
- **Prevention of Accidental Repeated Requests:**
  - Submit button is disabled immediately upon click (`disabled={submitting}`) with animated spinner indicator.
  - Form handler enforces state lock (`if (submitting) return;`) preventing double-click duplicate API dispatches.
- **Duplicate Submission Handling:** Server-side duplicate checks reject duplicate applications from the same email for the same vacancy with `409 Conflict`.
- **Cancellation Safety:** Clicking "Cancel" or backdrop dismisses the modal without dispatching payloads or saving dirty state.

### 3.5 Error Handling & Fault Resilience
- **Invalid Data & Schema Violations:** Server responds with `400 Bad Request` and structured validation errors.
- **Non-Existent Resources (404):** Direct navigation to invalid job IDs (`/jobs/99999`) renders an accessible `404 - Job Not Found` page with a recovery link to `/jobs`.
- **Closed Vacancy Handling:** Closed jobs (`/jobs/16`) render a `Listing Closed` status pill and disable the `Apply Now` button. Submissions to closed jobs return `400 Bad Request (JOB_CLOSED)`.
- **Unauthorized & Forbidden Routes (401/403):** Direct navigation to protected `/dashboard` without authentication redirects to `/login`. Non-admin access to `/admin` redirects to `/unauthorized`.
- **Network Failures & Slow Responses:** Graceful error banners (`formAlert`) and loading skeletons during network latency.

### 3.6 Cross-Browser & Responsiveness Behavior
- **Browser Engines:** Validated across Chromium (Desktop & Mobile emulation), with architectural compatibility verified for Firefox (Gecko) and WebKit (Safari).
- **Responsive Viewports:**
  - Desktop Viewport: 1280px × 800px (grid layouts, sidebars).
  - Mobile Viewport: 375px × 667px (iPhone SE standard).
  - Validates hamburger drawer navigation, stacked single-column cards, zero horizontal scrolling (`scrollWidth <= clientWidth`), and 44px+ touch targets.
- **Accessibility (A11y):** Keyboard Tab focus order, Enter key form submission, ARIA dialog roles (`role="dialog"`, `aria-modal="true"`), and accessible labels on all controls.

---

## 4. Prioritized Scenarios Matrix

| Priority | Scope Area | Scenario Description | Test Level | Automated? |
|---|---|---|---|---|
| **P1 (Critical)** | Job Listings | Verify job titles, salaries, experience, and descriptions render accurately | E2E & Unit | Yes (Automated) |
| **P1 (Critical)** | Navigation | Job link opens correct role details modal and dedicated permalink `/jobs/:id` | E2E | Yes (Automated) |
| **P1 (Critical)** | Form Validation | Missing required fields trigger inline error messages | E2E & Unit | Yes (Automated) |
| **P1 (Critical)** | Form Validation | Invalid email format and boundary phone digits rejected | E2E & Unit | Yes (Automated) |
| **P1 (Critical)** | Form Validation | Whitespace-only name inputs rejected | E2E & Unit | Yes (Automated) |
| **P1 (Critical)** | Submission | Valid candidate application creates record and returns unique Reference ID | E2E & API | Yes (Automated) |
| **P1 (Critical)** | Submission | Submit button disables during submission to prevent accidental repeated clicks | E2E | Yes (Automated) |
| **P1 (Critical)** | Authentication | Candidate login issues session token and loads candidate dashboard | E2E & API | Yes (Automated) |
| **P1 (Critical)** | Authorization | Non-admin candidate cannot access admin portal (redirected to `/unauthorized`) | E2E & API | Yes (Automated) |
| **P1 (Critical)** | Closed Vacancy | Closed job displays closed status and disables application button | E2E & API | Yes (Automated) |
| **P2 (High)** | Search & Filter | Keyword search filters with exact word boundary ("Java" vs "JavaScript") | E2E & Unit | Yes (Automated) |
| **P2 (High)** | Search & Filter | Location filter updates listing; Clear filters restores full catalog | E2E | Yes (Automated) |
| **P2 (High)** | Error Handling | Non-existent job ID (`/jobs/99999`) gracefully renders 404 page | E2E | Yes (Automated) |
| **P2 (High)** | Error Handling | Non-existent keyword search displays friendly empty state and reset button | E2E | Yes (Automated) |
| **P2 (High)** | Cross-Browser | Mobile viewport (375px) renders responsive navigation without horizontal overflow | E2E | Yes (Automated) |
| **P2 (High)** | Accessibility | Modal dialogs contain `role="dialog"` and `aria-modal="true"` | E2E | Yes (Automated) |
| **P3 (Medium)** | UI Polish | Cover letter character counter dynamically calculates `X / 500 characters` | E2E | Yes (Automated) |
| **P3 (Medium)** | Submission | Optional cover letter can remain empty without failing submission | E2E | Yes (Automated) |
| **P3 (Medium)** | Cancellation | Clicking Cancel or backdrop discards form inputs without saving | E2E | Yes (Automated) |

---

## 5. Test Automation Strategy & Pyramid

```
               /\
              /  \         Playwright E2E Tests (51 Scenarios)
             /E2E \        Real browser user journeys, locators, accessibility, mobile
            /------\
           /  API   \      Supertest REST API Tests (17 Scenarios)
          / Contract \     HTTP codes, auth middleware, file uploads, schema parsing
         /------------\
        /     Unit     \   Vitest Unit Tests (20 Scenarios)
       /  & Validation  \  Regex patterns, boundary checks, bcrypt hashing, store query
      /------------------\
```

- **Frameworks:** Playwright 1.55+, Vitest 5.0, Supertest 7.3.
- **Deterministic Seeding:** Automated `npm run seed` before testing creates consistent users, jobs, and applications.
- **Reporting:** List reporter, Playwright HTML report (`playwright-report/index.html`), JSON artifacts, and failure screenshots/traces.

---

## 6. Entry and Exit Criteria

### 6.1 Entry Criteria
1. Node.js v20+ and npm dependencies installed (`npm install`).
2. Playwright browser binaries installed (`npx playwright install chromium`).
3. Local test database initialized via `npm run seed`.
4. Mock servers operational (`node scripts/start-all.js`).

### 6.2 Exit Criteria
1. 100% pass rate across all Vitest unit tests (20/20).
2. 100% pass rate across all Supertest API tests (17/17).
3. 100% pass rate across all Playwright E2E tests (51/51).
4. Zero unresolved P1 (Critical) or P2 (High) defects.
5. All required deliverables documented and committed.
