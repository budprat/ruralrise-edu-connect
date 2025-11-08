// ================================================================
// Operations Service
// ================================================================
// Handles all operations/management-related API calls:
// analytics, reporting, optimization, and risk management
// ================================================================

import apiClient from './apiClient';
import type {
  DashboardMetrics,
  ClientMetrics,
  TrainerPerformance,
  RiskAlert,
  ReportRequest,
  OptimizationRequest,
  APIResponse,
  PaginatedResponse
} from '@/types';

// ----------------------------------------------------------------
// Dashboard & Metrics
// ----------------------------------------------------------------

export const operationsService = {
  /**
   * Get overall dashboard metrics
   */
  getDashboardMetrics: async (timeframe: string = '30d'): Promise<DashboardMetrics> => {
    const response = await apiClient.get<APIResponse<DashboardMetrics>>(
      `/operations/dashboard`,
      { params: { timeframe } }
    );
    return response.data.data;
  },

  /**
   * Get KPI trends over time
   */
  getKPITrends: async (
    metric: string,
    timeframe: string = '30d'
  ): Promise<{ date: string; value: number }[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/operations/kpi/${metric}/trends`,
      { params: { timeframe } }
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Client Management
  // ----------------------------------------------------------------

  /**
   * Get all client metrics
   */
  getClientMetrics: async (): Promise<ClientMetrics[]> => {
    const response = await apiClient.get<APIResponse<ClientMetrics[]>>(
      `/operations/clients`
    );
    return response.data.data;
  },

  /**
   * Get specific client details
   */
  getClient: async (clientId: string): Promise<ClientMetrics & {
    cohorts: any[];
    slaStatus: any;
    billingInfo: any;
  }> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/operations/clients/${clientId}`
    );
    return response.data.data;
  },

  /**
   * Update client information
   */
  updateClient: async (clientId: string, updates: Partial<ClientMetrics>): Promise<ClientMetrics> => {
    const response = await apiClient.patch<APIResponse<ClientMetrics>>(
      `/operations/clients/${clientId}`,
      updates
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Trainer Management
  // ----------------------------------------------------------------

  /**
   * Get all trainer performance metrics
   */
  getTrainerPerformance: async (): Promise<TrainerPerformance[]> => {
    const response = await apiClient.get<APIResponse<TrainerPerformance[]>>(
      `/operations/trainers/performance`
    );
    return response.data.data;
  },

  /**
   * Get specific trainer details
   */
  getTrainer: async (trainerId: string): Promise<TrainerPerformance & {
    cohorts: any[];
    recentInterventions: any[];
    certifications: any[];
  }> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/operations/trainers/${trainerId}`
    );
    return response.data.data;
  },

  /**
   * Assign trainer to cohort
   */
  assignTrainer: async (trainerId: string, cohortId: string): Promise<void> => {
    await apiClient.post(`/operations/trainers/${trainerId}/assign`, {
      cohortId,
      assignedAt: new Date().toISOString(),
    });
  },

  /**
   * Redistribute learners between trainers
   */
  redistributeLearners: async (data: {
    fromTrainerId: string;
    toTrainerId: string;
    learnerIds: string[];
  }): Promise<void> => {
    await apiClient.post(`/operations/trainers/redistribute`, data);
  },

  // ----------------------------------------------------------------
  // Quality Assurance
  // ----------------------------------------------------------------

  /**
   * Get quality metrics
   */
  getQualityMetrics: async (): Promise<{
    overallQualityScore: number;
    complianceRate: number;
    aiPredictionAccuracy: number;
    interventionSuccessRate: number;
  }> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/operations/quality/metrics`
    );
    return response.data.data;
  },

  /**
   * Get compliance status
   */
  getComplianceStatus: async (): Promise<{
    item: string;
    status: 'compliant' | 'pending' | 'non-compliant';
    lastAudit: string;
    nextAudit?: string;
  }[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/operations/quality/compliance`
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // Risk Management
  // ----------------------------------------------------------------

  /**
   * Get all risk alerts
   */
  getRiskAlerts: async (status?: 'open' | 'in_progress' | 'resolved'): Promise<RiskAlert[]> => {
    const response = await apiClient.get<APIResponse<RiskAlert[]>>(
      `/operations/risks`,
      { params: { status } }
    );
    return response.data.data;
  },

  /**
   * Get specific risk alert
   */
  getRiskAlert: async (riskId: string): Promise<RiskAlert & {
    affectedCohorts: any[];
    affectedLearnersList: any[];
    mitigationPlan?: string;
  }> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/operations/risks/${riskId}`
    );
    return response.data.data;
  },

  /**
   * Create new risk alert
   */
  createRiskAlert: async (data: Partial<RiskAlert>): Promise<RiskAlert> => {
    const response = await apiClient.post<APIResponse<RiskAlert>>(
      `/operations/risks`,
      data
    );
    return response.data.data;
  },

  /**
   * Update risk alert status
   */
  updateRiskAlert: async (
    riskId: string,
    status: string,
    notes?: string
  ): Promise<RiskAlert> => {
    const response = await apiClient.patch<APIResponse<RiskAlert>>(
      `/operations/risks/${riskId}`,
      {
        status,
        notes,
        updatedAt: new Date().toISOString(),
      }
    );
    return response.data.data;
  },

  /**
   * Resolve risk alert
   */
  resolveRiskAlert: async (riskId: string, resolution: string): Promise<void> => {
    await apiClient.post(`/operations/risks/${riskId}/resolve`, {
      resolution,
      resolvedAt: new Date().toISOString(),
    });
  },

  // ----------------------------------------------------------------
  // Analytics & Reporting
  // ----------------------------------------------------------------

  /**
   * Generate custom report
   */
  generateReport: async (request: ReportRequest): Promise<{ reportId: string; status: string }> => {
    const endpoint = import.meta.env.VITE_ANALYTICS_WEBHOOK_URL || '/operations/analytics';
    const response = await apiClient.post<APIResponse<any>>(
      endpoint,
      {
        ...request,
        timestamp: new Date().toISOString(),
      }
    );
    return response.data.data;
  },

  /**
   * Download generated report
   */
  downloadReport: async (reportId: string, format: 'pdf' | 'excel' | 'csv' = 'pdf'): Promise<Blob> => {
    const response = await apiClient.get(
      `/operations/reports/${reportId}/download`,
      {
        params: { format },
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get scheduled reports
   */
  getScheduledReports: async (): Promise<{
    id: string;
    name: string;
    schedule: string;
    status: 'active' | 'paused';
    lastRun?: string;
    nextRun?: string;
  }[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/operations/reports/scheduled`
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // AI Optimization
  // ----------------------------------------------------------------

  /**
   * Request AI-powered resource optimization
   */
  requestOptimization: async (request: OptimizationRequest): Promise<{
    optimizationId: string;
    recommendations: any[];
    estimatedImpact: any;
  }> => {
    const endpoint = import.meta.env.VITE_OPTIMIZATION_WEBHOOK_URL || '/operations/optimization';
    const response = await apiClient.post<APIResponse<any>>(
      endpoint,
      {
        ...request,
        timestamp: new Date().toISOString(),
      }
    );
    return response.data.data;
  },

  /**
   * Get optimization history
   */
  getOptimizationHistory: async (): Promise<any[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/operations/optimizations/history`
    );
    return response.data.data;
  },

  /**
   * Apply optimization recommendation
   */
  applyOptimization: async (optimizationId: string, recommendationIds: string[]): Promise<void> => {
    await apiClient.post(`/operations/optimizations/${optimizationId}/apply`, {
      recommendationIds,
      appliedAt: new Date().toISOString(),
    });
  },

  // ----------------------------------------------------------------
  // Financial Analytics
  // ----------------------------------------------------------------

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics: async (timeframe: string = '30d'): Promise<{
    totalRevenue: number;
    recurringRevenue: number;
    newRevenue: number;
    churnRevenue: number;
    projectedRevenue: number;
  }> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/operations/financial/revenue`,
      { params: { timeframe } }
    );
    return response.data.data;
  },

  /**
   * Get cost breakdown
   */
  getCostBreakdown: async (timeframe: string = '30d'): Promise<{
    category: string;
    amount: number;
    percentage: number;
  }[]> => {
    const response = await apiClient.get<APIResponse<any[]>>(
      `/operations/financial/costs`,
      { params: { timeframe } }
    );
    return response.data.data;
  },

  // ----------------------------------------------------------------
  // System Health
  // ----------------------------------------------------------------

  /**
   * Get system health metrics
   */
  getSystemHealth: async (): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    activeUsers: number;
    apiResponseTime: number;
    errorRate: number;
  }> => {
    const response = await apiClient.get<APIResponse<any>>(
      `/operations/system/health`
    );
    return response.data.data;
  },

  /**
   * Get activity logs
   */
  getActivityLogs: async (filters?: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(
      `/operations/system/logs`,
      { params: filters }
    );
    return response.data;
  },
};

export default operationsService;
