// ================================================================
// Learner Routes
// ================================================================

import { Router } from 'express';
import { z } from 'zod';
import learnerService from '../services/learner.service.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validation.js';
import { sendSuccess } from '../utils/response.js';
import { Difficulty } from '@prisma/client';

const router = Router();

// All learner routes require authentication
router.use(requireAuth);

// ----------------------------------------------------------------
// Profile Routes
// ----------------------------------------------------------------

// GET /api/learner/:userId/profile
router.get('/:userId/profile', async (req, res, next) => {
  try {
    const profile = await learnerService.getProfile(req.params.userId);
    sendSuccess(res, profile, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
});

// PATCH /api/learner/:userId/profile
router.patch('/:userId/profile', async (req, res, next) => {
  try {
    const profile = await learnerService.updateProfile(req.params.userId, req.body);
    sendSuccess(res, profile, 'Profile updated');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Lessons Routes
// ----------------------------------------------------------------

// GET /api/learner/:userId/lessons
router.get('/:userId/lessons', async (req, res, next) => {
  try {
    const filters = {
      difficulty: req.query.difficulty as Difficulty | undefined,
      type: req.query.type as string | undefined,
      offline: req.query.offline === 'true' ? true : req.query.offline === 'false' ? false : undefined,
      moduleId: req.query.moduleId as string | undefined,
    };

    const lessons = await learnerService.getLessons(req.params.userId, filters);
    sendSuccess(res, lessons, 'Lessons retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/learner/lessons/:lessonId
router.get('/lessons/:lessonId', async (req, res, next) => {
  try {
    const lesson = await learnerService.getLesson(req.params.lessonId);
    sendSuccess(res, lesson, 'Lesson retrieved');
  } catch (error) {
    next(error);
  }
});

// POST /api/learner/learning-path (start lesson with AI personalization)
router.post('/learning-path', async (req, res, next) => {
  try {
    const { lessonId, currentProgress, learningStyle } = req.body;
    const userId = req.user!.userId;

    const result = await learnerService.startLesson(userId, lessonId);
    sendSuccess(res, result, 'Lesson started with AI personalization');
  } catch (error) {
    next(error);
  }
});

// PATCH /api/learner/:userId/lessons/:lessonId/progress
router.patch('/:userId/lessons/:lessonId/progress', async (req, res, next) => {
  try {
    const { progress } = req.body;
    const enrollment = await learnerService.updateProgress(
      req.params.userId,
      req.params.lessonId,
      progress
    );
    sendSuccess(res, enrollment, 'Progress updated');
  } catch (error) {
    next(error);
  }
});

// POST /api/learner/:userId/lessons/:lessonId/complete
router.post('/:userId/lessons/:lessonId/complete', async (req, res, next) => {
  try {
    const enrollment = await learnerService.completeLesson(
      req.params.userId,
      req.params.lessonId
    );
    sendSuccess(res, enrollment, 'Lesson completed');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Learning Path Routes
// ----------------------------------------------------------------

// GET /api/learner/:userId/learning-path
router.get('/:userId/learning-path', async (req, res, next) => {
  try {
    const paths = await learnerService.getLearningPath(req.params.userId);
    sendSuccess(res, paths, 'Learning path retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/learner/:userId/progress
router.get('/:userId/progress', async (req, res, next) => {
  try {
    const progress = await learnerService.getLearningPathProgress(req.params.userId);
    sendSuccess(res, progress, 'Progress retrieved');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Achievements Routes
// ----------------------------------------------------------------

// GET /api/learner/:userId/achievements
router.get('/:userId/achievements', async (req, res, next) => {
  try {
    const achievements = await learnerService.getAchievements(req.params.userId);
    sendSuccess(res, achievements, 'Achievements retrieved');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// AI Insights Routes
// ----------------------------------------------------------------

// GET /api/learner/:userId/ai-insights
router.get('/:userId/ai-insights', async (req, res, next) => {
  try {
    const insights = await learnerService.getAIInsights(req.params.userId);
    sendSuccess(res, insights, 'AI insights retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/learner/:userId/recommendations
router.get('/:userId/recommendations', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const lessons = await learnerService.getRecommendedLessons(req.params.userId, limit);
    sendSuccess(res, lessons, 'Recommendations retrieved');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Assessment Routes
// ----------------------------------------------------------------

// POST /api/learner/assessments/submit
router.post('/assessments/submit', async (req, res, next) => {
  try {
    const result = await learnerService.submitAssessment(req.body);
    sendSuccess(res, result, 'Assessment submitted');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Statistics Routes
// ----------------------------------------------------------------

// GET /api/learner/:userId/stats/weekly
router.get('/:userId/stats/weekly', async (req, res, next) => {
  try {
    const stats = await learnerService.getWeeklyStats(req.params.userId);
    sendSuccess(res, stats, 'Weekly stats retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/learner/:userId/progress-history
router.get('/:userId/progress-history', async (req, res, next) => {
  try {
    const timeframe = (req.query.timeframe as 'week' | 'month' | 'year') || 'month';
    const history = await learnerService.getProgressHistory(req.params.userId, timeframe);
    sendSuccess(res, history, 'Progress history retrieved');
  } catch (error) {
    next(error);
  }
});

export default router;
