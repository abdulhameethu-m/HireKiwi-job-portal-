# Formal Defect Reports & Bug Lifecycle Tracking — CareerNest / HireKiwi QA Lab

## 1. Defect Severity & Priority Matrix

| Level | Severity Definition | Priority Definition | Target SLA |
|---|---|---|---|
| **P1 / Critical** | Blocker preventing application boot, crashing core APIs, or preventing essential candidate application / authentication. | Immediate fix required before any deployment or testing progression. | < 2 Hours |
| **P2 / High** | Major functional defect in search, validation logic, role authorization, or test automation crash without an immediate workaround. | High-priority fix required within the active sprint. | < 24 Hours |
| **P3 / Medium** | Formatting inconsistency, subtle locator ambiguity under strict mode, or non-blocking UI discrepancy. | Fix scheduled in normal bug triage cycle. | < 3 Days |
| **P4 / Low** | Minor visual artifact, cosmetic spacing anomaly, or non-functional text duplication. | Low-priority polish / cosmetic update. | Backlog |

---

## 2. Documented Defect Reports

### BUG-001: Express 5 Route Wildcard Crash (`path-to-regexp` v8 Incompatibility)
- **Defect ID:** BUG-001
- **Title:** Backend server crashes on boot with `TypeError [PathError]: Missing parameter name at index 6: /api/*`
- **Component / File:** `server/src/app.js` (Route mounting)
- **Environment:** Node.js v20+, Express `^5.3.0`, Windows 11 / Linux
- **Severity:** **Critical (P1)**
- **Priority:** **P1**
- **Preconditions:** Node.js runtime with Express 5 dependencies installed.
- **Steps to Reproduce:**
  1. Mount API router using Express 4 wildcard pattern: `app.use('/api/*', apiRouter)`.
  2. Execute `npm run server` or start background server.
- **Expected Result:** Express starts and listens on port 5000; requests to `/api/...` route to `apiRouter`.
- **Actual Result:** Server crashes immediately on startup with fatal stack trace:
  ```
  TypeError [PathError]: Missing parameter name at index 6: /api/*
      at parse (node_modules/path-to-regexp/dist/index.js:84:19)
      at pathToRegexp (node_modules/path-to-regexp/dist/index.js:14:14)
  ```
- **Root Cause Analysis:** Express 5 uses `path-to-regexp` v8, which deprecated bare wildcards (`*`) without parameter names (e.g., `/*name`).
- **Resolution & Fix:** Standardized Express route mounting to use prefix path without wildcard:
  ```diff
  - app.use('/api/*', apiRouter);
  + app.use('/api', apiRouter);
  ```
- **Evidence:** Express server now boots cleanly on `http://127.0.0.1:5000` with 0 errors.
- **Status:** **Verified & Fixed** (Automated API tests passing 17/17).

---

### BUG-002: Unescaped Apostrophe Syntax Error in Test Suite Compiler
- **Defect ID:** BUG-002
- **Title:** Unescaped single quote in Playwright test locator string causes JavaScript `SyntaxError`
- **Component / File:** `tests/job-portal.spec.js` (Line 113)
- **Environment:** Playwright Test Runner / Node.js
- **Severity:** **High (P2)**
- **Priority:** **P1**
- **Preconditions:** Clone repository and execute test suite.
- **Steps to Reproduce:**
  1. Open `tests/job-portal.spec.js`.
  2. Inspect line 113: `await expect(page.getByText('You're applied...')).toBeVisible()`.
  3. Run `npx playwright test`.
- **Expected Result:** Test file compiles and executes test suite.
- **Actual Result:** Playwright compiler throws fatal syntax error:
  ```
  SyntaxError: Unexpected identifier 're'
      at tests/job-portal.spec.js:113:35
  ```
- **Root Cause Analysis:** The apostrophe in `'You're'` closed the single-quoted string literal prematurely.
- **Resolution & Fix:** Escaped the single quote using double quotes:
  ```diff
  - await expect(page.getByText('You're all set, ')).toBeVisible();
  + await expect(page.getByText("You're all set, ")).toBeVisible();
  ```
- **Evidence:** Playwright test compiler parses all test files cleanly without syntax errors.
- **Status:** **Verified & Fixed** (Playwright test suite runs without parser errors).

---

### BUG-003: Keyword Search Substring Collision ("Java" matches "JavaScript")
- **Defect ID:** BUG-003
- **Title:** Searching for "Java" returns 2 results instead of 1 due to substring collision with "JavaScript"
- **Component / File:** `src/pages/HomePage.jsx` / `server/src/models/Store.js`
- **Environment:** Frontend Search Filter & Backend Store
- **Severity:** **High (P2)**
- **Priority:** **P2**
- **Preconditions:** Seed database contains "Junior Java Developer" and "Frontend Developer Intern" (skills: JavaScript).
- **Steps to Reproduce:**
  1. Navigate to homepage `/`.
  2. Type `Java` in the keyword search box.
  3. Click `Search jobs`.
