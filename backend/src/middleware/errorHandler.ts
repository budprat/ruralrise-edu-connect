// ================================================================
// Global Error Handler Middleware
// ================================================================

import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { sendError } from '../utils/response.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (config.isDev) {
    console.error('Error:', err);
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.name);
    return;
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      sendError(res, 'A record with this value already exists', 409, 'Conflict');
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 'Record not found', 404, 'Not Found');
      return;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401, 'Unauthorized');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401, 'Unauthorized');
    return;
  }

  // Default error
  sendError(
    res,
    config.isDev ? err.message : 'An unexpected error occurred',
    500,
    'Internal Server Error'
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404, 'Not Found');
};
