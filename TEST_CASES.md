# Test Cases Specification & Execution Log — CareerNest QA Lab

Priority Definition:
- **P1 (Critical):** Core authentication, vacancy discovery, application submission, and data integrity.
- **P2 (High):** Filtering, role authorization, profile editing, form validations.
- **P3 (Medium/Low):** Edge UI formatting, character counters, responsiveness boundaries.

Status Definition:
- **Automated (PASSED):** Verified by Playwright or Vitest suites with 100% pass rate.
- **Manual (PASSED):** Exploratory testing executed and verified.

---

## 1. Master Test Suite Matrix

### Suite A: Public Job Discovery & Application Flow (`tests/job-portal.spec.js`)
| ID | Scenario | Steps & Test Data | Expected Result | Priority | Automation | Status |
|---|---|---|---|---|---|---|
| TC01 | Homepage Hero & Recommended Display | Navigate to `/` | Brand header, hero banner, search bar, and 6 recommended cards render | P1 | Automated | PASSED |
| TC02 | Keyword Search Filtering | Enter keyword `Java` and submit | Only matching Java role (`Junior Java Developer`) displays with count = 1 | P1 | Automated | PASSED |
| TC03 | Location Dropdown Filtering | Select location `Coimbatore` | Only Coimbatore jobs render in listing | P1 | Automated | PASSED |
| TC04 | Non-existent Search Handling | Search keyword `NoSuchRole999` | Friendly empty state message and Reset filters action render | P2 | Automated | PASSED |
| TC05 | Reset Filters Workflow | Filter by `Chennai`, click `Clear filters` | Full catalog of recommended jobs is restored | P2 | Automated | PASSED |
| TC06 | Vacancy Modal Inspection | Click `View details` on Junior Java Developer | Modal opens displaying title, company, salary, experience, and skills | P1 | Automated | PASSED |
| TC07 | Vacancy Modal Dismissal | Open job details modal and click `Close` | Modal unmounts and catalog view is restored | P2 | Automated | PASSED |
| TC08 | Application Modal Trigger | From job details modal, click `Apply now` | Application modal opens displaying job title context | P1 | Automated | PASSED |
| TC09 | Form Submission Validation | Submit blank application form | Inline field error indicators appear for required fields; no submission occurs | P1 | Automated | PASSED |
| TC10 | Email Format Validation | Enter invalid email `invalid-email` and submit | Email format error is displayed | P1 | Automated | PASSED |
| TC11 | Phone Digit Boundary Validation | Enter 5-digit number `12345` | Phone validation error enforces exactly 10 digits | P1 | Automated | PASSED |
| TC12 | Whitespace-only Name Validation | Enter whitespace `"    "` in full name | Field rejected with error: `Full name is required` | P1 | Automated | PASSED |
| TC13 | Valid Application Submission | Submit valid candidate name, email, phone, and experience | Confirmation dialog displays unique Reference ID (`APP-`) | P1 | Automated | PASSED |
| TC14 | Cover Letter Character Counter | Type 45 characters into cover letter textarea | Counter accurately updates to reflect `45 / 500 characters` | P3 | Automated | PASSED |
| TC15 | Application Cancellation | Open application modal and click `Cancel` | Form closes without saving or dispatching payload | P2 | Automated | PASSED |
| TC16 | Popular Tag Shortcut Filter | Click popular keyword chip `QA testing` | Automatically filters job list to QA Engineer vacancy | P2 | Automated | PASSED |
| TC17 | Optional Cover Letter Handling | Submit valid application leaving cover letter empty | Application successfully creates reference ID without requiring cover letter | P2 | Automated | PASSED |

---

### Suite B: User Registration & Input Integrity (`tests/e2e/registration.spec.js`)
| ID | Scenario | Steps & Test Data | Expected Result | Priority | Automation | Status |
|---|---|---|---|---|---|---|
| TC_REG_01 | Valid Candidate Registration | Enter unique email, full name, 10-digit phone, matching passwords, check terms | Account created, session cookie set, auto-redirected to `/dashboard` with candidate name | P1 | Automated | PASSED |
| TC_REG_02 | Duplicate Email Prevention | Enter pre-existing email `candidate@example.com` | Rejection alert displayed: `An account with this email address already exists` | P1 | Automated | PASSED |
| TC_REG_03 | Password Mismatch Rejection | Enter password `Password123!` and confirm `DifferentPassword123!` | Form displays inline error: `Passwords do not match.` | P1 | Automated | PASSED |
| TC_REG_04 | Whitespace-only Name Rejection | Enter whitespace in registration name | Inline error: `Full name is required.` | P2 | Automated | PASSED |
| TC_REG_05 | Invalid Phone Digit Length | Enter 5 digits `12345` | Rejection error: `Enter exactly 10 digits.` | P2 | Automated | PASSED |
| TC_REG_06 | Unchecked Terms Agreement | Leave terms agreement checkbox unchecked | Inline validation: `You must accept the terms and conditions.` | P2 | Automated | PASSED |

---

### Suite C: User Authentication & Session Security (`tests/e2e/auth.spec.js`)
| ID | Scenario | Steps & Test Data | Expected Result | Priority | Automation | Status |
|---|---|---|---|---|---|---|
| TC_AUTH_01 | Valid Candidate Sign In | Submit `candidate@example.com` / `CandidatePass123!` | Successfully navigates to `/dashboard` displaying candidate name and submissions | P1 | Automated | PASSED |
| TC_AUTH_02 | Invalid Password Rejection | Submit valid email with wrong password | Generic error banner: `Invalid email or password` | P1 | Automated | PASSED |
| TC_AUTH_03 | Empty Credentials Validation | Click Sign In on empty login form | Email and password required validation messages appear | P2 | Automated | PASSED |
| TC_AUTH_04 | Password Mask / Unmask Toggle | Enter password, toggle show/hide icon | Input `type` toggles between `password` and `text` | P2 | Automated | PASSED |
| TC_AUTH_05 | Protected Route Interception | Unauthenticated user navigates directly to `/dashboard` | Redirected to `/login?redirect=%2Fdashboard` | P1 | Automated | PASSED |
| TC_AUTH_06 | Sign Out Session Termination | Authenticated user clicks `Sign out` | Session token cleared, redirected to public homepage, navbar restores `Sign in` | P1 | Automated | PASSED |

