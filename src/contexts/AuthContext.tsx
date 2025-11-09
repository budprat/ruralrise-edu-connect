// ================================================================
// Authentication Context
// ================================================================
// Provides authentication state and methods throughout the app
// ================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services';
import type { User, LoginCredentials, SignupData } from '@/types';

// ----------------------------------------------------------------
// Context Types
// ----------------------------------------------------------------

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// ----------------------------------------------------------------
// Create Context
// ----------------------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------------------------------------------------
// Provider Component
// ----------------------------------------------------------------

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize - check if user is already authenticated
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(
        import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token'
      );

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // Token invalid or expired
        console.error('Auth initialization failed:', err);
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'ruralrise_auth_token');
        localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'ruralrise_refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: loggedInUser } = await authService.login(credentials);
      setUser(loggedInUser);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign up new user
   */
  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: newUser } = await authService.signup(data);
      setUser(newUser);
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    if (!user) return;

    try {
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to refresh user:', err);
      // If refresh fails, user might be logged out
      setUser(null);
    }
  }, [user]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ----------------------------------------------------------------
// Hook to use Auth Context
// ----------------------------------------------------------------

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
