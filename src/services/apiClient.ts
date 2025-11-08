// ================================================================
// API Client Configuration
// ================================================================
// Centralized axios instance with interceptors for authentication,
// error handling, and request/response transformation
// ================================================================

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { APIError, APIResponse } from '@/types';

// ----------------------------------------------------------------
// API Client Instance
// ----------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------------------
// Request Interceptor - Add Authentication Token
// ----------------------------------------------------------------

apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------
// Response Interceptor - Handle Errors & Token Refresh
// ----------------------------------------------------------------

apiClient.interceptors.response.use(
  (response: AxiosResponse<APIResponse<any>>) => {
    // Log successful responses in debug mode
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<APIError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token Expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem(
          import.meta.env.VITE_REFRESH_TOKEN_KEY || 'ruralrise_refresh_token'
        );

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;

        // Store new token
        localStorage.setItem(
          import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token',
          accessToken
        );

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token');
        localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'ruralrise_refresh_token');

        // Redirect to login
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const apiError: APIError = error.response?.data || {
      error: 'Network Error',
      message: error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      timestamp: new Date().toISOString(),
    };

    // Log errors in debug mode
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        error: apiError,
      });
    }

    return Promise.reject(apiError);
  }
);

// ----------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token');
  return !!token;
};

/**
 * Get current auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token');
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token');
  localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'ruralrise_refresh_token');
};

// ----------------------------------------------------------------
// Export API Client
// ----------------------------------------------------------------

export default apiClient;
