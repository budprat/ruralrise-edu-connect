// ================================================================
// Routes Index
// ================================================================

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import learnerRoutes from './learner.routes.js';
import trainerRoutes from './trainer.routes.js';
import operationsRoutes from './operations.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/learner', learnerRoutes);
router.use('/trainer', trainerRoutes);
router.use('/operations', operationsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
