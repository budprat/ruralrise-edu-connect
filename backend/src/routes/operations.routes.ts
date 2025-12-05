// ================================================================
// Operations Routes
// ================================================================

import { Router } from 'express';
import operationsService from '../services/operations.service.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendSuccess } from '../utils/response.js';
import { Priority, RiskStatus } from '@prisma/client';

const router = Router();

// All operations routes require authentication
router.use(requireAuth);

// ----------------------------------------------------------------
// Dashboard Routes
// ----------------------------------------------------------------

// GET /api/operations/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const metrics = await operationsService.getDashboardMetrics();
    sendSuccess(res, metrics, 'Dashboard metrics retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/operations/kpi-trends
router.get('/kpi-trends', async (req, res, next) => {
  try {
    const timeframe = (req.query.timeframe as 'week' | 'month' | 'quarter') || 'month';
    const trends = await operationsService.getKPITrends(timeframe);
    sendSuccess(res, trends, 'KPI trends retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/operations/system/health
router.get('/system/health', async (req, res, next) => {
  try {
    const health = await operationsService.getSystemHealth();
    sendSuccess(res, health, 'System health retrieved');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Client Routes
// ----------------------------------------------------------------

// GET /api/operations/clients
router.get('/clients', async (req, res, next) => {
  try {
    const clients = await operationsService.getClientMetrics();
    sendSuccess(res, clients, 'Client metrics retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/operations/clients/:clientId
router.get('/clients/:clientId', async (req, res, next) => {
  try {
    const client = await operationsService.getClient(req.params.clientId);
    sendSuccess(res, client, 'Client retrieved');
  } catch (error) {
    next(error);
  }
});

// PATCH /api/operations/clients/:clientId
router.patch('/clients/:clientId', async (req, res, next) => {
  try {
    const client = await operationsService.updateClient(req.params.clientId, req.body);
    sendSuccess(res, client, 'Client updated');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Trainer Routes
// ----------------------------------------------------------------

// GET /api/operations/trainers/performance
router.get('/trainers/performance', async (req, res, next) => {
  try {
    const trainers = await operationsService.getTrainerMetrics();
    sendSuccess(res, trainers, 'Trainer metrics retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/operations/trainers/:trainerId
router.get('/trainers/:trainerId', async (req, res, next) => {
  try {
    const trainer = await operationsService.getTrainer(req.params.trainerId);
    sendSuccess(res, trainer, 'Trainer retrieved');
  } catch (error) {
    next(error);
  }
});

// POST /api/operations/trainers/redistribute
router.post('/trainers/redistribute', async (req, res, next) => {
  try {
    const result = await operationsService.redistributeTrainers(req.body);
    sendSuccess(res, result, 'Trainers redistributed');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Quality Routes
// ----------------------------------------------------------------

// GET /api/operations/quality/metrics
router.get('/quality/metrics', async (req, res, next) => {
  try {
    const metrics = await operationsService.getQualityMetrics();
    sendSuccess(res, metrics, 'Quality metrics retrieved');
  } catch (error) {
    next(error);
  }
});

// GET /api/operations/quality/compliance
router.get('/quality/compliance', async (req, res, next) => {
  try {
    const compliance = await operationsService.getComplianceMetrics();
    sendSuccess(res, compliance, 'Compliance metrics retrieved');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Risk Alert Routes
// ----------------------------------------------------------------

// GET /api/operations/risks
router.get('/risks', async (req, res, next) => {
  try {
    const filters = {
      severity: req.query.severity as Priority | undefined,
      status: req.query.status as RiskStatus | undefined,
    };
    const alerts = await operationsService.getRiskAlerts(filters);
    sendSuccess(res, alerts, 'Risk alerts retrieved');
  } catch (error) {
    next(error);
  }
});

// POST /api/operations/risks
router.post('/risks', async (req, res, next) => {
  try {
    const alert = await operationsService.createRiskAlert(req.body);
    sendSuccess(res, alert, 'Risk alert created', 201);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/operations/risks/:riskId
router.patch('/risks/:riskId', async (req, res, next) => {
  try {
    const alert = await operationsService.updateRiskAlert(req.params.riskId, req.body);
    sendSuccess(res, alert, 'Risk alert updated');
  } catch (error) {
    next(error);
  }
});

// POST /api/operations/risks/:riskId/resolve
router.post('/risks/:riskId/resolve', async (req, res, next) => {
  try {
    const alert = await operationsService.resolveRiskAlert(req.params.riskId);
    sendSuccess(res, alert, 'Risk alert resolved');
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// Reports & Optimization Routes
// ----------------------------------------------------------------

// POST /api/operations/analytics (request report)
router.post('/analytics', async (req, res, next) => {
  try {
    const result = await operationsService.requestReport({
      ...req.body,
      requestedBy: req.user!.userId,
    });
    sendSuccess(res, result, 'Report generation started');
  } catch (error) {
    next(error);
  }
});

// POST /api/operations/optimization
router.post('/optimization', async (req, res, next) => {
  try {
    const result = await operationsService.requestOptimization(req.body);
    sendSuccess(res, result, 'Optimization analysis complete');
  } catch (error) {
    next(error);
  }
});

export default router;
