// ================================================================
// Database Seed Script
// ================================================================

import { PrismaClient, Role, Difficulty, CohortStatus, Priority, InsightType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.aIFlag.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.learnerCohort.deleteMany();
  await prisma.cohort.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.riskAlert.deleteMany();
  await prisma.client.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // ----------------------------------------------------------------
  // Create Users
  // ----------------------------------------------------------------

  const passwordHash = await bcrypt.hash('password123', 12);

  // Learners
  const learner1 = await prisma.user.create({
    data: {
      email: 'maria.santos@example.com',
      passwordHash,
      role: Role.LEARNER,
      emailVerified: true,
      profile: {
        create: {
          name: 'Maria Santos',
          currentLevel: 'Digital Communications Specialist',
          overallProgress: 68,
          weeklyGoal: 15,
          weeklyProgress: 12,
          streak: 7,
          totalPoints: 1240,
        },
      },
    },
  });

  const learner2 = await prisma.user.create({
    data: {
      email: 'jose.rodriguez@example.com',
      passwordHash,
      role: Role.LEARNER,
      emailVerified: true,
      profile: {
        create: {
          name: 'Jose Rodriguez',
          currentLevel: 'Customer Service Associate',
          overallProgress: 45,
          weeklyGoal: 10,
          weeklyProgress: 6,
          streak: 3,
          totalPoints: 680,
        },
      },
    },
  });

  const learner3 = await prisma.user.create({
    data: {
      email: 'ana.garcia@example.com',
      passwordHash,
      role: Role.LEARNER,
      emailVerified: true,
      profile: {
        create: {
          name: 'Ana Garcia',
          currentLevel: 'Data Entry Specialist',
          overallProgress: 82,
          weeklyGoal: 12,
          weeklyProgress: 10,
          streak: 14,
          totalPoints: 2150,
        },
      },
    },
  });

  // Trainer
  const trainer1 = await prisma.user.create({
    data: {
      email: 'carlos.mentor@example.com',
      passwordHash,
      role: Role.TRAINER,
      emailVerified: true,
      profile: {
        create: {
          name: 'Carlos Mendez',
          currentLevel: 'Senior Trainer',
          totalPoints: 0,
        },
      },
    },
  });

  // Operations Manager
  const operations1 = await prisma.user.create({
    data: {
      email: 'admin@ruralrise.com',
      passwordHash,
      role: Role.OPERATIONS,
      emailVerified: true,
      profile: {
        create: {
          name: 'Admin User',
          currentLevel: 'Operations Manager',
          totalPoints: 0,
        },
      },
    },
  });

  console.log('✅ Created users');

  // ----------------------------------------------------------------
  // Create Learning Paths, Modules, and Lessons
  // ----------------------------------------------------------------

  const digitalSkillsPath = await prisma.learningPath.create({
    data: {
      title: 'Digital Communications Mastery',
      description: 'Comprehensive training for digital communication professionals',
      imageUrl: '/assets/ai-learning-network.jpg',
      modules: {
        create: [
          {
            title: 'Digital Communication Fundamentals',
            description: 'Master the basics of professional digital communication',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Introduction to Professional Communication',
                  description: 'Learn the foundations of effective workplace communication',
                  duration: 10,
                  type: 'video',
                  difficulty: Difficulty.BEGINNER,
                  offline: true,
                  order: 1,
                  content: { videoUrl: '/videos/intro.mp4', transcript: 'Welcome to the course...' },
                },
                {
                  title: 'Email Etiquette Essentials',
                  description: 'Master professional email writing',
                  duration: 8,
                  type: 'interactive',
                  difficulty: Difficulty.BEGINNER,
                  offline: true,
                  order: 2,
                  content: { exercises: ['greeting', 'body', 'closing'] },
                },
                {
                  title: 'Communication Styles Assessment',
                  description: 'Identify your communication style',
                  duration: 15,
                  type: 'quiz',
                  difficulty: Difficulty.BEGINNER,
                  offline: false,
                  order: 3,
                  content: { questions: 20, timeLimit: 15 },
                },
              ],
            },
          },
          {
            title: 'Customer Service Excellence',
            description: 'Deliver outstanding customer experiences',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Handling Difficult Customer Situations',
                  description: 'Techniques for managing challenging interactions',
                  duration: 8,
                  type: 'interactive',
                  difficulty: Difficulty.INTERMEDIATE,
                  offline: true,
                  order: 1,
                  content: { scenarios: 5, rolePlay: true },
                },
                {
                  title: 'Empathy in Customer Service',
                  description: 'Build connections through empathetic communication',
                  duration: 12,
                  type: 'video',
                  difficulty: Difficulty.INTERMEDIATE,
                  offline: true,
                  order: 2,
                  content: { videoUrl: '/videos/empathy.mp4' },
                },
                {
                  title: 'Customer Service Assessment',
                  description: 'Test your customer service skills',
                  duration: 20,
                  type: 'practical',
                  difficulty: Difficulty.INTERMEDIATE,
                  offline: false,
                  order: 3,
                  content: { tasks: 3, rubric: true },
                },
              ],
            },
          },
          {
            title: 'Email Management & Etiquette',
            description: 'Advanced email management skills',
            order: 3,
            lessons: {
              create: [
                {
                  title: 'Professional Email Templates',
                  description: 'Create effective email templates',
                  duration: 6,
                  type: 'practical',
                  difficulty: Difficulty.BEGINNER,
                  offline: true,
                  order: 1,
                  content: { templates: 5 },
                },
                {
                  title: 'Managing Email Overload',
                  description: 'Strategies for inbox management',
                  duration: 10,
                  type: 'video',
                  difficulty: Difficulty.INTERMEDIATE,
                  offline: true,
                  order: 2,
                  content: { videoUrl: '/videos/email-mgmt.mp4' },
                },
              ],
            },
          },
          {
            title: 'Advanced Problem Resolution',
            description: 'Complex problem-solving techniques',
            order: 4,
            lessons: {
              create: [
                {
                  title: 'Root Cause Analysis',
                  description: 'Find the source of customer issues',
                  duration: 15,
                  type: 'interactive',
                  difficulty: Difficulty.ADVANCED,
                  offline: false,
                  order: 1,
                  content: { cases: 3 },
                },
              ],
            },
          },
          {
            title: 'Leadership in Remote Teams',
            description: 'Lead effectively in virtual environments',
            order: 5,
            lessons: {
              create: [
                {
                  title: 'Cultural Sensitivity in Communications',
                  description: 'Navigate cross-cultural interactions',
                  duration: 12,
                  type: 'video',
                  difficulty: Difficulty.ADVANCED,
                  offline: false,
                  order: 1,
                  content: { videoUrl: '/videos/culture.mp4' },
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  console.log('✅ Created learning paths, modules, and lessons');

  // ----------------------------------------------------------------
  // Create Cohorts
  // ----------------------------------------------------------------

  const cohort1 = await prisma.cohort.create({
    data: {
      name: 'Digital Skills Batch 2024-Q4',
      trainerId: trainer1.id,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-03-31'),
      status: CohortStatus.ACTIVE,
    },
  });

  const cohort2 = await prisma.cohort.create({
    data: {
      name: 'Customer Excellence Program',
      trainerId: trainer1.id,
      startDate: new Date('2024-11-15'),
      status: CohortStatus.ACTIVE,
    },
  });

  // Add learners to cohorts
  await prisma.learnerCohort.createMany({
    data: [
      { learnerId: learner1.id, cohortId: cohort1.id },
      { learnerId: learner2.id, cohortId: cohort1.id },
      { learnerId: learner3.id, cohortId: cohort2.id },
    ],
  });

  console.log('✅ Created cohorts');

  // ----------------------------------------------------------------
  // Create Enrollments
  // ----------------------------------------------------------------

  const lessons = digitalSkillsPath.modules.flatMap((m) => m.lessons);

  // Maria's enrollments (68% progress)
  await prisma.enrollment.createMany({
    data: [
      { userId: learner1.id, lessonId: lessons[0].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner1.id, lessonId: lessons[1].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner1.id, lessonId: lessons[2].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner1.id, lessonId: lessons[3].id, progress: 85, status: 'IN_PROGRESS', startedAt: new Date() },
      { userId: learner1.id, lessonId: lessons[4].id, progress: 60, status: 'IN_PROGRESS', startedAt: new Date() },
      { userId: learner1.id, lessonId: lessons[5].id, progress: 45, status: 'IN_PROGRESS', startedAt: new Date() },
    ],
  });

  // Jose's enrollments
  await prisma.enrollment.createMany({
    data: [
      { userId: learner2.id, lessonId: lessons[0].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner2.id, lessonId: lessons[1].id, progress: 75, status: 'IN_PROGRESS', startedAt: new Date() },
    ],
  });

  // Ana's enrollments (more advanced)
  await prisma.enrollment.createMany({
    data: [
      { userId: learner3.id, lessonId: lessons[0].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner3.id, lessonId: lessons[1].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner3.id, lessonId: lessons[2].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner3.id, lessonId: lessons[3].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner3.id, lessonId: lessons[4].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
      { userId: learner3.id, lessonId: lessons[5].id, progress: 90, status: 'IN_PROGRESS', startedAt: new Date() },
    ],
  });

  console.log('✅ Created enrollments');

  // ----------------------------------------------------------------
  // Create Assessments
  // ----------------------------------------------------------------

  await prisma.assessment.createMany({
    data: [
      {
        userId: learner1.id,
        lessonId: lessons[2].id,
        cohortId: cohort1.id,
        type: 'quiz',
        content: { questions: 20 },
        submission: { answers: [1, 2, 3, 1, 2] },
        aiScore: 85,
        status: 'PENDING',
        submittedAt: new Date(),
      },
      {
        userId: learner1.id,
        lessonId: lessons[5].id,
        cohortId: cohort1.id,
        type: 'practical',
        content: { task: 'Write professional email' },
        submission: { emailText: 'Dear Sir/Madam...' },
        aiScore: 78,
        status: 'PENDING',
        submittedAt: new Date(),
      },
      {
        userId: learner2.id,
        lessonId: lessons[2].id,
        cohortId: cohort1.id,
        type: 'quiz',
        content: { questions: 20 },
        submission: { answers: [1, 1, 2, 1, 3] },
        aiScore: 72,
        status: 'PENDING',
        submittedAt: new Date(),
      },
      {
        userId: learner3.id,
        lessonId: lessons[5].id,
        cohortId: cohort2.id,
        type: 'practical',
        content: { task: 'Customer scenario resolution' },
        submission: { response: 'I understand your concern...' },
        aiScore: 92,
        trainerScore: 90,
        feedback: 'Excellent empathy and problem resolution!',
        status: 'COMPLETED',
        submittedAt: new Date(Date.now() - 86400000),
        gradedAt: new Date(),
      },
    ],
  });

  console.log('✅ Created assessments');

  // ----------------------------------------------------------------
  // Create Achievements
  // ----------------------------------------------------------------

  const achievements = await prisma.achievement.createMany({
    data: [
      {
        title: 'First Week Complete',
        description: 'Complete your first week of training',
        icon: '🎯',
        points: 100,
        criteria: { type: 'streak', value: 7 },
      },
      {
        title: 'Perfect Assessment Score',
        description: 'Score 100% on any assessment',
        icon: '⭐',
        points: 200,
        criteria: { type: 'score', value: 100 },
      },
      {
        title: 'Helping Hand',
        description: 'Help another learner in the community',
        icon: '🤝',
        points: 150,
        criteria: { type: 'community', value: 1 },
      },
      {
        title: '30-Day Streak',
        description: 'Learn every day for 30 days',
        icon: '🔥',
        points: 500,
        criteria: { type: 'streak', value: 30 },
      },
      {
        title: 'Fast Learner',
        description: 'Complete 10 lessons in a week',
        icon: '⚡',
        points: 300,
        criteria: { type: 'lessons_completed', value: 10 },
      },
    ],
  });

  // Award some achievements
  const allAchievements = await prisma.achievement.findMany();

  await prisma.userAchievement.createMany({
    data: [
      { userId: learner1.id, achievementId: allAchievements[0].id },
      { userId: learner1.id, achievementId: allAchievements[1].id },
      { userId: learner1.id, achievementId: allAchievements[2].id },
      { userId: learner3.id, achievementId: allAchievements[0].id },
      { userId: learner3.id, achievementId: allAchievements[1].id },
      { userId: learner3.id, achievementId: allAchievements[3].id },
      { userId: learner3.id, achievementId: allAchievements[4].id },
    ],
  });

  console.log('✅ Created achievements');

  // ----------------------------------------------------------------
  // Create AI Insights
  // ----------------------------------------------------------------

  await prisma.aIInsight.createMany({
    data: [
      {
        userId: learner1.id,
        type: InsightType.IMPROVEMENT,
        message: 'Your typing speed has improved 23% this week',
        priority: Priority.LOW,
      },
      {
        userId: learner1.id,
        type: InsightType.STRENGTH,
        message: 'You excel at empathy-based customer interactions',
        priority: Priority.MEDIUM,
      },
      {
        userId: learner1.id,
        type: InsightType.RECOMMENDATION,
        message: 'Consider practicing email formatting techniques',
        priority: Priority.HIGH,
      },
      {
        userId: learner2.id,
        type: InsightType.RECOMMENDATION,
        message: 'Try completing more lessons to build momentum',
        priority: Priority.HIGH,
      },
    ],
  });

  console.log('✅ Created AI insights');

  // ----------------------------------------------------------------
  // Create AI Flags
  // ----------------------------------------------------------------

  await prisma.aIFlag.createMany({
    data: [
      {
        learnerId: learner2.id,
        cohortId: cohort1.id,
        issue: 'Declining engagement - 40% drop in weekly activity',
        priority: Priority.HIGH,
        recommendation: 'Schedule one-on-one check-in to understand barriers',
      },
      {
        learnerId: learner1.id,
        cohortId: cohort1.id,
        issue: 'Assessment scores below cohort average',
        priority: Priority.MEDIUM,
        recommendation: 'Provide additional practice materials for email writing',
      },
    ],
  });

  console.log('✅ Created AI flags');

  // ----------------------------------------------------------------
  // Create Risk Alerts
  // ----------------------------------------------------------------

  await prisma.riskAlert.createMany({
    data: [
      {
        type: 'Engagement Drop',
        description: 'Multiple learners showing decreased activity in Digital Skills cohort',
        severity: Priority.HIGH,
        affectedLearners: 5,
        recommendedAction: 'Review curriculum pacing and consider adding interactive elements',
        timeframe: 'Next 2 weeks',
        status: 'OPEN',
      },
      {
        type: 'Quality Concern',
        description: 'Assessment scores trending down for Customer Service module',
        severity: Priority.MEDIUM,
        affectedLearners: 12,
        recommendedAction: 'Schedule review session and update training materials',
        timeframe: 'Next month',
        status: 'IN_PROGRESS',
      },
    ],
  });

  console.log('✅ Created risk alerts');

  // ----------------------------------------------------------------
  // Create Clients
  // ----------------------------------------------------------------

  await prisma.client.createMany({
    data: [
      {
        name: 'TechCorp Solutions',
        contactEmail: 'contact@techcorp.com',
        activeLearners: 45,
        completionRate: 78.5,
        qualityScore: 8.7,
        revenue: 125000,
        startDate: new Date('2024-01-15'),
        nextMilestone: 'Q1 2025 Review',
        status: 'ACTIVE',
      },
      {
        name: 'GlobalServe Inc',
        contactEmail: 'hr@globalserve.com',
        activeLearners: 32,
        completionRate: 82.3,
        qualityScore: 9.1,
        revenue: 98000,
        startDate: new Date('2024-03-01'),
        nextMilestone: 'Certification Deadline',
        status: 'ACTIVE',
      },
      {
        name: 'Community First Bank',
        contactEmail: 'training@cfbank.com',
        activeLearners: 28,
        completionRate: 71.2,
        qualityScore: 7.8,
        revenue: 76000,
        startDate: new Date('2024-06-01'),
        nextMilestone: 'Mid-year Assessment',
        status: 'ACTIVE',
      },
    ],
  });

  console.log('✅ Created clients');

  // ----------------------------------------------------------------
  // Done
  // ----------------------------------------------------------------

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🌱 Database seeded successfully!                            ║
║                                                               ║
║   Test Accounts:                                              ║
║   ─────────────────────────────────────────────               ║
║   Learner:    maria.santos@example.com / password123          ║
║   Trainer:    carlos.mentor@example.com / password123         ║
║   Operations: admin@ruralrise.com / password123               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
