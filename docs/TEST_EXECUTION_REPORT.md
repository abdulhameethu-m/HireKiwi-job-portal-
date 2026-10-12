# Test Execution & Quality Gate Report — CareerNest QA Lab

**Date of Execution:** October 12, 2026  
**Execution Environment:** Chromium (Headless Shell) 140 / Node.js v20.x  
**Assessment Target:** CareerNest QA Lab (Full-Stack Recruitment Portal)  
**Overall Status:** **PASSED (100% Quality Gate Clearance)**

---

## 1. Executive Summary
A comprehensive multi-tier test regression was performed against the CareerNest QA Lab recruitment platform. Testing encompassed unit logic, API contract specifications, authentication boundaries, and full end-to-end user browser workflows.

All **82 automated tests** passed with zero failures and zero flaky tests.

| Suite Type | Framework | Tests Executed | Passed | Failed | Flaky | Duration | Pass Rate |
|---|---|---:|---:|---:|---:|---:|---:|
| **Unit Testing** | Vitest 5.0 | 20 | 20 | 0 | 0 | 1.79s | **100%** |
| **API Integration** | Supertest 7.3 | 17 | 17 | 0 | 0 | 1.49s | **100%** |
| **End-to-End** | Playwright 1.55+ | 45 | 45 | 0 | 0 | 39.6s | **100%** |
| **Total Automated** | | **82** | **82** | **0** | **0** | **42.88s** | **100%** |

---

## 2. Test Execution Breakdown by Category

### 2.1 Unit Test Breakdown (`tests/unit/`)
- **`validators.test.js` (12 tests):**
  - Email RFC regex validation (valid cases, missing `@`, missing domain, spaces).
  - Indian mobile number 10-digit validation (exact 10 digits, letters, short/long boundaries).
  - Full name string sanitization (non-empty, whitespace-only rejection, length constraints).
  - File extension & MIME type validation for PDF/DOC/DOCX up to 5MB.
- **`security.test.js` (3 tests):**
  - Password hashing with Bcrypt salt rounds.
  - Password comparison and timing resistance.
  - XSS payload sanitization on text inputs.
- **`store.test.js` (5 tests):**
  - Persistent JSON database store query engine.
  - Multi-attribute filtering (keyword, location).
  - Record creation, pagination calculations, status updates, and seed restoration.

### 2.2 REST API Test Breakdown (`tests/api/`)
- **Auth Routes (`/api/auth`):**
  - `POST /register`: Clean user account registration (`201 Created`).
  - `POST /register`: Duplicate email collision returns `409 Conflict`.
  - `POST /login`: Valid credentials issue JWT cookie and payload (`200 OK`).
  - `POST /login`: Invalid credentials rejected with generic error (`401 Unauthorized`).
  - `GET /me`: Returns authenticated session profile (`200 OK`).
  - `POST /logout`: Clears authentication cookie (`200 OK`).
- **Job Routes (`/api/jobs`):**
  - `GET /api/jobs`: Returns seeded catalog with pagination metadata (`200 OK`).
  - `GET /api/jobs?keyword=Java`: Filters with word boundary precision (`200 OK`).
  - `GET /api/jobs?location=Coimbatore`: Filters by city (`200 OK`).
  - `GET /api/jobs/:id`: Returns individual vacancy (`200 OK`).
  - `GET /api/jobs/99999`: Non-existent job returns `404 Not Found`.
- **Application Routes (`/api/applications`):**
  - `POST /api/applications`: Submits application and issues `APP-` reference ID (`201 Created`).
  - `POST /api/applications`: Rejects payload with invalid phone/email (`400 Bad Request`).
  - `GET /api/applications/my`: Returns applicant's submissions (`200 OK`).
- **Admin & RBAC Routes (`/api/admin`):**
  - `GET /api/admin/applications`: Unauthenticated access returns `401 Unauthorized`.
  - `GET /api/admin/applications`: Candidate token access returns `403 Forbidden`.
  - `PATCH /api/admin/applications/:id/status`: Admin token successfully updates progression (`200 OK`).

### 2.3 End-to-End Playwright Breakdown (`tests/` & `tests/e2e/`)
- **`job-portal.spec.js` (17 tests):** Verified homepage layout, Java search (exact count 1), location filter, empty state, filter clearing, modal details, required field indicators, invalid email, 10-digit phone, whitespace name rejection, application submission confirmation with Reference ID, character counter, cancel modal, popular tags, and optional cover letter.
- **`accessibility.spec.js` (3 tests):** Keyboard Tab/Enter navigation, accessible ARIA dialog attributes, mobile viewport 375px responsive navigation without horizontal scroll.
- **`admin.spec.js` (5 tests):** Candidate forbidden from `/admin` (redirected to `/unauthorized`), admin login loads dashboard overview and platform KPIs, admin publishes new job vacancy, admin toggles job status between active and closed, admin updates application pipeline progression.
- **`auth.spec.js` (6 tests):** Valid login navigates to dashboard, invalid credentials display alert, empty fields trigger validation, password visibility toggle, unauthenticated redirect to login, sign out invalidates session and restores public navbar.
- **`dashboard.spec.js` (3 tests):** Pre-seeded applications visible with reference IDs, status badges reflect state, candidate updates headline.
- **`jobs.spec.js` (5 tests):** Dedicated `/jobs` page renders paginated catalog, location filter narrows results, dedicated `/jobs/:id` route displays details, non-existent job ID renders 404, closed job displays closed status badge and disables apply button.
- **`registration.spec.js` (6 tests):** Valid registration creates account and redirects to dashboard, duplicate email is rejected, password mismatch displays field error, whitespace-only name rejected, invalid phone length rejected, unaccepted terms prevents account creation.

---

## 3. Playwright Artifacts & Evidence
- HTML Report: `playwright-report/index.html`
- Traces: Recorded on failure (all passed, retention configured)
- Screenshots: Verified on all key page view transitions
