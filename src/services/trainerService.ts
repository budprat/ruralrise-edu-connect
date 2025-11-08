// ================================================================
// Trainer Service
// ================================================================
// Handles all trainer-related API calls: cohorts, assessments,
// interventions, and analytics
// ================================================================

import apiClient from './apiClient';
import type {
  Cohort,
  Assessment,
  AIFlag,
  InterventionRequest,
  TrainerPerformance,
  APIResponse,
  PaginatedResponse
} from '@/types';

// ----------------------------------------------------------------
// Cohort Management
// ----------------------------------------------------------------

export const trainerService = {
  /**
   * Get all cohorts for trainer
   */
  getCohorts: async (trainerId: string): Promise<Cohort[]> => {
    const response = await apiClient.get<APIResponse<Cohort[]>>(
      `/trainer/${trainerId}/cohorts`
    );
    return response.data.data;
  },

  /**
   * Get specific cohort details
   */
  getCohort: async (cohortId: string): Promise<Cohort & { learners: any[] }> => {
    const response = await apiClient.get<APIResponse<Cohort & { learners: any[] }>>(
      `/trainer/cohorts/${cohortId}`
    );
    return response.data.data;
  },

  /**
   * Create new cohort
   */
  createCohort: async (data: Partial<Cohort>): Promise<Cohort> => {
    const response = await apiClient.post<APIResponse<Cohort>>(
      `/trainer/cohorts`,
      data
    );
    return response.data.data;
  },

  /**
   * Update cohort
   */
  updateCohort: async (cohortId: string, updates: Partial<Cohort>): Promise<Cohort> => {
    const response = await apiClient.patch<APIResponse<Cohort>>(
      `/trainer/cohorts/${cohortId}`,
      updates
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Assessment Management
  // ----------------------------------------------------------------

  /**
   * Get pending assessments for review
   */
  getPendingAssessments: async (trainerId: string): Promise<Assessment[]> => {
    const response = await apiClient.get<APIResponse<Assessment[]>>(
      `/trainer/${trainerId}/assessments/pending`
    );
    return response.data.data;
  },

  /**
   * Get specific assessment for review
   */
  getAssessment: async (assessmentId: string): Promise<Assessment & {
    content: any;
    learnerSubmission: any;
    aiAnalysis?: any;
  }> => {
    const endpoint = import.meta.env.VITE_ASSESSMENT_WEBHOOK_URL || '/trainer/assessment';
    const response = await apiClient.post<APIResponse<any>>(
      endpoint,
      {
        assessmentId,
        trainerFeedbackRequested: true,
        timestamp: new Date().toISOString(),
      }
    );
    return response.data.data;
  },

  /**
   * Submit assessment grade and feedback
   */
  gradeAssessment: async (
    assessmentId: string,
    data: {
      trainerScore: number;
      feedback: string;
      rubricScores?: Record<string, number>;
    }
  ): Promise<Assessment> => {
    const response = await apiClient.post<APIResponse<Assessment>>(
      `/trainer/assessments/${assessmentId}/grade`,
      {
        ...data,
        gradedAt: new Date().toISOString(),
      }
    );
    return response.data.data;
  },

  /**
   * Flag assessment for review
   */
  flagAssessment: async (
    assessmentId: string,
    reason: string
  ): Promise<void> => {
    await apiClient.post(
      `/trainer/assessments/${assessmentId}/flag`,
      { reason }
    );
  },

  // ----------------------------------------------------------------
  // AI Insights & Flags
  // ----------------------------------------------------------------

  /**
   * Get AI-flagged learners requiring attention
   */
  getAIFlags: async (trainerId: string): Promise<AIFlag[]> => {
    const response = await apiClient.get<APIResponse<AIFlag[]>>(
      `/trainer/${trainerId}/ai-flags`
    );
    return response.data.data;
  },

  /**
   * Resolve AI flag
   */
  resolveAIFlag: async (flagId: string, notes?: string): Promise<void> => {
    await apiClient.post(`/trainer/ai-flags/${flagId}/resolve`, {
      notes,
      resolvedAt: new Date().toISOString(),
    });
  },

  // ----------------------------------------------------------------
  // Interventions
  // ----------------------------------------------------------------

  /**
   * Create intervention for learner
   */
  createIntervention: async (request: InterventionRequest): Promise<{ id: string }> => {
    const endpoint = import.meta.env.VITE_INTERVENTION_WEBHOOK_URL || '/trainer/intervention';
    const response = await apiClient.post<APIResponse<{ id: string }>>(
      endpoint,
      {
        ...request,
        timestamp: new Date().toISOString(),
      }
    );
    return response.data.data;
  },

  /**
   * Get intervention history for learner
   */
  getInterventionHistory: async (learnerId: string): Promise<any[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/trainer/interventions/learner/${learnerId}`
    );
    return response.data.data;
  },

  /**
   * Update intervention status
   */
  updateIntervention: async (
    interventionId: string,
    status: string,
    notes?: string
  ): Promise<void> => {
    await apiClient.patch(`/trainer/interventions/${interventionId}`, {
      status,
      notes,
      updatedAt: new Date().toISOString(),
    });
  },

  // ----------------------------------------------------------------
  // Communication
  // ----------------------------------------------------------------

  /**
   * Send message to learner
   */
  sendMessage: async (
    learnerId: string,
    message: {
      subject: string;
      body: string;
      type?: 'email' | 'notification' | 'both';
    }
  ): Promise<void> => {
    await apiClient.post(`/trainer/messages/send`, {
      learnerId,
      ...message,
      sentAt: new Date().toISOString(),
    });
  },

  /**
   * Schedule meeting with learner
   */
  scheduleMeeting: async (data: {
    learnerId: string;
    scheduledAt: string;
    duration: number;
    type: 'virtual' | 'in-person';
    notes?: string;
  }): Promise<{ meetingId: string; meetingUrl?: string }> => {
    const response = await apiClient.post<APIResponse<any>>(
      `/trainer/meetings/schedule`,
      data
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Performance Analytics
  // ----------------------------------------------------------------

  /**
   * Get trainer's own performance metrics
   */
  getPerformanceMetrics: async (trainerId: string): Promise<TrainerPerformance> => {
    const response = await apiClient.get<APIResponse<TrainerPerformance>>(
      `/trainer/${trainerId}/performance`
    );
    return response.data.data;
  },

  /**
   * Get cohort performance summary
   */
  getCohortPerformance: async (cohortId: string): Promise<{
    averageProgress: number;
    completionRate: number;
    atRiskCount: number;
    topPerformers: any[];
    strugglingLearners: any[];
  }> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/trainer/cohorts/${cohortId}/performance`
    );
    return response.data.data;
  },

  /**
   * Get learner detailed progress
   */
  getLearnerProgress: async (learnerId: string): Promise<any> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/trainer/learners/${learnerId}/progress`
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Reports
  // ----------------------------------------------------------------

  /**
   * Generate cohort report
   */
  generateCohortReport: async (
    cohortId: string,
    format: 'pdf' | 'excel' | 'csv' = 'pdf'
  ): Promise<Blob> => {
    const response = await apiClient.get(
      `/trainer/cohorts/${cohortId}/report`,
      {
        params: { format },
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Generate learner progress report
   */
  generateLearnerReport: async (
    learnerId: string,
    format: 'pdf' | 'excel' | 'csv' = 'pdf'
  ): Promise<Blob> => {
    const response = await apiClient.get(
      `/trainer/learners/${learnerId}/report`,
      {
        params: { format },
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

export default trainerService;
