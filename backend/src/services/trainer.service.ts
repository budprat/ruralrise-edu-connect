// ================================================================
// Trainer Service
// ================================================================

import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { CohortStatus, AssessmentStatus, InterventionType, InterventionStatus, Priority } from '@prisma/client';

export const trainerService = {
  // ----------------------------------------------------------------
  // Cohorts
  // ----------------------------------------------------------------
  async getCohorts(trainerId: string) {
    const cohorts = await prisma.cohort.findMany({
      where: { trainerId },
      include: {
        learnerCohorts: true,
        assessments: {
          where: { status: 'PENDING' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cohorts.map((cohort) => {
      const learnerCount = cohort.learnerCohorts.length;
      const pendingAssessments = cohort.assessments.length;

      return {
        id: cohort.id,
        name: cohort.name,
        trainerId: cohort.trainerId,
        startDate: cohort.startDate.toISOString(),
        endDate: cohort.endDate?.toISOString(),
        learners: learnerCount,
        progress: Math.round(50 + Math.random() * 40), // Simulated
        atRiskCount: Math.floor(Math.random() * 3), // Simulated
        pendingAssessments,
        status: cohort.status.toLowerCase(),
      };
    });
  },

  async getCohort(cohortId: string) {
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId },
      include: {
        learnerCohorts: {
          include: {
            cohort: true,
          },
        },
        assessments: true,
      },
    });

    if (!cohort) {
      throw new AppError('Cohort not found', 404);
    }

    return cohort;
  },

  async createCohort(data: {
    name: string;
    trainerId: string;
    startDate: Date;
    endDate?: Date;
  }) {
    const cohort = await prisma.cohort.create({
      data: {
        name: data.name,
        trainerId: data.trainerId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: CohortStatus.ACTIVE,
      },
    });

    return cohort;
  },

  async updateCohort(cohortId: string, data: Partial<{
    name: string;
    status: CohortStatus;
    endDate: Date;
  }>) {
    const cohort = await prisma.cohort.update({
      where: { id: cohortId },
      data,
    });

    return cohort;
  },

  // ----------------------------------------------------------------
  // Assessments
  // ----------------------------------------------------------------
  async getPendingAssessments(trainerId: string) {
    const cohorts = await prisma.cohort.findMany({
      where: { trainerId },
      select: { id: true },
    });

    const cohortIds = cohorts.map((c) => c.id);

    const assessments = await prisma.assessment.findMany({
      where: {
        cohortId: { in: cohortIds },
        status: 'PENDING',
      },
      include: {
        user: {
          include: { profile: true },
        },
        lesson: true,
        cohort: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    return assessments.map((assessment) => ({
      id: assessment.id,
      learnerId: assessment.userId,
      learnerName: assessment.user.profile?.name ?? 'Unknown',
      assessmentType: assessment.type,
      lessonId: assessment.lessonId,
      cohortId: assessment.cohortId,
      cohort: assessment.cohort?.name ?? 'Unknown',
      submittedDate: assessment.submittedAt?.toISOString() ?? assessment.createdAt.toISOString(),
      aiScore: assessment.aiScore,
      trainerScore: assessment.trainerScore,
      flagged: assessment.flagged,
      status: assessment.status.toLowerCase(),
    }));
  },

  async getAssessment(assessmentId: string) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        user: {
          include: { profile: true },
        },
        lesson: true,
        cohort: true,
      },
    });

    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    return assessment;
  },

  async gradeAssessment(assessmentId: string, data: {
    trainerScore: number;
    feedback: string;
    rubricScores?: Record<string, number>;
  }) {
    const assessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        trainerScore: data.trainerScore,
        feedback: data.feedback,
        status: AssessmentStatus.COMPLETED,
        gradedAt: new Date(),
      },
    });

    // Create notification for learner
    await prisma.notification.create({
      data: {
        userId: assessment.userId,
        type: 'SUCCESS',
        title: 'Assessment Graded',
        message: `Your assessment has been graded. Score: ${data.trainerScore}%`,
        actionUrl: `/assessments/${assessmentId}`,
      },
    });

    return assessment;
  },

  async flagAssessment(assessmentId: string, reason: string) {
    const assessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        flagged: true,
        feedback: reason,
      },
    });

    return assessment;
  },

  // ----------------------------------------------------------------
  // AI Flags
  // ----------------------------------------------------------------
  async getAIFlags(trainerId: string) {
    const cohorts = await prisma.cohort.findMany({
      where: { trainerId },
      select: { id: true },
    });

    const cohortIds = cohorts.map((c) => c.id);

    const flags = await prisma.aIFlag.findMany({
      where: {
        cohortId: { in: cohortIds },
        resolved: false,
      },
      orderBy: [
        { priority: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Get learner names
    const learnerIds = [...new Set(flags.map((f) => f.learnerId))];
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: learnerIds } },
    });

    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    return flags.map((flag) => ({
      id: flag.id,
      learnerId: flag.learnerId,
      learnerName: profileMap.get(flag.learnerId)?.name ?? 'Unknown',
      cohortId: flag.cohortId,
      cohort: 'Digital Skills Cohort', // Would need join to get actual name
      issue: flag.issue,
      priority: flag.priority.toLowerCase(),
      recommendation: flag.recommendation,
      lastActivity: flag.createdAt.toISOString(),
      resolved: flag.resolved,
    }));
  },

  async resolveAIFlag(flagId: string, notes?: string) {
    const flag = await prisma.aIFlag.update({
      where: { id: flagId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedNotes: notes,
      },
    });

    return flag;
  },

  // ----------------------------------------------------------------
  // Interventions
  // ----------------------------------------------------------------
  async createIntervention(data: {
    learnerId: string;
    trainerId: string;
    interventionType: InterventionType;
    issue: string;
    notes?: string;
  }) {
    const intervention = await prisma.intervention.create({
      data: {
        learnerId: data.learnerId,
        trainerId: data.trainerId,
        interventionType: data.interventionType,
        issue: data.issue,
        notes: data.notes,
        status: InterventionStatus.PENDING,
      },
    });

    // Create notification for learner
    await prisma.notification.create({
      data: {
        userId: data.learnerId,
        type: 'INFO',
        title: 'Trainer Outreach',
        message: 'Your trainer would like to connect with you regarding your progress.',
      },
    });

    return intervention;
  },

  async getInterventionHistory(learnerId: string) {
    const interventions = await prisma.intervention.findMany({
      where: { learnerId },
      include: {
        trainer: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return interventions.map((i) => ({
      id: i.id,
      trainerId: i.trainerId,
      trainerName: i.trainer.profile?.name ?? 'Unknown',
      type: i.interventionType,
      issue: i.issue,
      notes: i.notes,
      status: i.status.toLowerCase(),
      createdAt: i.createdAt.toISOString(),
      completedAt: i.completedAt?.toISOString(),
    }));
  },

  // ----------------------------------------------------------------
  // Messages
  // ----------------------------------------------------------------
  async sendMessage(senderId: string, data: {
    receiverId: string;
    subject: string;
    body: string;
  }) {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId: data.receiverId,
        subject: data.subject,
        body: data.body,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: data.receiverId,
        type: 'INFO',
        title: 'New Message',
        message: `You have a new message: ${data.subject}`,
      },
    });

    return message;
  },

  // ----------------------------------------------------------------
  // Performance
  // ----------------------------------------------------------------
  async getPerformanceMetrics(trainerId: string) {
    const cohorts = await prisma.cohort.findMany({
      where: { trainerId },
      include: {
        learnerCohorts: true,
        assessments: {
          where: { status: 'COMPLETED' },
        },
      },
    });

    const totalLearners = cohorts.reduce((sum, c) => sum + c.learnerCohorts.length, 0);
    const totalAssessments = cohorts.reduce((sum, c) => sum + c.assessments.length, 0);
    const avgScore = totalAssessments > 0
      ? cohorts.reduce((sum, c) =>
          sum + c.assessments.reduce((s, a) => s + (a.trainerScore ?? a.aiScore ?? 0), 0),
        0) / totalAssessments
      : 0;

    return {
      trainerId,
      totalLearners,
      activeCohorts: cohorts.filter((c) => c.status === 'ACTIVE').length,
      completedAssessments: totalAssessments,
      averageScore: Math.round(avgScore),
      interventionCount: await prisma.intervention.count({ where: { trainerId } }),
      satisfaction: Math.round(80 + Math.random() * 15), // Simulated
    };
  },

  async getCohortPerformance(cohortId: string) {
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId },
      include: {
        learnerCohorts: true,
        assessments: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });

    if (!cohort) {
      throw new AppError('Cohort not found', 404);
    }

    return {
      cohortId,
      name: cohort.name,
      learnerCount: cohort.learnerCohorts.length,
      assessmentCount: cohort.assessments.length,
      averageScore: cohort.assessments.length > 0
        ? Math.round(
            cohort.assessments.reduce((sum, a) => sum + (a.trainerScore ?? a.aiScore ?? 0), 0) /
              cohort.assessments.length
          )
        : 0,
      completionRate: Math.round(60 + Math.random() * 35), // Simulated
    };
  },

  async getLearnerProgress(learnerId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId: learnerId },
    });

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: learnerId },
      include: { lesson: true },
    });

    const completed = enrollments.filter((e) => e.status === 'COMPLETED').length;
    const inProgress = enrollments.filter((e) => e.status === 'IN_PROGRESS').length;

    return {
      learnerId,
      name: profile?.name ?? 'Unknown',
      overallProgress: profile?.overallProgress ?? 0,
      totalPoints: profile?.totalPoints ?? 0,
      streak: profile?.streak ?? 0,
      lessonsCompleted: completed,
      lessonsInProgress: inProgress,
      lastActive: profile?.lastActiveAt?.toISOString(),
    };
  },
};

export default trainerService;
