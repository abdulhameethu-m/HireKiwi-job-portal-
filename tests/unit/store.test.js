import { describe, it, expect, beforeEach } from 'vitest';
import { dbStore } from '../../server/src/models/Store.js';

describe('Store Engine Unit Tests', () => {
  beforeEach(async () => {
    await dbStore.init(true);
  });

  it('should find user by email (case-insensitive and trimmed)', () => {
    const user = dbStore.findUserByEmail('  ADMIN@CAREERNEST.TEST  ');
    expect(user).not.toBeNull();
    expect(user.role).toBe('admin');
  });

  it('should create and retrieve a new candidate user', () => {
    const newUser = dbStore.createUser({
      fullName: 'Unit Tester',
      email: 'unit.tester@example.com',
      phone: '9988776655',
      password: 'hashedpassword',
      role: 'applicant'
    });

    expect(newUser.id).toBeDefined();
    const found = dbStore.findUserByEmail('unit.tester@example.com');
    expect(found.fullName).toBe('Unit Tester');
  });

  it('should filter jobs by keyword and location correctly', () => {
    const result = dbStore.getJobs({
      query: 'Junior',
      location: 'Coimbatore',
      status: 'active'
    });

    expect(result.jobs.length).toBeGreaterThanOrEqual(1);
    expect(result.jobs[0].title).toContain('Junior');
    expect(result.jobs[0].location).toBe('Coimbatore');
  });

  it('should paginate jobs accurately', () => {
    const page1 = dbStore.getJobs({ limit: 4, page: 1, status: 'active' });
    const page2 = dbStore.getJobs({ limit: 4, page: 2, status: 'active' });

    expect(page1.jobs.length).toBe(4);
    expect(page2.jobs.length).toBe(4);
    expect(page1.jobs[0].id).not.toBe(page2.jobs[0].id);
    expect(page1.totalPages).toBeGreaterThanOrEqual(4);
  });

  it('should record an application and generate unique reference ID', () => {
    const app = dbStore.createApplication({
      jobId: 1,
      jobTitle: 'Junior Java Developer',
      company: 'Northstar Digital',
      fullName: 'Unit Candidate',
      email: 'unit.cand@example.com',
      phone: '9876543210',
      experience: 'Fresher'
    });

    expect(app.referenceId).toMatch(/^CN-\d{7}$/);
    expect(app.status).toBe('Submitted');

    const hasApplied = dbStore.hasApplied(1, 'unit.cand@example.com');
    expect(hasApplied).toBe(true);
  });
});
