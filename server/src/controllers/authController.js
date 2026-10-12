import { dbStore } from '../models/Store.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { hashPassword, comparePassword, generateToken } from '../utils/security.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = dbStore.findUserByEmail(validated.email);
    if (existingUser) {
      return res.status(400).json({
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email address already exists.',
          details: { email: 'An account with this email address already exists.' }
        }
      });
    }

    const hashedPassword = await hashPassword(validated.password);
    const user = dbStore.createUser({
      fullName: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      password: hashedPassword,
      role: 'applicant',
      headline: '',
      skills: []
    });

    const token = generateToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);

    const { password, ...safeUser } = user;
    return res.status(201).json({
      message: 'Account created successfully.',
      user: safeUser,
      token
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = dbStore.findUserByEmail(validated.email);
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        }
      });
    }

    const match = await comparePassword(validated.password, user.password);
    if (!match) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        }
      });
    }

    const token = generateToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);

    const { password, ...safeUser } = user;
    return res.status(200).json({
      message: 'Signed in successfully.',
      user: safeUser,
      token
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.status(200).json({
    message: 'Successfully signed out.'
  });
};

export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'No active session.'
      }
    });
  }

  const user = dbStore.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User account not found.'
      }
    });
  }

  const { password, ...safeUser } = user;
  return res.status(200).json({
    user: safeUser
  });
};

export const forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email address is required.'
      }
    });
  }

  // Safe mock reset message
  return res.status(200).json({
    message: 'If an account exists with this email address, password reset instructions have been simulated.',
    mockResetToken: `mock-reset-${Math.random().toString(36).slice(2, 10)}`
  });
};
