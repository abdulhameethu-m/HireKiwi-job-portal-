# Defect Reports & Bug Lifecycle Tracking — CareerNest QA Lab

## 1. Defect Severity & Priority Classification Matrix
- **Critical (P1):** Blocker preventing application boot, crashing core APIs, or preventing essential user authentication.
- **High (P2):** Major functional defect in search, validation, or administrative state modification without workarounds.
- **Medium (P3):** Formatting inconsistency, strict mode locator ambiguity, or sub-optimal UX state transition.
- **Low (P4):** Minor visual misalignment or cosmetic text duplication.

---

## 2. Documented Defects

### BUG-001: Unescaped Apostrophe Syntax Error in E2E Test Suite
- **Defect ID:** BUG-001
- **Title:** Unescaped single quote in test locator string crashes Playwright compiler
- **Component / File:** `tests/job-portal.spec.js` (Line 113)
- **Severity:** High
- **Priority:** P1
- **Preconditions:** Fresh repository clone running `npm test`.
- **Steps to Reproduce:**
  1. Open `tests/job-portal.spec.js`.
  2. Inspect line 113: `await expect(page.getByText('You're applied...')).toBeVisible()`.
  3. Run `npm test`.
- **Expected Result:** Test file parses cleanly without JavaScript syntax errors.
- **Actual Result:** Node.js syntax error: `SyntaxError: Unexpected identifier 're'`. Suite execution terminates immediately.
- **Root Cause:** Single quote in `'You're'` prematurely terminated the JavaScript string literal.
- **Resolution & Fix:** Updated string literal to use escaped quote or double quotes: `page.getByText("You're applied...")`.
- **Status:** **Verified & Fixed** (Automated regression passing).

---

### BUG-002: Express 5 Route Wildcard Incompatibility (`path-to-regexp` v8)
- **Defect ID:** BUG-002
- **Title:** Backend fails to boot with `PathError: Missing parameter name at index 6: /api/*`
- **Component / File:** `server/src/app.js`
- **Severity:** Critical
- **Priority:** P1
- **Preconditions:** Node.js server starting with Express `^5.3.0`.
- **Steps to Reproduce:**
  1. Declare wildcard API router: `app.use('/api/*', apiRouter)`.
  2. Run `npm run server`.
- **Expected Result:** Express starts and listens on port 5000.
- **Actual Result:** Server crashes on startup with `TypeError [PathError]: Missing parameter name at index 6: /api/*`.
- **Root Cause:** Express 5 upgraded to `path-to-regexp` v8, where bare asterisks (`*`) without parameter names are deprecated.
- **Resolution & Fix:** Standardized route mounting to `app.use('/api', apiRouter)`.
- **Status:** **Verified & Fixed** (Express server boots cleanly).

---

### BUG-003: Keyword Search Substring Collision ("Java" matches "JavaScript")
- **Defect ID:** BUG-003
- **Title:** Searching for "Java" returns 2 results instead of 1 due to substring match on "JavaScript"
- **Component / File:** `src/pages/HomePage.jsx` / `server/src/models/Store.js`
- **Severity:** Medium
- **Priority:** P2
- **Preconditions:** Seed database loaded with Junior Java Developer and Frontend Developer Intern (which lists JavaScript).
- **Steps to Reproduce:**
  1. Open homepage `/`.
  2. Enter `Java` in the keyword search bar.
  3. Click `Search jobs`.
- **Expected Result:** Exactly 1 job matching "Java" is displayed (`Junior Java Developer`).
- **Actual Result:** 2 jobs displayed: `Junior Java Developer` and `Frontend Developer Intern` (matching skill `JavaScript`).
- **Root Cause:** Standard `indexOf` / `includes` string check matched `Java` inside `JavaScript`.
- **Resolution & Fix:** Implemented word-boundary regular expression check (`\bjava\b`) for standalone programming language keywords.
- **Status:** **Verified & Fixed** (TC02 passing with exact count = 1).

---

### BUG-004: Playwright Strict Mode Violation on Ambiguous Role Locators
- **Defect ID:** BUG-004
- **Title:** Strict mode violations when multiple interactive elements share identical labels across modals/navbars
- **Component / File:** `LoginPage.jsx`, `RegisterPage.jsx`, `JobCard.jsx`, `JobModal.jsx`
- **Severity:** High
- **Priority:** P2
- **Preconditions:** Running full Playwright suite with strict mode enabled.
- **Steps to Reproduce:**
  1. Execute `npx playwright test`.
  2. Inspect locator `getByRole('button', { name: 'Sign In' })` on `/login`.
- **Expected Result:** Selector targets the login submission button uniquely.
- **Actual Result:** Playwright strict mode exception: Resolved to 2 elements:
  1) Navbar button: `<button id="profileBtn">Sign in</button>`
  2) Form button: `<button type="submit">Sign In</button>`
- **Root Cause:** Playwright `getByRole` text matching is case-insensitive by default.
- **Resolution & Fix:** Assigned explicit semantic IDs (`#loginSubmitBtn`, `#registerSubmitBtn`, `#adminJobSubmitBtn`) and scoped selectors to form containers.
- **Status:** **Verified & Fixed** (All 45 Playwright E2E tests passing).

---

### BUG-005: Double Currency Symbol Display in Related Vacancies
- **Defect ID:** BUG-005
- **Title:** Related vacancies list rendered salary with duplicated currency sign (`₹ ₹2.8–4 LPA`)
- **Component / File:** `src/pages/JobDetailPage.jsx`
- **Severity:** Low
- **Priority:** P3
- **Preconditions:** Navigating to any job details permalink (`/jobs/16`).
- **Steps to Reproduce:**
  1. Open `/jobs/16`.
  2. Inspect sidebar under "Similar Positions".
  3. View salary badge.
- **Expected Result:** Salary rendered as `₹2.8–4 LPA`.
- **Actual Result:** Salary rendered as `₹ ₹2.8–4 LPA`.
- **Root Cause:** JSX template rendered hardcoded `₹` prefix before `{job.salary}`, but `job.salary` in seed catalog already included `₹`.
- **Resolution & Fix:** Removed redundant hardcoded currency prefix in `JobDetailPage.jsx`.
- **Status:** **Verified & Fixed**.

---

## 3. Defect Summary Metrics
- **Total Defects Identified:** 5
- **Critical (P1):** 1 (Resolved)
- **High (P2):** 2 (Resolved)
- **Medium (P3):** 1 (Resolved)
- **Low (P4):** 1 (Resolved)
- **Defect Resolution Rate:** **100% (5/5 Fixed and Verified)**
