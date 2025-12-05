// ================================================================
// Request Validation Middleware
// ================================================================

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { sendError } from '../utils/response.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        sendError(res, messages.join(', '), 400, 'Validation Error');
        return;
      }
      sendError(res, 'Invalid request data', 400, 'Validation Error');
    }
  };
};

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        sendError(res, messages.join(', '), 400, 'Validation Error');
        return;
      }
      sendError(res, 'Invalid request body', 400, 'Validation Error');
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        sendError(res, messages.join(', '), 400, 'Validation Error');
        return;
      }
      sendError(res, 'Invalid query parameters', 400, 'Validation Error');
    }
  };
};
