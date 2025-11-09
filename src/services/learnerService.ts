// ================================================================
// Learner Service
// ================================================================
// Handles all learner-related API calls: profile, lessons,
// progress, achievements, and AI insights
// ================================================================

import apiClient from './apiClient';
import type {
  User,
  UserProfile,
  Lesson,
  LearningModule,
  Achievement,
  AIInsight,
  LearningPathProgress,
  LessonStartRequest,
  AssessmentSubmission,
  APIResponse,
  PaginatedResponse
} from '@/types';

// ----------------------------------------------------------------
// Learner Profile API Calls
// ----------------------------------------------------------------

export const learnerService = {
  /**
   * Get learner profile by user ID
   */
  getProfile: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get<APIResponse<UserProfile>>(
      `/learner/${userId}/profile`
    );
    return response.data.data;
  },

  /**
   * Update learner profile
   */
  updateProfile: async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch<APIResponse<UserProfile>>(
      `/learner/${userId}/profile`,
      updates
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Lessons & Learning Path
  // ----------------------------------------------------------------

  /**
   * Get all available lessons for learner
   */
  getLessons: async (userId: string, filters?: {
    difficulty?: string;
    type?: string;
    offline?: boolean;
  }): Promise<Lesson[]> => {
    const response = await apiClient.get<APIResponse<Lesson[]>>(
      `/learner/${userId}/lessons`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get specific lesson details
   */
  getLesson: async (lessonId: string): Promise<Lesson> => {
    const response = await apiClient.get<APIResponse<Lesson>>(
      `/learner/lessons/${lessonId}`
    );
    return response.data.data;
  },

  /**
   * Start a lesson - triggers AI personalization
   */
  startLesson: async (request: LessonStartRequest): Promise<{ sessionId: string; content: any }> => {
    const endpoint = import.meta.env.VITE_LEARNING_PATH_WEBHOOK_URL || '/learner/learning-path';
    const response = await apiClient.post<APIResponse<{ sessionId: string; content: any }>>(
      endpoint,
      request
    );
    return response.data.data;
  },

  /**
   * Update lesson progress
   */
  updateProgress: async (
    userId: string,
    lessonId: string,
    progress: number
  ): Promise<void> => {
    await apiClient.patch(`/learner/${userId}/lessons/${lessonId}/progress`, {
      progress,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Complete a lesson
   */
  completeLesson: async (userId: string, lessonId: string): Promise<void> => {
    await apiClient.post(`/learner/${userId}/lessons/${lessonId}/complete`, {
      completedAt: new Date().toISOString(),
    });
  },

  /**
   * Get learning path (modules) for user
   */
  getLearningPath: async (userId: string): Promise<LearningModule[]> => {
    const response = await apiClient.get<APIResponse<LearningModule[]>>(
      `/learner/${userId}/learning-path`
    );
    return response.data.data;
  },

  /**
   * Get learning path progress
   */
  getLearningPathProgress: async (userId: string): Promise<LearningPathProgress[]> => {
    const response = await apiClient.get<APIResponse<LearningPathProgress[]>>(
      `/learner/${userId}/progress`
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Achievements & Gamification
  // ----------------------------------------------------------------

  /**
   * Get user achievements
   */
  getAchievements: async (userId: string): Promise<Achievement[]> => {
    const response = await apiClient.get<APIResponse<Achievement[]>>(
      `/learner/${userId}/achievements`
    );
    return response.data.data;
  },

  /**
   * Get leaderboard data
   */
  getLeaderboard: async (scope: 'global' | 'cohort', limit = 10): Promise<any[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/learner/leaderboard`,
      { params: { scope, limit } }
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // AI Insights & Recommendations
  // ----------------------------------------------------------------

  /**
   * Get AI-powered insights for learner
   */
  getAIInsights: async (userId: string): Promise<AIInsight[]> => {
    const response = await apiClient.get<APIResponse<AIInsight[]>>(
      `/learner/${userId}/ai-insights`
    );
    return response.data.data;
  },

  /**
   * Get AI-recommended next lessons
   */
  getRecommendedLessons: async (userId: string, limit = 5): Promise<Lesson[]> => {
    const response = await apiClient.get<APIResponse<Lesson[]>>(
      `/learner/${userId}/recommendations`,
      { params: { limit } }
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Assessments
  // ----------------------------------------------------------------

  /**
   * Get pending assessments for learner
   */
  getPendingAssessments: async (userId: string): Promise<any[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/learner/${userId}/assessments/pending`
    );
    return response.data.data;
  },

  /**
   * Submit assessment
   */
  submitAssessment: async (submission: AssessmentSubmission): Promise<{ score: number }> => {
    const response = await apiClient.post<APIResponse<{ score: number }>>(
      `/learner/assessments/submit`,
      submission
    );
    return response.data.data;
  },

  /**
   * Get assessment results
   */
  getAssessmentResults: async (assessmentId: string): Promise<any> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/learner/assessments/${assessmentId}/results`
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Offline Content
  // ----------------------------------------------------------------

  /**
   * Download lesson for offline use
   */
  downloadLessonOffline: async (lessonId: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/learner/lessons/${lessonId}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Get list of downloaded offline content
   */
  getOfflineContent: async (userId: string): Promise<Lesson[]> => {
    const response = await apiClient.get<APIResponse<Lesson[]>>(
      `/learner/${userId}/offline-content`
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Statistics & Analytics
  // ----------------------------------------------------------------

  /**
   * Get weekly statistics
   */
  getWeeklyStats: async (userId: string): Promise<{
    lessonsCompleted: number;
    timeSpent: number;
    pointsEarned: number;
    streak: number;
  }> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/learner/${userId}/stats/weekly`
    );
    return response.data.data;
  },

  /**
   * Get progress history
   */
  getProgressHistory: async (
    userId: string,
    timeframe: 'week' | 'month' | 'year'
  ): Promise<any[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/learner/${userId}/progress/history`,
      { params: { timeframe } }
    );
    return response.data.data;
  },
};

export default learnerService;
