import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, applicationSchema, jobSchema } from '../../server/src/utils/validators.js';

describe('Validation Schemas Unit Tests', () => {
  describe('Registration Schema', () => {
    it('should validate a valid registration payload', () => {
      const valid = {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '9876543210',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        terms: true
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject whitespace-only name', () => {
      const invalid = {
        fullName: '    ',
        email: 'jane@example.com',
        phone: '9876543210',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        terms: true
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject password mismatch', () => {
      const invalid = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '9876543210',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
        terms: true
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject non-10 digit phone number', () => {
      const invalid = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '12345',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        terms: true
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject unaccepted terms', () => {
      const invalid = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '9876543210',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        terms: false
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('Login Schema', () => {
    it('should validate valid login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'MyPassword123'
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'MyPassword123'
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: ''
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Application Schema', () => {
    it('should validate complete application payload', () => {
      const result = applicationSchema.safeParse({
        jobId: 1,
        fullName: 'Candidate Name',
        email: 'candidate@example.com',
        phone: '9876543210',
        experience: 'Fresher',
        coverLetter: 'I am excited about this opportunity.'
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing experience', () => {
      const result = applicationSchema.safeParse({
        jobId: 1,
        fullName: 'Candidate Name',
        email: 'candidate@example.com',
        phone: '9876543210',
        experience: ''
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Job Creation Schema', () => {
    it('should validate a complete job listing', () => {
      const result = jobSchema.safeParse({
        title: 'Senior Automation Engineer',
        company: 'CloudTech Labs',
        location: 'Bengaluru',
        experience: '3+ years',
        salary: '₹12–16 LPA',
        type: 'Full-time',
        category: 'Quality Assurance',
        description: 'Lead automated regression testing using Playwright.',
        skills: ['Playwright', 'TypeScript', 'CI/CD']
      });
      expect(result.success).toBe(true);
    });

    it('should reject short title', () => {
      const result = jobSchema.safeParse({
        title: 'QA',
        company: 'CloudTech Labs',
        location: 'Bengaluru',
        experience: '3+ years',
        salary: '₹12–16 LPA',
        type: 'Full-time',
        category: 'Quality Assurance',
        description: 'Lead automated regression testing.',
        skills: ['Playwright']
      });
      expect(result.success).toBe(false);
    });
  });
});
