// ================================================================
// Trainer Routes
// ================================================================

import { Router } from 'express';
import { z } from 'zod';
import trainerService from '../services/trainer.service.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { sendSuccess } from '../utils/response.js';
import { InterventionType } from '@prisma/client';

const router = Router();

// All trainer routes require authentication
router.use(requireAuth);

// ----------------------------------------------------------------
// Cohort Routes
// ----------------------------------------------------------------

// GET /api/trainer/:trainerId/cohorts
router.get('/:trainerId/cohorts', async (req, res, next) => {
  try {
    const cohorts = await trainerService.getCohorts(req.params.trainerId);
    sendSuccess(res, cohorts, 'Cohorts retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/trainer/cohorts/:cohortId
router.get('/cohorts/:cohortId', async (req, res, next) => {
  try {
    const cohort = await trainerService.getCohort(req.params.cohortId);
    sendSuccess(res, cohort, 'Cohort retrieved');
  } catch (error) {
    next(error);
  }
});

// POST /api/trainer/cohorts
router.post('/cohorts', async (req, res, next) => {
  try {
    const cohort = await trainerService.createCohort({
      ...req.body,
      trainerId: req.user!.userId,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
    });
    sendSuccess(res, cohort, 'Cohort created', 201);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/trainer/cohorts/:cohortId
router.patch('/cohorts/:cohortId', async (req, res, next) => {
  try {
    const cohort = await trainerService.updateCohort(req.params.cohortId, req.body);
    sendSuccess(res, cohort, 'Cohort updated');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Assessment Routes
// ----------------------------------------------------------------

// GET /api/trainer/:trainerId/assessments/pending
router.get('/:trainerId/assessments/pending', async (req, res, next) => {
  try {
    const assessments = await trainerService.getPendingAssessments(req.params.trainerId);
    sendSuccess(res, assessments, 'Pending assessments retrieved');
  } catch (error) {
    next(error);
  }
});

// POST /api/trainer/assessment (webhook for AI assessment)
router.post('/assessment', async (req, res, next) => {
  try {
    const assessment = await trainerService.getAssessment(req.body.assessmentId);
    sendSuccess(res, assessment, 'Assessment retrieved for review');
  } catch (error) {
    next(error);
  }
});

// POST /api/trainer/assessments/:assessmentId/grade
router.post('/assessments/:assessmentId/grade', async (req, res, next) => {
  try {
    const assessment = await trainerService.gradeAssessment(
      req.params.assessmentId,
      req.body
    );
    sendSuccess(res, assessment, 'Assessment graded');
  } catch (error) {
    next(error);
  }
});

// POST /api/trainer/assessments/:assessmentId/flag
router.post('/assessments/:assessmentId/flag', async (req, res, next) => {
  try {
    const assessment = await trainerService.flagAssessment(
      req.params.assessmentId,
      req.body.reason
    );
    sendSuccess(res, assessment, 'Assessment flagged');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// AI Flags Routes
// ----------------------------------------------------------------

// GET /api/trainer/:trainerId/ai-flags
router.get('/:trainerId/ai-flags', async (req, res, next) => {
  try {
    const flags = await trainerService.getAIFlags(req.params.trainerId);
    sendSuccess(res, flags, 'AI flags retrieved');
  } catch (error) {
    next(error);
  }
});

// POST /api/trainer/ai-flags/:flagId/resolve
router.post('/ai-flags/:flagId/resolve', async (req, res, next) => {
  try {
    const flag = await trainerService.resolveAIFlag(req.params.flagId, req.body.notes);
    sendSuccess(res, flag, 'AI flag resolved');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Intervention Routes
// ----------------------------------------------------------------

// POST /api/trainer/intervention
router.post('/intervention', async (req, res, next) => {
  try {
    const intervention = await trainerService.createIntervention({
      ...req.body,
      trainerId: req.user!.userId,
      interventionType: req.body.interventionType as InterventionType,
    });
    sendSuccess(res, intervention, 'Intervention created', 201);
  } catch (error) {
    next(error);
  }
});

// GET /api/trainer/interventions/:learnerId
router.get('/interventions/:learnerId', async (req, res, next) => {
  try {
    const history = await trainerService.getInterventionHistory(req.params.learnerId);
    sendSuccess(res, history, 'Intervention history retrieved');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Message Routes
// ----------------------------------------------------------------

// POST /api/trainer/messages/send
router.post('/messages/send', async (req, res, next) => {
  try {
    const message = await trainerService.sendMessage(req.user!.userId, req.body);
    sendSuccess(res, message, 'Message sent');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Performance Routes
// ----------------------------------------------------------------

// GET /api/trainer/:trainerId/performance
router.get('/:trainerId/performance', async (req, res, next) => {
  try {
    const metrics = await trainerService.getPerformanceMetrics(req.params.trainerId);
    sendSuccess(res, metrics, 'Performance metrics retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/trainer/cohorts/:cohortId/performance
router.get('/cohorts/:cohortId/performance', async (req, res, next) => {
  try {
    const performance = await trainerService.getCohortPerformance(req.params.cohortId);
    sendSuccess(res, performance, 'Cohort performance retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/trainer/learners/:learnerId/progress
router.get('/learners/:learnerId/progress', async (req, res, next) => {
  try {
    const progress = await trainerService.getLearnerProgress(req.params.learnerId);
    sendSuccess(res, progress, 'Learner progress retrieved');
  } catch (error) {
    next(error);
  }
});

export default router;
