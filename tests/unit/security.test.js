import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../../server/src/utils/security.js';

describe('Security Utilities Unit Tests', () => {
  it('should hash a password and verify it correctly', async () => {
    const rawPassword = 'SecureSecretPass123!';
    const hashed = await hashPassword(rawPassword);

    expect(hashed).not.toBe(rawPassword);
    expect(hashed.length).toBeGreaterThan(20);

    const match = await comparePassword(rawPassword, hashed);
    expect(match).toBe(true);

    const wrongMatch = await comparePassword('WrongPassword!', hashed);
    expect(wrongMatch).toBe(false);
  });

  it('should generate and verify JWT token payload', () => {
    const mockUser = {
      id: 'usr-test-123',
      email: 'test@example.com',
      role: 'admin',
      fullName: 'Security Admin'
    };

    const token = generateToken(mockUser);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const payload = verifyToken(token);
    expect(payload).not.toBeNull();
    expect(payload.id).toBe(mockUser.id);
    expect(payload.email).toBe(mockUser.email);
    expect(payload.role).toBe('admin');
  });

  it('should return null for tampered or invalid token', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature';
    const payload = verifyToken(invalidToken);
    expect(payload).toBeNull();
  });
});
