# CareerNest / HireKiwi Job Portal — QA Automation & Test Assessment

![Build Status](https://img.shields.io/badge/Quality_Gate-PASSED-success?style=for-the-badge)
![Tests Passing](https://img.shields.io/badge/Tests-88%2F88_Passed_(100%25)-emerald?style=for-the-badge)
![E2E Tests](https://img.shields.io/badge/Playwright-51_Scenarios-blue?style=for-the-badge)
![API Tests](https://img.shields.io/badge/Supertest-17_Scenarios-orange?style=for-the-badge)
![Unit Tests](https://img.shields.io/badge/Vitest-20_Scenarios-purple?style=for-the-badge)
![Node Version](https://img.shields.io/badge/Node.js-v20%2B-green?style=for-the-badge)

A comprehensive, production-grade Quality Assurance assessment and test automation suite for the **CareerNest / HireKiwi Job Portal**. This repository implements a full-stack local mock recruitment application and an end-to-end multi-tier test automation framework built in accordance with industry testing best practices and strict QA safety guidelines.

---

## 📋 Required Deliverables Checklist

| # | Deliverable | Description & Primary Artifact | Status |
|---|---|---|---|
| **1** | **Test Plan with Prioritized Scenarios** | Complete test strategy covering the 6 core testing scopes, risk tiers, entry/exit criteria, and prioritization matrix. Available in [`TEST_PLAN.md`](TEST_PLAN.md) and [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md). | **COMPLETE** |
| **2** | **At least 15 Well-Written Test Cases** | Detailed test cases containing Positive, Negative, and Boundary scenarios with preconditions, test data, steps, and expected results. Available in [`TEST_CASES.md`](TEST_CASES.md) and [`docs/TEST_CASES.md`](docs/TEST_CASES.md). | **COMPLETE** |
| **3** | **Automated Tests for High-Priority Scenarios** | Robust automated Playwright test suite covering core high-priority scenarios in [`tests/sample.spec.js`](tests/sample.spec.js) and 45 full E2E journeys in [`tests/`](tests/). | **COMPLETE** |
| **4** | **Defect / Bug Reports** | Comprehensive defect tracking with steps to reproduce, severity, root cause analysis, code diffs, and verification logs. Available in [`BUG_REPORTS.md`](BUG_REPORTS.md) and [`docs/BUG_REPORTS.md`](docs/BUG_REPORTS.md). | **COMPLETE** |
| **5** | **README with Setup & Test Results** | Setup instructions, architecture overview, execution guides, and complete test execution results. | **COMPLETE** |

---

## 🎯 Testing Scope & Safety Rules Compliance

### Adherence to Testing Rules
- **Safe Exploratory Testing:** Performed safe, non-destructive exploratory testing on public vacancy views.
- **Isolated Local Mock Application:** All mutations (candidate account creation, form submissions, resume uploads, and administrative state changes) run strictly against an isolated local mock environment (`http://127.0.0.1:5173` & `http://127.0.0.1:5000`).
- **Zero Production Pollution:** No fake applications sent to real employers; zero modifications to live production data; zero load tests run against live infrastructure.

### The 6 Testing Scope Pillars
1. **Job Listings:** Verified job titles, companies, salary ranges (e.g. `₹3–5 LPA`), experience requirements (`0–2 years`, `Fresher`), employment badges, and role descriptions.
2. **Navigation:** Verified role card clicks open the correct vacancy modal, dedicated permalinks (`/jobs/:id`), pagination controls, and modal dismissal (`Close`, `Cancel`, `Esc`).
3. **Form Validation:** Validated required fields, RFC email format checks, whitespace-only input sanitization, 10-digit mobile number boundaries, and cover letter character counters (500 chars).
4. **Submission Behavior:** Verified success dialog with unique tracking Reference IDs (`CN-XXXXXXX`), double-click prevention via disabled button states (`disabled={submitting}`), and duplicate application rejection.
5. **Error Handling:** Verified non-existent job permalinks render an accessible 404 page, empty keyword search results display friendly empty states with reset actions, and closed job listings block submissions.
6. **Cross-Browser & Responsiveness:** Verified mobile viewports (375px iPhone SE), responsive drawer navigation, zero horizontal overflow, and WCAG keyboard/ARIA compliance.

---

## 🏗️ System Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                   CareerNest QA Lab Stack                   │
├──────────────────────────────┬──────────────────────────────┤
│ Frontend (Port 5173)         │ Backend API (Port 5000)      │
│ • React 19 (SPA)             │ • Express 5.3 REST Engine    │
│ • Vite 6 + Tailwind CSS      │ • JWT Cookie Authentication  │
│ • Lucide React Icons         │ • Multer Multipart Uploads   │
│ • Accessible Semantic HTML5  │ • Helmet Security & Rate Lim │
│ • Local State & Context API  │ • Deterministic JSON Store   │
└──────────────────────────────┴──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    Playwright E2E Runner             Vitest & Supertest
    (51 Browser Scenarios)          (37 Unit & API Scenarios)
```

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- **Node.js:** v20.x or higher
- **npm:** v10.x or higher
- **Operating System:** Windows, macOS, or Linux

### 1. Installation
Clone the repository and install all project dependencies:
```bash
git clone https://github.com/abdulhameethu-m/HireKiwi-job-portal-.git
cd HireKiwi-job-portal-
npm install
```

### 2. Install Playwright Browsers
Install the required Chromium browser binaries:
```bash
npx playwright install chromium
```

### 3. Initialize / Seed the Test Database
Seed the local database with deterministic test records (admin, candidates, 16 job vacancies):
```bash
npm run seed
```

### 4. Start the Application Locally
Run both the frontend and backend servers concurrently:
```bash
node scripts/start-all.js
# Or run using npm:
npm start
```

The services will start at:
- **Frontend Web Portal:** [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend REST API:** [http://127.0.0.1:5000](http://127.0.0.1:5000)

#### Pre-Configured Test Credentials
| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Platform Administrator** | `admin@careernest.test` | `AdminPass123!` | Full Admin Portal, Vacancy CRUD, Status Updates |
| **Job Candidate** | `candidate@example.com` | `CandidatePass123!` | Job Discovery, Applications, Dashboard |
| **New Candidate** | Self-registered via `/register` | User defined | Standard candidate workflows |

---

## 🧪 Test Execution Guide

All automated test suites can be executed via npm scripts:

### 1. Run the High-Priority Playwright Scenarios (Deliverable 3)
Executes the high-priority automated scenarios in `tests/sample.spec.js`:
```bash
npx playwright test tests/sample.spec.js
```

### 2. Run the Complete Playwright End-to-End Suite (51 Tests)
Executes all end-to-end tests across headless Chromium with automatic server boot:
```bash
npm test
```

### 3. Run Playwright Tests with Headed Browser (Visual Mode)
Opens the real Chromium browser window so you can watch tests execute live:
```bash
npm run test:headed
```

### 4. Run Vitest Unit Tests (20 Tests)
Runs fast validation, store querying, and security hashing unit tests:
```bash
npm run test:unit
```

### 5. Run Supertest REST API Tests (17 Tests)
Validates Express REST API endpoints, status codes, RBAC, and multipart file uploads:
```bash
npm run test:api
```

### 6. Run the Master Regression Test Suite (All 88 Tests)
Executes unit tests, API tests, and Playwright E2E suites sequentially:
```bash
npm run test:all
```

### 7. View the Interactive Playwright HTML Report
Inspect detailed test execution traces, visual steps, and timings:
```bash
npm run test:report
```

---

## 📊 Complete Test Execution Results & Metrics

### Summary Matrix
| Test Tier | Framework / Tool | Tests Executed | Passed | Failed | Duration | Pass Rate |
|---|---|---:|---:|---:|---:|---:|
| **Unit Testing** | Vitest 5.0 | 20 | 20 | 0 | ~1.8s | **100%** |
| **REST API Integration** | Supertest 7.3 | 17 | 17 | 0 | ~1.5s | **100%** |
| **High-Priority Scenarios** | Playwright 1.55+ (`sample.spec.js`) | 6 | 6 | 0 | ~12.2s | **100%** |
| **Full End-to-End Suite** | Playwright 1.55+ (`e2e/` & `job-portal`) | 45 | 45 | 0 | ~39.6s | **100%** |
| **Total Automated Tests** | **All Combined Tiers** | **88** | **88** | **0** | **~55s** | **100%** |

### Suite Breakdown
```
========================================================================================
Test Suite                                         Framework   Passed / Total   Status
========================================================================================
tests/sample.spec.js (Deliverable 3 High-Priority) Playwright   6 / 6 (100%)    PASSED
tests/job-portal.spec.js (Public Discovery & Flow) Playwright  17 / 17 (100%)   PASSED
tests/e2e/registration.spec.js (Candidate Account) Playwright   6 / 6 (100%)    PASSED
tests/e2e/auth.spec.js (Authentication & Sessions) Playwright   6 / 6 (100%)    PASSED
tests/e2e/jobs.spec.js (Catalog, Search & 404)     Playwright   5 / 5 (100%)    PASSED
tests/e2e/dashboard.spec.js (Candidate Dashboard)  Playwright   3 / 3 (100%)    PASSED
tests/e2e/admin.spec.js (RBAC Governance & KPIs)   Playwright   5 / 5 (100%)    PASSED
tests/e2e/accessibility.spec.js (A11y & Mobile)    Playwright   3 / 3 (100%)    PASSED
tests/unit/validators.test.js (Input Regex/Bounds) Vitest      12 / 12 (100%)   PASSED
tests/unit/store.test.js (Query Engine & Seed)     Vitest       5 / 5 (100%)    PASSED
tests/unit/security.test.js (Bcrypt & XSS Guard)   Vitest       3 / 3 (100%)    PASSED
tests/api/api.test.js (Endpoints, Codes & RBAC)    Supertest   17 / 17 (100%)   PASSED
========================================================================================
Total Automated Scenarios                                      88 / 88 (100%)   PASSED
========================================================================================
```

---

## 🐛 Defect Lifecycle & Resolution Summary

During development and exploratory testing, 6 real defects were identified, triaged, resolved, and verified:

| Bug ID | Title & Component | Severity | Priority | Resolution Status |
|---|---|---|---|---|
| **BUG-001** | Express 5 Route Wildcard Incompatibility (`app.use('/api/*', ...)`) | Critical (P1) | P1 | **Fixed & Verified** |
| **BUG-002** | Unescaped single quote in Playwright test locator string | High (P2) | P1 | **Fixed & Verified** |
| **BUG-003** | Keyword search substring collision ("Java" matches "JavaScript") | High (P2) | P2 | **Fixed & Verified** |
| **BUG-004** | Playwright strict mode exception on ambiguous button labels | High (P2) | P2 | **Fixed & Verified** |
| **BUG-005** | Double currency symbol display in related vacancy cards (`₹ ₹`) | Low (P4) | P3 | **Fixed & Verified** |
| **BUG-006** | Job Card title element semantic role alignment for accessible tests | Medium (P3) | P2 | **Fixed & Verified** |

Full defect details with reproduction steps, root cause analysis, and code diffs can be found in [`BUG_REPORTS.md`](BUG_REPORTS.md).

---

## 📁 Repository Directory Structure

```
mock-job-portal-qa/
├── docs/                             # Dedicated QA documentation package
│   ├── TEST_PLAN.md                  # Complete QA test plan
│   ├── TEST_CASES.md                 # Test cases specification & log
│   ├── BUG_REPORTS.md                # Formal defect reports
│   ├── TEST_EXECUTION_REPORT.md      # Quality gate summary report
│   ├── TRACEABILITY_MATRIX.md        # Requirements to test mapping
│   ├── KNOWN_LIMITATIONS.md          # Architectural boundaries
│   └── TEST_DATA.md                  # Test fixtures & seed documentation
├── server/                           # Backend Express REST application
│   ├── src/                          # Express 5 app, routes, controllers, middleware
│   └── data/                         # Local persistent JSON database store
├── src/                              # Frontend React 19 application
│   ├── components/                   # Job cards, application modals, navbar
│   ├── pages/                        # Home, Jobs, JobDetail, Login, Dashboard, Admin
│   └── services/                     # Axios API client
├── tests/                            # Multi-tier Automated Test Suites
│   ├── sample.spec.js                # ★ Deliverable 3: High-Priority Scenarios
│   ├── job-portal.spec.js            # Public Discovery & Flow E2E Tests (17 tests)
│   ├── e2e/                          # Dedicated End-to-End Suites
│   │   ├── accessibility.spec.js     # Keyboard & 375px mobile responsiveness
│   │   ├── admin.spec.js             # RBAC & administrative portal
│   │   ├── auth.spec.js              # Candidate login & session management
│   │   ├── dashboard.spec.js         # Candidate dashboard & applications
│   │   ├── jobs.spec.js              # Dedicated catalog & 404 permalinks
│   │   └── registration.spec.js      # Account registration & input rules
│   ├── unit/                         # Vitest Unit Tests (20 tests)
│   └── api/                          # Supertest API Integration Tests (17 tests)
├── BUG_REPORTS.md                    # Root copy of defect reports
├── TEST_CASES.md                     # Root copy of test cases specification
├── TEST_PLAN.md                      # Root copy of test plan
├── README.md                         # Complete project documentation & guide
├── package.json                      # Project scripts and dependencies
└── playwright.config.js              # Playwright test configuration
```

---

## 👤 Author & QA Assessment Credits
- **Project:** CareerNest / HireKiwi Job Portal QA Automation
- **Target Repository:** [abdulhameethu-m/HireKiwi-job-portal-](https://github.com/abdulhameethu-m/HireKiwi-job-portal-)
- **Assessment Quality Gate:** **PASSED (100% Clearance)**