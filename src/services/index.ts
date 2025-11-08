// ================================================================
// Services Index - Central Export
// ================================================================

export { default as apiClient, isAuthenticated, getAuthToken, clearAuth } from './apiClient';
export { default as authService } from './authService';
export { default as learnerService } from './learnerService';
export { default as trainerService } from './trainerService';
export { default as operationsService } from './operationsService';

// Re-export for convenience
export * from './apiClient';
export * from './authService';
export * from './learnerService';
export * from './trainerService';
export * from './operationsService';
