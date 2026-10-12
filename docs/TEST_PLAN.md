# Test Plan — CareerNest QA Lab

## 1. Master Overview & Objectives
**CareerNest QA Lab** is a production-grade, simulated recruitment platform built specifically for comprehensive QA automation engineering, test strategy validation, defect lifecycle tracking, and CI/CD demonstration.

The primary objective of this test plan is to establish a rigorous, repeatable quality assurance verification framework across:
1. **Frontend User Experience (SPA):** Discovery, multi-parameter search/filters, modal interactions, candidate registration, authentication flows, candidate dashboard, and responsive mobile rendering.
2. **Backend REST APIs:** Authentication, role-based authorization (RBAC), vacancy CRUD operations, multipart resume uploads, rate limiting, and persistent JSON store operations.
3. **Admin Governance:** Administrative dashboard, live KPI tracking, vacancy lifecycle management (active/closed toggle), and applicant pipeline progression.
4. **Security & Boundary Validation:** XSS input sanitization, SQL/JSON injection defense, password hashing verification, JWT token expiration, and CSRF/CORS header validations.

---

## 2. In-Scope vs. Out-of-Scope

### 2.1 In-Scope
- **User Authentication & Session Management:**
  - Registration with duplicate email prevention, password complexity checks, phone number format constraints.
  - Login authentication (JWT cookie + Bearer token fallback), remember me persistence, and graceful logout.
  - Unauthenticated access redirects and role authorization checks.
- **Job Discovery & Search Engine:**
  - Keyword search with word-boundary precision (e.g. "Java" vs. "JavaScript").
  - Multi-location filtering (Coimbatore, Chennai, Bengaluru, Hyderabad, Remote).
  - Empty state handling and instant filter resetting.
  - Detailed vacancy view (`/jobs/:id`) and closed status enforcement.
- **Application Workflow:**
  - Modal-based multi-step candidate application submission.
  - Client and server-side validation (Full name, valid email, 10-digit phone, experience selection, cover letter character limits).
  - Resume file upload validation (allowed MIME types, size thresholds).
  - Reference tracking ID generation and candidate dashboard visibility.
- **Applicant & Admin Dashboards:**
  - Applicant dashboard (`/dashboard`) displaying historical submissions, status badges, and profile updates.
  - Admin management portal (`/admin`) guarded by RBAC, KPI metrics calculation, job vacancy publishing/editing/toggling, and candidate status progression.
- **Accessibility & Responsiveness:**
  - Keyboard navigation (Tab order, Enter submission, Esc modal dismissal).
  - ARIA attributes (`role="dialog"`, `aria-modal="true"`, accessible form labeling).
  - Mobile layout verification (375px viewport, hamburger navigation, zero horizontal overflow).
- **Automated Verification:**
  - Vitest Unit tests (validation logic, store operations, security hashing).
  - Supertest API integration tests (HTTP status codes, payload contracts, auth boundaries).
  - Playwright End-to-End tests (45 full automated scenarios across real Chromium browser).

### 2.2 Out-of-Scope
- Real email SMTP transmission (simulated locally).
- Third-party payment gateway integration.
- Live external employer integration (all data runs on an isolated local persistent store).

---

## 3. Test Strategy & Methodologies
The test pyramid is implemented as follows:

```
          / \
         /   \       Playwright E2E Tests (45 Scenarios)
        / E2E \      User journeys, visual flows, cross-route transitions
       /-------\
      /   API   \    Supertest REST API Tests (17 Scenarios)
     /  Contract \   Endpoints, payloads, status codes, RBAC, file uploads
    /-------------\
   /     Unit      \  Vitest Unit Tests (20 Scenarios)
  /  & Validation   \ Input validators, security hashing, database persistence
 /-------------------\
```

### 3.1 Unit Testing Strategy (Vitest)
- Fast, isolated verification of validation helper functions, regex patterns, password bcrypt hashing, and JSON store querying/filtering algorithms.

### 3.2 Integration & API Testing Strategy (Supertest)
- Verification of Express 5 REST routes without requiring browser overhead.
- Validates status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests`).
- Tests edge cases such as invalid token signatures, missing multipart files, duplicate email collisions, and unprivileged admin access attempts.

### 3.3 End-to-End Testing Strategy (Playwright)
- Chromium headless and headed execution.
- Deterministic test isolation via automated `npm run seed` initialization before suites.
- Web-first assertions with automatic retry and strict mode locators.
- Traces and screenshots generated on test failure.

---

## 4. Test Environment & Prerequisites
- **Runtime:** Node.js v20+ / Windows & Ubuntu environments.
- **Frontend Stack:** React 19, Vite, Tailwind CSS, Lucide icons (Runs on `http://127.0.0.1:5173`).
- **Backend Stack:** Express 5, JWT, Multer, Helmet, Rate Limit, Local JSON Store (Runs on `http://127.0.0.1:5000`).
- **Test Frameworks:** Vitest 5.0, Supertest 7.3, Playwright 1.55+.

---

## 5. Entry & Exit Criteria

### 5.1 Entry Criteria
1. Clean dependency installation (`npm install`).
2. Playwright Chromium browser binaries present (`npx playwright install chromium`).
3. Local deterministic database seeded (`npm run seed`).
4. Both backend and frontend services capable of starting via `node scripts/start-all.js`.

### 5.2 Exit Criteria
1. 100% pass rate across all Vitest unit and API test suites (37/37 passing).
2. 100% pass rate across all Playwright E2E test suites (45/45 passing).
3. Zero unresolved P1 (Critical) or P2 (High) defects.
4. Comprehensive test cases, bug reports, and traceability matrices compiled and verified.
5. Codebase and documentation committed cleanly to the target GitHub repository.
