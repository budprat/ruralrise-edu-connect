// ================================================================
// Authentication Service
// ================================================================
// Handles user authentication, registration, and token management
// ================================================================

import apiClient from './apiClient';
import type {
  User,
  LoginCredentials,
  SignupData,
  AuthTokens,
  APIResponse
} from '@/types';

// ----------------------------------------------------------------
// Authentication API Calls
// ----------------------------------------------------------------

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<APIResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/login',
      credentials
    );

    // Store tokens in localStorage
    localStorage.setItem(
      import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token',
      response.data.data.tokens.accessToken
    );
    localStorage.setItem(
      import.meta.env.VITE_REFRESH_TOKEN_KEY || 'ruralrise_refresh_token',
      response.data.data.tokens.refreshToken
    );

    return response.data.data;
  },

  /**
   * Register new user
   */
  signup: async (data: SignupData): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<APIResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/signup',
      data
    );

    // Store tokens in localStorage
    localStorage.setItem(
      import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token',
      response.data.data.tokens.accessToken
    );
    localStorage.setItem(
      import.meta.env.VITE_REFRESH_TOKEN_KEY || 'ruralrise_refresh_token',
      response.data.data.tokens.refreshToken
    );

    return response.data.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens even if API call fails
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token');
      localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'ruralrise_refresh_token');
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<APIResponse<User>>('/auth/me');
    return response.data.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<APIResponse<AuthTokens>>('/auth/refresh', {
      refreshToken,
    });

    // Update stored access token
    localStorage.setItem(
      import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token',
      response.data.data.accessToken
    );

    return response.data.data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/password-reset/request', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/password-reset/confirm', {
      token,
      newPassword,
    });
  },

  /**
   * Verify email address
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { token });
  },

  /**
   * Resend verification email
   */
  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post('/auth/verify-email/resend', { email });
  },
};

export default authService;