- **Expected Result:** Only roles matching standalone language `Java` should display (Expected Count = 1).
- **Actual Result:** 2 roles returned: `Junior Java Developer` and `Frontend Developer Intern` (because `JavaScript` contains `Java`).
- **Root Cause Analysis:** String matching used `toLowerCase().includes('java')`, which treats `java` as a substring of `javascript`.
- **Resolution & Fix:** Implemented word-boundary regular expression check (`\bjava\b`) for standalone keywords:
  ```javascript
  const isMatch = new RegExp(`\\b${keyword}\\b`, 'i').test(job.title) ||
                  job.skills.some(s => new RegExp(`\\b${keyword}\\b`, 'i').test(s));
  ```
- **Evidence:** Searching for "Java" in Playwright TC02 asserts exact count = 1 and passes consistently.
- **Status:** **Verified & Fixed** (TC02 passing).

---

### BUG-004: Playwright Strict Mode Violation on Ambiguous Role Locators
- **Defect ID:** BUG-004
- **Title:** Strict mode exception when multiple interactive elements share identical labels across navbar and page
- **Component / File:** `LoginPage.jsx`, `RegisterPage.jsx`, `Navbar.jsx`
- **Environment:** Playwright E2E Runner (Chromium)
- **Severity:** **High (P2)**
- **Priority:** **P2**
- **Preconditions:** Playwright strict mode enabled.
- **Steps to Reproduce:**
  1. Run Playwright login test.
  2. Query `page.getByRole('button', { name: 'Sign In' })` on `/login`.
- **Expected Result:** Playwright targets the submit button uniquely.
- **Actual Result:** Playwright throws StrictModeError:
  ```
  Error: strict mode violation: locator('button:has-text("Sign In")') resolved to 2 elements:
      1) <button id="profileBtn">Sign in</button>
      2) <button type="submit">Sign In</button>
  ```
- **Root Cause Analysis:** `getByRole` text matching is case-insensitive by default in Playwright, matching both the navbar button and the form button.
- **Resolution & Fix:** Added unique semantic IDs (`#loginSubmitBtn`, `#registerSubmitBtn`) and scoped locators to the form container:
  ```diff
  - await page.getByRole('button', { name: 'Sign In' }).click();
  + await page.locator('#loginSubmitBtn').click();
  ```
- **Evidence:** All authentication and registration tests run in parallel with 0 strict mode collisions.
- **Status:** **Verified & Fixed** (45/45 E2E tests passing).

---

### BUG-005: Double Currency Symbol Display in Related Vacancies
- **Defect ID:** BUG-005
- **Title:** Related vacancies list rendered salary with duplicated currency sign (`₹ ₹2.8–4 LPA`)
- **Component / File:** `src/pages/JobDetailPage.jsx`
- **Environment:** Job Details Permalink Route (`/jobs/:id`)
- **Severity:** **Low (P4)**
- **Priority:** **P3**
- **Preconditions:** Navigate to any job details permalink (`/jobs/16`).
- **Steps to Reproduce:**
  1. Open `/jobs/16`.
  2. Inspect sidebar under "Similar Positions".
  3. View salary badge.
- **Expected Result:** Salary rendered cleanly as `₹ 2.8–4 LPA` or `₹2.8–4 LPA`.
- **Actual Result:** Salary rendered as `₹ ₹2.8–4 LPA`.
- **Root Cause Analysis:** JSX template rendered hardcoded `₹` prefix before `{rj.salary}`, but `rj.salary` in the seed data catalog already included `₹`.
- **Resolution & Fix:** Conditioned the currency display to avoid double prefixing:
  ```diff
  - <span>₹ {rj.salary}</span>
  + <span>{rj.salary.startsWith('₹') ? rj.salary : `₹ ${rj.salary}`}</span>
  ```
- **Evidence:** Verified on `/jobs/1` and `/jobs/16`; salary renders with single currency symbol.
- **Status:** **Verified & Fixed**.

---

### BUG-006: Accessible Job Card Interactive Role Semantic Alignment
- **Defect ID:** BUG-006
- **Title:** Job Card title element semantic role mismatch between heading and interactive button
- **Component / File:** `src/components/JobCard.jsx` / `tests/sample.spec.js`
- **Environment:** Playwright E2E Runner
- **Severity:** **Medium (P3)**
- **Priority:** **P2**
- **Preconditions:** Running E2E test querying `getByRole('heading', { name: 'Junior Java Developer' })`.
- **Steps to Reproduce:**
  1. Attempt locating job title on homepage card using heading role selector.
- **Expected Result:** Element is located seamlessly.
- **Actual Result:** Test timed out waiting for heading role because the card title is rendered as an accessible button `<button data-details="1">` for keyboard accessibility.
- **Root Cause Analysis:** Component used interactive button element for WCAG clickability and focus order, while test locator targeted heading role.
- **Resolution & Fix:** Aligned test locators to query the accessible button role `firstCard.getByRole('button', { name: 'Junior Java Developer' })`.
- **Evidence:** All 6 sample scenarios and 17 public scenarios now pass with 100% reliability.
- **Status:** **Verified & Fixed** (`sample.spec.js` 6/6 passing).

---

## 3. Defect Metrics & Resolution Summary

| Metric | Count | Resolution Status |
|---|---|---|
| **Total Defects Logged** | 6 | 6 / 6 Resolved |
| **Critical (P1)** | 1 | 100% Fixed |
| **High (P2)** | 3 | 100% Fixed |
| **Medium (P3)** | 1 | 100% Fixed |
| **Low (P4)** | 1 | 100% Fixed |
| **Defect Re-test Pass Rate** | — | **100% (Zero open defects)** |
