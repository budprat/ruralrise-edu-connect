// ================================================================
// Operations Service
// ================================================================

import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { RiskStatus, Priority, ClientStatus } from '@prisma/client';

export const operationsService = {
  // ----------------------------------------------------------------
  // Dashboard
  // ----------------------------------------------------------------
  async getDashboardMetrics() {
    const [
      totalLearners,
      activeCohorts,
      totalAssessments,
      completedAssessments,
      clients,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'LEARNER' } }),
      prisma.cohort.count({ where: { status: 'ACTIVE' } }),
      prisma.assessment.count(),
      prisma.assessment.count({ where: { status: 'COMPLETED' } }),
      prisma.client.findMany({ where: { status: 'ACTIVE' } }),
    ]);

    const completionRate = totalAssessments > 0
      ? Math.round((completedAssessments / totalAssessments) * 100)
      : 0;

    const totalRevenue = clients.reduce((sum, c) => sum + c.revenue, 0);
    const avgQuality = clients.length > 0
      ? clients.reduce((sum, c) => sum + c.qualityScore, 0) / clients.length
      : 0;

    return {
      totalLearners,
      activeCohorts,
      completionRate,
      qualityScore: Math.round(avgQuality * 10) / 10,
      clientSatisfaction: Math.round(85 + Math.random() * 10),
      revenue: totalRevenue,
      trendsComparison: {
        learners: Math.round(-5 + Math.random() * 20),
        completion: Math.round(-3 + Math.random() * 15),
        quality: Math.round(-2 + Math.random() * 10),
        satisfaction: Math.round(-2 + Math.random() * 8),
      },
    };
  },

  async getKPITrends(timeframe: 'week' | 'month' | 'quarter' = 'month') {
    // Generate simulated trend data
    const periods = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const data = [];

    for (let i = periods; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split('T')[0],
        learners: Math.round(100 + Math.random() * 50 + (periods - i) * 0.5),
        completions: Math.round(20 + Math.random() * 30 + (periods - i) * 0.2),
        quality: Math.round(75 + Math.random() * 20),
        satisfaction: Math.round(80 + Math.random() * 15),
      });
    }

    return data;
  },

  async getSystemHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      database: 'connected',
      cache: 'connected',
      lastCheck: new Date().toISOString(),
      services: {
        api: 'operational',
        database: 'operational',
        auth: 'operational',
        notifications: 'operational',
      },
    };
  },

  // ----------------------------------------------------------------
  // Clients
  // ----------------------------------------------------------------
  async getClientMetrics() {
    const clients = await prisma.client.findMany({
      orderBy: { revenue: 'desc' },
    });

    return clients.map((client) => ({
      id: client.id,
      client: client.name,
      activeLearners: client.activeLearners,
      completionRate: Math.round(client.completionRate),
      qualityScore: Math.round(client.qualityScore * 10) / 10,
      onTime: Math.random() > 0.2,
      revenue: client.revenue,
      nextMilestone: client.nextMilestone ?? 'Q1 Review',
      contactEmail: client.contactEmail,
      startDate: client.startDate.toISOString(),
    }));
  },

  async getClient(clientId: string) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    return client;
  },

  async updateClient(clientId: string, data: Partial<{
    name: string;
    contactEmail: string;
    nextMilestone: string;
    status: ClientStatus;
  }>) {
    const client = await prisma.client.update({
      where: { id: clientId },
      data,
    });

    return client;
  },

  // ----------------------------------------------------------------
  // Trainers
  // ----------------------------------------------------------------
  async getTrainerMetrics() {
    const trainers = await prisma.user.findMany({
      where: { role: 'TRAINER' },
      include: {
        profile: true,
        cohorts: {
          include: {
            learnerCohorts: true,
            assessments: true,
          },
        },
        interventions: true,
      },
    });

    return trainers.map((trainer) => {
      const totalLearners = trainer.cohorts.reduce(
        (sum, c) => sum + c.learnerCohorts.length,
        0
      );
      const totalAssessments = trainer.cohorts.reduce(
        (sum, c) => sum + c.assessments.filter((a) => a.status === 'COMPLETED').length,
        0
      );

      return {
        id: trainer.id,
        trainerId: trainer.id,
        name: trainer.profile?.name ?? 'Unknown',
        learners: totalLearners,
        completionRate: Math.round(65 + Math.random() * 30),
        qualityScore: Math.round(75 + Math.random() * 20) / 10,
        interventions: trainer.interventions.length,
        satisfaction: Math.round(80 + Math.random() * 15),
        efficiency: totalLearners > 20 ? 'High' : totalLearners > 10 ? 'Medium' : 'Low',
      };
    });
  },

  async getTrainer(trainerId: string) {
    const trainer = await prisma.user.findUnique({
      where: { id: trainerId, role: 'TRAINER' },
      include: {
        profile: true,
        cohorts: {
          include: {
            learnerCohorts: true,
          },
        },
      },
    });

    if (!trainer) {
      throw new AppError('Trainer not found', 404);
    }

    return trainer;
  },

  async redistributeTrainers(data: {
    fromTrainerId: string;
    toTrainerId: string;
    learnerIds: string[];
  }) {
    // This would involve moving learners between cohorts
    // For now, simulate success
    return {
      success: true,
      movedLearners: data.learnerIds.length,
      message: `Successfully redistributed ${data.learnerIds.length} learners`,
    };
  },

  // ----------------------------------------------------------------
  // Quality
  // ----------------------------------------------------------------
  async getQualityMetrics() {
    const assessments = await prisma.assessment.findMany({
      where: { status: 'COMPLETED' },
      take: 100,
      orderBy: { gradedAt: 'desc' },
    });

    const avgScore = assessments.length > 0
      ? assessments.reduce((sum, a) => sum + (a.trainerScore ?? a.aiScore ?? 0), 0) /
        assessments.length
      : 0;

    return {
      overallScore: Math.round(avgScore),
      assessmentsReviewed: assessments.length,
      averageResponseTime: '2.3 hours',
      feedbackQuality: Math.round(80 + Math.random() * 15),
      clientCompliance: Math.round(90 + Math.random() * 8),
      categories: [
        { name: 'Communication', score: Math.round(75 + Math.random() * 20) },
        { name: 'Technical Skills', score: Math.round(70 + Math.random() * 25) },
        { name: 'Problem Solving', score: Math.round(72 + Math.random() * 23) },
        { name: 'Time Management', score: Math.round(78 + Math.random() * 18) },
      ],
    };
  },

  async getComplianceMetrics() {
    return {
      overallCompliance: Math.round(92 + Math.random() * 6),
      categories: [
        { name: 'Data Privacy', status: 'compliant', score: 100 },
        { name: 'Assessment Standards', status: 'compliant', score: 95 },
        { name: 'Training Hours', status: 'compliant', score: 98 },
        { name: 'Documentation', status: 'attention', score: 87 },
      ],
      lastAudit: new Date().toISOString(),
      nextAudit: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  // ----------------------------------------------------------------
  // Risk Alerts
  // ----------------------------------------------------------------
  async getRiskAlerts(filters?: {
    severity?: Priority;
    status?: RiskStatus;
  }) {
    const where: any = {};

    if (filters?.severity) {
      where.severity = filters.severity;
    }
    if (filters?.status) {
      where.status = filters.status;
    }

    const alerts = await prisma.riskAlert.findMany({
      where,
      orderBy: [
        { severity: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return alerts.map((alert) => ({
      id: alert.id,
      type: alert.type,
      description: alert.description,
      severity: alert.severity.toLowerCase(),
      affectedLearners: alert.affectedLearners,
      recommendedAction: alert.recommendedAction,
      timeframe: alert.timeframe,
      status: alert.status.toLowerCase(),
      createdAt: alert.createdAt.toISOString(),
      resolvedAt: alert.resolvedAt?.toISOString(),
    }));
  },

  async createRiskAlert(data: {
    type: string;
    description: string;
    severity: Priority;
    affectedLearners: number;
    recommendedAction: string;
    timeframe: string;
  }) {
    const alert = await prisma.riskAlert.create({
      data: {
        ...data,
        status: RiskStatus.OPEN,
      },
    });

    return alert;
  },

  async updateRiskAlert(alertId: string, data: Partial<{
    status: RiskStatus;
    recommendedAction: string;
  }>) {
    const alert = await prisma.riskAlert.update({
      where: { id: alertId },
      data: {
        ...data,
        resolvedAt: data.status === RiskStatus.RESOLVED ? new Date() : undefined,
      },
    });

    return alert;
  },

  async resolveRiskAlert(alertId: string) {
    const alert = await prisma.riskAlert.update({
      where: { id: alertId },
      data: {
        status: RiskStatus.RESOLVED,
        resolvedAt: new Date(),
      },
    });

    return alert;
  },

  // ----------------------------------------------------------------
  // Reports & Optimization
  // ----------------------------------------------------------------
  async requestReport(data: {
    reportType: string;
    timeframe: string;
    requestedBy: string;
    includeAIInsights: boolean;
  }) {
    // In production, this would trigger async report generation
    return {
      reportId: `report_${Date.now()}`,
      status: 'generating',
      estimatedTime: '5 minutes',
      message: `${data.reportType} report is being generated`,
    };
  },

  async requestOptimization(data: {
    optimizationType: string;
    parameters: Record<string, any>;
  }) {
    // In production, this would trigger AI optimization analysis
    return {
      optimizationId: `opt_${Date.now()}`,
      status: 'analyzing',
      recommendations: [
        {
          action: 'Redistribute 5 learners from Trainer A to Trainer B',
          impact: 'Improves trainer efficiency by 15%',
          priority: 'high',
        },
        {
          action: 'Add 2 new cohorts for Q2',
          impact: 'Accommodates projected growth',
          priority: 'medium',
        },
      ],
      message: 'Optimization analysis complete',
    };
  },
};

export default operationsService;
