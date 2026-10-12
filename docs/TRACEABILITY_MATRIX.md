# Requirements Traceability Matrix (RTM) — CareerNest QA Lab

The Requirements Traceability Matrix maps business and functional requirements to system components, test cases, and automated test implementations.

| Requirement ID | Business Requirement Description | Component / Route | Test Case ID | Test Automation Script | Status |
|---|---|---|---|---|---|
| **REQ-AUTH-01** | User registration with input validation | `RegisterPage.jsx` / `POST /api/auth/register` | `TC_REG_01`, `TC_REG_03` - `06` | `tests/e2e/registration.spec.js` | PASSED |
| **REQ-AUTH-02** | Prevent duplicate email account registration | `RegisterPage.jsx` / `POST /api/auth/register` | `TC_REG_02` | `tests/e2e/registration.spec.js` | PASSED |
| **REQ-AUTH-03** | User sign in with JWT authentication | `LoginPage.jsx` / `POST /api/auth/login` | `TC_AUTH_01`, `TC_AUTH_02`, `TC_AUTH_03` | `tests/e2e/auth.spec.js` | PASSED |
| **REQ-AUTH-04** | Toggle password visibility | `LoginPage.jsx` / `RegisterPage.jsx` | `TC_AUTH_04` | `tests/e2e/auth.spec.js` | PASSED |
| **REQ-AUTH-05** | Protected route redirection for unauthenticated users | `ProtectedRoute.jsx` / `/dashboard` | `TC_AUTH_05` | `tests/e2e/auth.spec.js` | PASSED |
| **REQ-AUTH-06** | Secure session termination (Sign out) | `Navbar.jsx` / `POST /api/auth/logout` | `TC_AUTH_06` | `tests/e2e/auth.spec.js` | PASSED |
| **REQ-JOB-01** | Display curated vacancy recommendations on Homepage | `HomePage.jsx` / `GET /api/jobs` | `TC01` | `tests/job-portal.spec.js` | PASSED |
| **REQ-JOB-02** | Keyword search with exact word boundary matching | `HomePage.jsx` / `GET /api/jobs?keyword=` | `TC02` | `tests/job-portal.spec.js` | PASSED |
| **REQ-JOB-03** | Filter vacancies by city location | `HomePage.jsx` / `GET /api/jobs?location=` | `TC03` | `tests/job-portal.spec.js` | PASSED |
| **REQ-JOB-04** | Empty state display and filter reset | `HomePage.jsx` | `TC04`, `TC05` | `tests/job-portal.spec.js` | PASSED |
| **REQ-JOB-05** | View vacancy details modal | `JobModal.jsx` | `TC06`, `TC07` | `tests/job-portal.spec.js` | PASSED |
| **REQ-JOB-06** | Dedicated jobs catalog route with pagination | `JobsPage.jsx` / `/jobs` | `TC_JOB_01`, `TC_JOB_02` | `tests/e2e/jobs.spec.js` | PASSED |
| **REQ-JOB-07** | Direct URL permalinks for job postings | `JobDetailPage.jsx` / `/jobs/:id` | `TC_JOB_03` | `tests/e2e/jobs.spec.js` | PASSED |
| **REQ-JOB-08** | Handle invalid job IDs with 404 response | `NotFoundPage.jsx` | `TC_JOB_04` | `tests/e2e/jobs.spec.js` | PASSED |
| **REQ-JOB-09** | Enforce closed vacancy state and disable apply button | `JobDetailPage.jsx` | `TC_JOB_05` | `tests/e2e/jobs.spec.js` | PASSED |
| **REQ-APP-01** | Open application form for specific job | `ApplicationModal.jsx` | `TC08` | `tests/job-portal.spec.js` | PASSED |
| **REQ-APP-02** | Validate application inputs (name, email, phone) | `ApplicationModal.jsx` / `validators.js` | `TC09` - `TC12` | `tests/job-portal.spec.js` | PASSED |
| **REQ-APP-03** | Submit application and generate Reference ID | `ApplicationModal.jsx` / `POST /api/applications` | `TC13` | `tests/job-portal.spec.js` | PASSED |
| **REQ-APP-04** | Cover letter dynamic character counter | `ApplicationModal.jsx` | `TC14` | `tests/job-portal.spec.js` | PASSED |
| **REQ-APP-05** | Cancel application modal without side effects | `ApplicationModal.jsx` | `TC15` | `tests/job-portal.spec.js` | PASSED |
| **REQ-APP-06** | Optional cover letter submission | `ApplicationModal.jsx` | `TC17` | `tests/job-portal.spec.js` | PASSED |
| **REQ-DASH-01** | Applicant dashboard listing applied vacancies | `DashboardPage.jsx` / `/dashboard` | `TC_DASH_01` | `tests/e2e/dashboard.spec.js` | PASSED |
| **REQ-DASH-02** | Application progression status badges | `DashboardPage.jsx` | `TC_DASH_02` | `tests/e2e/dashboard.spec.js` | PASSED |
| **REQ-DASH-03** | Update candidate profile headline | `DashboardPage.jsx` / `PUT /api/profile` | `TC_DASH_03` | `tests/e2e/dashboard.spec.js` | PASSED |
| **REQ-ADMIN-01** | Restrict `/admin` to admin role (RBAC) | `AdminPage.jsx` / `requireAdmin.js` | `TC_ADMIN_01` | `tests/e2e/admin.spec.js` | PASSED |
| **REQ-ADMIN-02** | Admin dashboard overview and live platform KPIs | `AdminPage.jsx` | `TC_ADMIN_02` | `tests/e2e/admin.spec.js` | PASSED |
| **REQ-ADMIN-03** | Admin vacancy management: Create new job | `AdminPage.jsx` / `POST /api/jobs` | `TC_ADMIN_03` | `tests/e2e/admin.spec.js` | PASSED |
| **REQ-ADMIN-04** | Admin vacancy management: Toggle Active/Closed | `AdminPage.jsx` / `PUT /api/jobs/:id` | `TC_ADMIN_04` | `tests/e2e/admin.spec.js` | PASSED |
| **REQ-ADMIN-05** | Candidate application progression status update | `AdminPage.jsx` / `PATCH /api/admin/applications`| `TC_ADMIN_05` | `tests/e2e/admin.spec.js` | PASSED |
| **REQ-A11Y-01** | Keyboard Tab and Enter accessibility | Form inputs & buttons | `TC_A11Y_01` | `tests/e2e/accessibility.spec.js` | PASSED |
| **REQ-A11Y-02** | Accessible modal dialogs and ARIA compliance | `JobModal.jsx` / `ApplicationModal.jsx` | `TC_A11Y_02` | `tests/e2e/accessibility.spec.js` | PASSED |
| **REQ-A11Y-03** | Mobile responsive viewport (375px) without overflow | Responsive CSS tokens & drawer | `TC_A11Y_03` | `tests/e2e/accessibility.spec.js` | PASSED |