---

### Suite D: Dedicated Job Discovery & Route Handling (`tests/e2e/jobs.spec.js`)
| ID | Scenario | Steps & Test Data | Expected Result | Priority | Automation | Status |
|---|---|---|---|---|---|---|
| TC_JOB_01 | Dedicated Jobs Catalog & Pagination | Navigate to `/jobs` | Paginated listing renders 8 job cards per page with next/prev controls | P1 | Automated | PASSED |
| TC_JOB_02 | Dedicated Catalog Location Filtering | Select `Bengaluru` on `/jobs` | Inventory narrows to Bengaluru roles (e.g. `Technical Support Associate`) | P1 | Automated | PASSED |
| TC_JOB_03 | Dedicated Job Route Permalinks | Navigate directly to `/jobs/1` | Loads `Junior Java Developer` details with responsibilities, skills, and apply button | P1 | Automated | PASSED |
| TC_JOB_04 | Invalid Job ID 404 Routing | Navigate directly to `/jobs/99999` | Dedicated `404 - Job Not Found` page rendered with link back to jobs | P2 | Automated | PASSED |
| TC_JOB_05 | Closed Vacancy State Enforcement | Navigate to `/jobs/16` (Archived job) | Status badge displays `Listing Closed` and `Apply now` button is disabled | P1 | Automated | PASSED |

---

### Suite E: Applicant Dashboard Management (`tests/e2e/dashboard.spec.js`)
| ID | Scenario | Steps & Test Data | Expected Result | Priority | Automation | Status |
|---|---|---|---|---|---|---|
| TC_DASH_01 | Historical Submissions Display | Log in as pre-seeded candidate | Submissions displayed with Reference IDs (`APP-2026-001`, etc.) and company names | P1 | Automated | PASSED |
| TC_DASH_02 | Status Pipeline Badges | Inspect candidate application cards | Badges display current status (`Submitted`, `Under Review`, `Shortlisted`, `Rejected`) | P2 | Automated | PASSED |
| TC_DASH_03 | Candidate Profile Update | Click `Edit Profile`, enter new headline, save | Success toast appears; headline updates immediately in profile header | P2 | Automated | PASSED |

---

### Suite F: Admin Governance & RBAC Security (`tests/e2e/admin.spec.js`)
| ID | Scenario | Steps & Test Data | Expected Result | Priority | Automation | Status |
|---|---|---|---|---|---|---|
| TC_ADMIN_01 | Non-admin Role Authorization Interception | Candidate user attempts to access `/admin` | Redirected to `/unauthorized` with `Access Denied` alert | P1 | Automated | PASSED |
| TC_ADMIN_02 | Admin Portal & Live KPI Metrics | Log in as `admin@careernest.test` / `AdminPass123!` | Directed to `/admin` displaying Total Jobs, Active Vacancies, and Applications KPIs | P1 | Automated | PASSED |
| TC_ADMIN_03 | Publish New Vacancy | Admin clicks `Create New Job`, fills form, submits | Toast `Job published successfully.` appears; vacancy listed in management table | P1 | Automated | PASSED |
| TC_ADMIN_04 | Toggle Vacancy Active/Closed Status | Admin clicks status pill button on active job | Status toggles to `closed`; feedback alert confirms change | P1 | Automated | PASSED |
| TC_ADMIN_05 | Candidate Pipeline Status Progression | Admin switches to submissions tab, selects `Shortlisted` | Dropdown updates and confirmation toast displayed | P1 | Automated | PASSED |

---

### Suite G: Accessibility & Mobile Layout (`tests/e2e/accessibility.spec.js`)
| ID | Scenario | Steps & Test Data | Expected Result | Priority | Automation | Status |
|---|---|---|---|---|---|---|
| TC_A11Y_01 | Keyboard Navigation & Focus Order | Tab through homepage search form and press Enter | Focus ring visible, Tab moves sequentially, Enter triggers search | P2 | Automated | PASSED |
| TC_A11Y_02 | ARIA Dialog & Focus Trap Compliance | Open job details modal | Dialog contains `role="dialog"`, `aria-modal="true"`, accessible Close label | P2 | Automated | PASSED |
| TC_A11Y_03 | Mobile Viewport Responsiveness | Emulate 375px mobile viewport | Brand visible, hamburger menu expands drawer, `scrollWidth <= clientWidth` | P2 | Automated | PASSED |

---

## 2. Test Execution Log

| Date | Environment | Test Suite | Executed | Passed | Failed | Blocked | Pass Rate |
|---|---|---|---:|---:|---:|---:|---:|
| 2026-10-12 | Chromium 140 / Node.js 20 | Vitest Unit Suite | 20 | 20 | 0 | 0 | 100% |
| 2026-10-12 | Chromium 140 / Node.js 20 | Supertest API Suite | 17 | 17 | 0 | 0 | 100% |
| 2026-10-12 | Chromium 140 / Node.js 20 | Playwright E2E Suite | 45 | 45 | 0 | 0 | 100% |
| **Total** | **All Combined Suites** | **Master Regression** | **82** | **82** | **0** | **0** | **100%** |
