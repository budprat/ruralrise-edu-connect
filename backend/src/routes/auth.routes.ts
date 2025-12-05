// ================================================================
// Authentication Routes
// ================================================================

import { Router } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { Role } from '@prisma/client';

const router = Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.nativeEnum(Role),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// POST /api/auth/signup
router.post('/signup', validateBody(signupSchema), async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);

    // Set refresh token in response
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, {
      user: result.user,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresIn,
    }, 'Account created successfully', 201);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    // Set refresh token in response
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      user: result.user,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresIn,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', validateBody(refreshSchema), async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return sendError(res, 'Refresh token is required', 400, 'Bad Request');
    }

    const result = await authService.refreshTokens(refreshToken);

    // Set new refresh token
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresIn,
    }, 'Token refreshed');
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user!.userId);
    sendSuccess(res, user, 'User retrieved');
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/password-reset/request
router.post('/password-reset/request', async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    sendSuccess(res, result, 'Password reset request processed');
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/password-reset/confirm
router.post('/password-reset/confirm', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    sendSuccess(res, null, 'Password reset successful');
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/verify-email (stub)
router.post('/verify-email', async (req, res) => {
  sendSuccess(res, null, 'Email verification not implemented');
});

// POST /api/auth/verify-email/resend (stub)
router.post('/verify-email/resend', async (req, res) => {
  sendSuccess(res, null, 'Verification email resent');
});

export default router;
