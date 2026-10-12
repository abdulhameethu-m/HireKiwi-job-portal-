# Known Limitations & Assessment Architecture Notes — CareerNest QA Lab

CareerNest QA Lab is engineered intentionally as an isolated, self-contained assessment project for QA automation and software testing demonstration.

---

## 1. Architectural Scope & Intentional Design Choices

1. **Local Persistent JSON Store vs External Database Daemons:**
   - To guarantee zero external dependencies and 100% deterministic portability across diverse developer/evaluator machines without requiring PostgreSQL, MySQL, or MongoDB daemons running, all persistent state is stored in `server/data/db.json`.
   - The custom storage engine implements query filtering, index-based updates, pagination, and atomic write operations.
   - For a production deployment, this layer would map to an ORM (e.g., Prisma or TypeORM) backing a managed PostgreSQL database.

2. **Simulated Email Notifications:**
   - The "Forgot Password" feature returns a simulated success response (`POST /api/auth/forgot-password`) rather than sending live emails via an external SMTP server (e.g. SendGrid or Amazon SES) to avoid network dependencies or leaked credentials.

3. **Isolated Test File Storage:**
   - Uploaded candidate resumes are stored locally inside `server/uploads/` with filename sanitization. In enterprise production, files would stream directly to an S3-compatible cloud object store with pre-signed URLs.

4. **Zero Live Employer Association:**
   - CareerNest QA Lab is an original, synthetic recruitment sandbox. All companies (e.g., *BrightPath Systems*, *Northstar Digital*) and vacancies are entirely fictional and designed for automated test scenarios.
   - The application does not connect to or scrape Naukri, HireKiwi, or any live hiring platform.

---

## 2. Test Resilience & Deterministic Reset

- If test data becomes modified during exploratory testing, running `npm run seed` or clicking the "Reset Database" button inside the Admin portal immediately restores the catalog, users, and applications to their known test baseline.
