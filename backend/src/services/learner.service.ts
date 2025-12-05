// ================================================================
// Learner Service
// ================================================================

import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Difficulty, EnrollmentStatus } from '@prisma/client';

export const learnerService = {
  // ----------------------------------------------------------------
  // Profile
  // ----------------------------------------------------------------
  async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return profile;
  },

  async updateProfile(userId: string, data: Partial<{
    name: string;
    avatarUrl: string;
    currentLevel: string;
    weeklyGoal: number;
  }>) {
    const profile = await prisma.profile.update({
      where: { userId },
      data,
    });

    return profile;
  },

  // ----------------------------------------------------------------
  // Lessons
  // ----------------------------------------------------------------
  async getLessons(userId: string, filters?: {
    difficulty?: Difficulty;
    type?: string;
    offline?: boolean;
    moduleId?: string;
  }) {
    const where: any = {};

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.offline !== undefined) {
      where.offline = filters.offline;
    }
    if (filters?.moduleId) {
      where.moduleId = filters.moduleId;
    }

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        module: {
          include: {
            path: true,
          },
        },
        enrollments: {
          where: { userId },
        },
      },
      orderBy: [
        { module: { order: 'asc' } },
        { order: 'asc' },
      ],
    });

    // Add enrollment status and AI recommendation
    return lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      duration: `${lesson.duration} minutes`,
      type: lesson.type,
      difficulty: lesson.difficulty,
      offline: lesson.offline,
      thumbnailUrl: lesson.thumbnailUrl,
      moduleId: lesson.moduleId,
      moduleName: lesson.module.title,
      progress: lesson.enrollments[0]?.progress ?? 0,
      status: lesson.enrollments[0]?.status ?? 'NOT_STARTED',
      aiRecommended: Math.random() > 0.7, // Simulate AI recommendation
    }));
  },

  async getLesson(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            path: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    return lesson;
  },

  async startLesson(userId: string, lessonId: string) {
    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    // Create or update enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        status: EnrollmentStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        status: EnrollmentStatus.IN_PROGRESS,
        startedAt: new Date(),
        progress: 0,
      },
    });

    // Simulate AI personalization response
    return {
      enrollment,
      personalizedContent: {
        adaptedDifficulty: lesson.difficulty,
        focusAreas: ['communication', 'problem-solving'],
        estimatedTime: lesson.duration,
        tips: [
          'Take notes on key concepts',
          'Practice the exercises multiple times',
          'Review the summary at the end',
        ],
      },
    };
  },

  async updateProgress(userId: string, lessonId: string, progress: number) {
    const enrollment = await prisma.enrollment.update({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      data: {
        progress: Math.min(100, Math.max(0, progress)),
      },
    });

    return enrollment;
  },

  async completeLesson(userId: string, lessonId: string) {
    // Update enrollment
    const enrollment = await prisma.enrollment.update({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      data: {
        status: EnrollmentStatus.COMPLETED,
        progress: 100,
        completedAt: new Date(),
      },
    });

    // Update profile stats
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (profile) {
      await prisma.profile.update({
        where: { userId },
        data: {
          overallProgress: Math.min(100, profile.overallProgress + 5),
          weeklyProgress: profile.weeklyProgress + 1,
          totalPoints: profile.totalPoints + 50,
          streak: profile.streak + 1,
          lastActiveAt: new Date(),
        },
      });
    }

    // Check for achievements
    await this.checkAchievements(userId);

    return enrollment;
  },

  // ----------------------------------------------------------------
  // Learning Path
  // ----------------------------------------------------------------
  async getLearningPath(userId: string) {
    const paths = await prisma.learningPath.findMany({
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                enrollments: {
                  where: { userId },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    // Calculate progress for each module
    return paths.map((path) => ({
      id: path.id,
      title: path.title,
      description: path.description,
      imageUrl: path.imageUrl,
      modules: path.modules.map((module) => {
        const totalLessons = module.lessons.length;
        const completedLessons = module.lessons.filter(
          (l) => l.enrollments[0]?.status === 'COMPLETED'
        ).length;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        let status: 'completed' | 'current' | 'locked' = 'locked';
        if (progress === 100) {
          status = 'completed';
        } else if (progress > 0 || module.order === 1) {
          status = 'current';
        }

        return {
          id: module.id,
          title: module.title,
          description: module.description,
          order: module.order,
          progress,
          status,
          lessonCount: totalLessons,
          completedLessons,
        };
      }),
    }));
  },

  async getLearningPathProgress(userId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            module: true,
          },
        },
      },
    });

    // Group by module
    const moduleProgress: Record<string, { total: number; completed: number; inProgress: number }> = {};

    enrollments.forEach((enrollment) => {
      const moduleId = enrollment.lesson.moduleId;
      if (!moduleProgress[moduleId]) {
        moduleProgress[moduleId] = { total: 0, completed: 0, inProgress: 0 };
      }
      moduleProgress[moduleId].total++;
      if (enrollment.status === 'COMPLETED') {
        moduleProgress[moduleId].completed++;
      } else if (enrollment.status === 'IN_PROGRESS') {
        moduleProgress[moduleId].inProgress++;
      }
    });

    return Object.entries(moduleProgress).map(([moduleId, stats]) => ({
      moduleId,
      progress: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      completedLessons: stats.completed,
      inProgressLessons: stats.inProgress,
      totalLessons: stats.total,
    }));
  },

  // ----------------------------------------------------------------
  // Achievements
  // ----------------------------------------------------------------
  async getAchievements(userId: string) {
    const achievements = await prisma.achievement.findMany({
      include: {
        userAchievements: {
          where: { userId },
        },
      },
    });

    return achievements.map((achievement) => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      points: achievement.points,
      earned: achievement.userAchievements.length > 0,
      earnedDate: achievement.userAchievements[0]?.earnedAt?.toISOString(),
    }));
  },

  async checkAchievements(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) return;

    const achievements = await prisma.achievement.findMany();

    for (const achievement of achievements) {
      const criteria = achievement.criteria as Record<string, any>;

      // Check if already earned
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: { userId, achievementId: achievement.id },
        },
      });

      if (existing) continue;

      // Check criteria
      let earned = false;

      if (criteria.type === 'streak' && profile.streak >= criteria.value) {
        earned = true;
      } else if (criteria.type === 'points' && profile.totalPoints >= criteria.value) {
        earned = true;
      } else if (criteria.type === 'lessons_completed') {
        const completedCount = await prisma.enrollment.count({
          where: { userId, status: 'COMPLETED' },
        });
        if (completedCount >= criteria.value) {
          earned = true;
        }
      }

      if (earned) {
        await prisma.userAchievement.create({
          data: { userId, achievementId: achievement.id },
        });
        // Update points
        await prisma.profile.update({
          where: { userId },
          data: { totalPoints: profile.totalPoints + achievement.points },
        });
      }
    }
  },

  // ----------------------------------------------------------------
  // AI Insights
  // ----------------------------------------------------------------
  async getAIInsights(userId: string) {
    const insights = await prisma.aIInsight.findMany({
      where: { userId, resolved: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return insights;
  },

  async getRecommendedLessons(userId: string, limit: number = 5) {
    // Get lessons user hasn't completed
    const lessons = await prisma.lesson.findMany({
      where: {
        enrollments: {
          none: {
            userId,
            status: 'COMPLETED',
          },
        },
      },
      include: {
        module: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return lessons.map((lesson) => ({
      ...lesson,
      duration: `${lesson.duration} minutes`,
      aiRecommended: true,
      matchScore: Math.round(70 + Math.random() * 30),
    }));
  },

  // ----------------------------------------------------------------
  // Assessments
  // ----------------------------------------------------------------
  async submitAssessment(data: {
    assessmentId: string;
    learnerId: string;
    answers: any[];
    timeSpent: number;
  }) {
    const assessment = await prisma.assessment.update({
      where: { id: data.assessmentId },
      data: {
        submission: data.answers,
        submittedAt: new Date(),
        status: 'PENDING',
        // Simulate AI scoring
        aiScore: Math.round(60 + Math.random() * 40),
      },
    });

    return {
      assessmentId: assessment.id,
      score: assessment.aiScore,
      status: assessment.status,
    };
  },

  // ----------------------------------------------------------------
  // Statistics
  // ----------------------------------------------------------------
  async getWeeklyStats(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const completedThisWeek = await prisma.enrollment.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: oneWeekAgo },
      },
    });

    return {
      lessonsCompleted: completedThisWeek,
      weeklyGoal: profile?.weeklyGoal ?? 10,
      weeklyProgress: profile?.weeklyProgress ?? 0,
      streak: profile?.streak ?? 0,
      totalPoints: profile?.totalPoints ?? 0,
      averageScore: 85, // Simulated
    };
  },

  async getProgressHistory(userId: string, timeframe: 'week' | 'month' | 'year') {
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        completedAt: { gte: startDate },
        status: 'COMPLETED',
      },
      orderBy: { completedAt: 'asc' },
    });

    return enrollments.map((e) => ({
      date: e.completedAt?.toISOString(),
      lessonId: e.lessonId,
      progress: e.progress,
    }));
  },
};

export default learnerService;
