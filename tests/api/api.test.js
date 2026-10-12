import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/src/app.js';
import { dbStore } from '../../server/src/models/Store.js';

describe('CareerNest REST API Integration Tests', () => {
  let app;
  let applicantCookie = '';
  let adminCookie = '';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = await createApp();
    await dbStore.init(true);
  });

  describe('Authentication Endpoints (/api/auth)', () => {
    it('POST /api/auth/register - should create a new applicant account', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'API Test Candidate',
          email: 'api.candidate@example.com',
          phone: '9876543219',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          terms: true
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('api.candidate@example.com');
      expect(res.body.user.password).toBeUndefined(); // Password must never be leaked
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('POST /api/auth/register - should reject duplicate email address', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Duplicate Tester',
          email: 'api.candidate@example.com',
          phone: '9876543219',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          terms: true
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('POST /api/auth/login - should sign in valid applicant and set HTTP-only cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'candidate@example.com',
          password: 'CandidatePass123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.user.fullName).toBe('Test Candidate');
      expect(res.headers['set-cookie']).toBeDefined();
      applicantCookie = res.headers['set-cookie'];
    });

    it('POST /api/auth/login - should sign in test administrator', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@careernest.test',
          password: 'AdminPass123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe('admin');
      adminCookie = res.headers['set-cookie'];
    });

    it('POST /api/auth/login - should return generic 401 on incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'candidate@example.com',
          password: 'WrongPassword999!'
        });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe('Invalid email or password.');
    });

    it('GET /api/auth/me - should return current session profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', applicantCookie);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('candidate@example.com');
    });

    it('POST /api/auth/logout - should clear cookie', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('signed out');
    });
  });

  describe('Jobs Endpoints (/api/jobs)', () => {
    it('GET /api/jobs - should return list of active jobs with pagination metadata', async () => {
      const res = await request(app)
        .get('/api/jobs?limit=5');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBeLessThanOrEqual(5);
      expect(res.body.total).toBeGreaterThanOrEqual(10);
      expect(res.body.page).toBe(1);
    });

    it('GET /api/jobs/:id - should return job details and related vacancies', async () => {
      const res = await request(app)
        .get('/api/jobs/1');

      expect(res.status).toBe(200);
      expect(res.body.job.title).toBe('Junior Java Developer');
      expect(Array.isArray(res.body.relatedJobs)).toBe(true);
    });

    it('GET /api/jobs/:id - should return 404 for unknown job ID', async () => {
      const res = await request(app)
        .get('/api/jobs/99999');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('JOB_NOT_FOUND');
    });

    it('POST /api/jobs - should reject non-admin request', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Cookie', applicantCookie)
        .send({
          title: 'Unauthorized Post',
          company: 'Hacker Inc',
          location: 'Remote',
          experience: '1 year',
          salary: '₹5 LPA',
          type: 'Full-time',
          category: 'Software Development',
          description: 'This should be blocked.',
          skills: ['None']
        });

      expect(res.status).toBe(403);
    });

    it('POST /api/jobs - should allow admin to publish a new vacancy', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Cookie', adminCookie)
        .send({
          title: 'Senior QA Architect',
          company: 'Nexus QA Labs',
          location: 'Bengaluru',
          experience: '5+ years',
          salary: '₹18–24 LPA',
          type: 'Full-time',
          category: 'Quality Assurance',
          description: 'Architect scalable end-to-end testing infrastructure.',
          skills: ['Playwright', 'Vitest', 'Supertest', 'Docker']
        });

      expect(res.status).toBe(201);
      expect(res.body.job.id).toBeDefined();
      expect(res.body.job.title).toBe('Senior QA Architect');
    });
  });

  describe('Applications Endpoints (/api/applications)', () => {
    it('POST /api/applications - should submit valid application and return reference ID', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookie)
        .send({
          jobId: 1,
          fullName: 'API Submitter',
          email: 'api.submitter@example.com',
          phone: '9876543210',
          experience: '0–1 years',
          coverLetter: 'Excited to apply for Java Developer position.'
        });

      expect(res.status).toBe(201);
      expect(res.body.referenceId).toMatch(/^CN-\d{7}$/);
      expect(res.body.application.status).toBe('Submitted');
    });

    it('POST /api/applications - should reject application to a closed job', async () => {
      const res = await request(app)
        .post('/api/applications')
        .send({
          jobId: 16, // Job 16 is Legacy Mainframe Support Specialist (closed)
          fullName: 'Late Candidate',
          email: 'late.candidate@example.com',
          phone: '9876543210',
          experience: '2+ years'
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('JOB_CLOSED');
    });

    it('GET /api/applications/mine - should return current applicant applications', async () => {
      const res = await request(app)
        .get('/api/applications/mine')
        .set('Cookie', applicantCookie);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.applications)).toBe(true);
    });

    it('GET /api/admin/applications - should allow admin to view all candidate applications', async () => {
      const res = await request(app)
        .get('/api/admin/applications')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.applications.length).toBeGreaterThanOrEqual(1);
    });

    it('PATCH /api/admin/applications/:id/status - should update status and history note', async () => {
      const allApps = await request(app)
        .get('/api/admin/applications')
        .set('Cookie', adminCookie);

      const targetApp = allApps.body.applications[0];

      const res = await request(app)
        .patch(`/api/admin/applications/${targetApp.id}/status`)
        .set('Cookie', adminCookie)
        .send({
          status: 'Shortlisted',
          note: 'Profile matched QA automation benchmark criteria.'
        });

      expect(res.status).toBe(200);
      expect(res.body.application.status).toBe('Shortlisted');
    });
  });
});
