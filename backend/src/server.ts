// ================================================================
// RuralRise OS - Backend Server
// ================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// ----------------------------------------------------------------
// Security Middleware
// ----------------------------------------------------------------

// Helmet - Security headers
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later',
    statusCode: 429,
    timestamp: new Date().toISOString(),
  },
});
app.use('/api/', limiter);

// ----------------------------------------------------------------
// Body Parsing Middleware
// ----------------------------------------------------------------

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ----------------------------------------------------------------
// Request Logging (Development)
// ----------------------------------------------------------------

if (config.isDev) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ----------------------------------------------------------------
// API Routes
// ----------------------------------------------------------------

app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'RuralRise OS API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/health',
  });
});

// ----------------------------------------------------------------
// Error Handling
// ----------------------------------------------------------------

app.use(notFoundHandler);
app.use(errorHandler);

// ----------------------------------------------------------------
// Start Server
// ----------------------------------------------------------------

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🌾 RuralRise OS API Server                                  ║
║                                                               ║
║   Status:  Running                                            ║
║   Port:    ${PORT}                                              ║
║   Mode:    ${config.nodeEnv}                                      ║
║   Docs:    http://localhost:${PORT}/api/health                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
