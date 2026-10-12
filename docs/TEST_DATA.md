# Test Data Catalog & Seed Specifications — CareerNest QA Lab

All test data in CareerNest QA Lab is deterministic and isolated in `server/data/db.json`. It can be re-initialized at any time using:
```bash
npm run seed
```

---

## 1. Test User Accounts

| Role | Email Address | Password | Permissions / Capabilities |
|---|---|---|---|
| **Admin** | `admin@careernest.test` | `AdminPass123!` | Full governance access to `/admin`, create/edit/delete jobs, toggle active/closed, update applicant progression status, reseed database. |
| **Candidate** | `candidate@example.com` | `CandidatePass123!` | Standard applicant access to `/dashboard`, apply to jobs, track reference IDs, update headline. |
| **Alternate User** | `john.doe@example.com` | `CandidatePass123!` | Pre-seeded applicant account for multi-user status regression tests. |

---

## 2. Seed Vacancy Catalog

The deterministic seed script populates 16 realistic vacancies across different domains, locations, and experience requirements:

| ID | Title | Company | Location | Experience | Salary | Status | Primary Skills |
|---|---|---|---|---|---|---|---|
| 1 | Junior Java Developer | Northstar Digital | Coimbatore | 0–2 years | ₹3–5 LPA | active | Java, SQL, Git |
| 2 | QA Engineer | BrightPath Systems | Chennai | 0–2 years | ₹3–4.5 LPA | active | Manual Testing, Playwright, API Testing |
| 3 | Technical Support Associate | CloudBridge Services | Bengaluru | 0–1 years | ₹2.5–3.5 LPA | active | Communication, Troubleshooting, SQL |
| 4 | Business Analyst Trainee | BluePeak Consulting | Remote | Fresher | ₹3–4 LPA | active | Excel, Documentation, Analysis |
| 5 | Frontend Developer Intern | PixelWorks Studio | Coimbatore | Fresher | ₹12,000–18,000/mo | active | HTML, CSS, JavaScript |
| 6 | IT Operations Associate | Evergreen Tech | Hyderabad | 0–2 years | ₹2.8–4 LPA | active | Windows, Networking, Service Desk |
| 7 | Full Stack Engineer | NovaForge Labs | Bengaluru | 2–4 years | ₹8–12 LPA | active | React, Node.js, PostgreSQL |
| 8 | DevOps Specialist | CloudOps Direct | Remote | 3–5 years | ₹10–15 LPA | active | Docker, Kubernetes, AWS, CI/CD |
| 9 | SDET Automation Engineer | TestMatrix Systems | Chennai | 2–4 years | ₹7–11 LPA | active | Playwright, TypeScript, Jest |
| 10 | Product Operations Analyst | Apex Analytics | Hyderabad | 1–3 years | ₹5–7 LPA | active | SQL, Tableau, Agile |
| 11 | Junior Python Developer | DataSpire Tech | Coimbatore | 0–2 years | ₹3.5–5 LPA | active | Python, Django, REST |
| 12 | Customer Success Specialist | PulsePoint Global | Remote | 1–2 years | ₹3.5–4.5 LPA | active | CRM, Client Relations, Zendesk |
| 13 | Mobile App Developer (Flutter) | AppCrafters Studio | Bengaluru | 1–3 years | ₹6–9 LPA | active | Flutter, Dart, Firebase |
| 14 | Security Operations Trainee | CyberShield Labs | Hyderabad | Fresher | ₹3.2–4.5 LPA | active | Network Security, Linux, SIEM |
| 15 | Technical Content Writer | ByteCraft Media | Remote | 0–2 years | ₹2.5–3.8 LPA | active | Technical Writing, SEO, Markdown |
| 16 | Legacy Mainframe Support Specialist | ArchivedTech Solutions | Chennai | 2+ years | ₹4–5 LPA | closed | COBOL, Mainframe, JCL |

---

## 3. Pre-seeded Candidate Applications

| Application Reference ID | Candidate Email | Target Job Title | Status |
|---|---|---|---|
| `APP-2026-001` | `candidate@example.com` | QA Engineer | `Under Review` |
| `APP-2026-002` | `candidate@example.com` | Junior Java Developer | `Submitted` |
| `APP-2026-003` | `john.doe@example.com` | Full Stack Engineer | `Shortlisted` |

---

## 4. Test Files for File Upload Validation

Testing multipart resume file uploads utilizes simulated test files created dynamically during test execution:
- Allowed file types: `.pdf`, `.doc`, `.docx`
- Size threshold: Maximum 5MB
- Storage location: `server/uploads/` (sanitized with timestamp prefix)
