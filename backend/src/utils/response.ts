// ================================================================
// API Response Utilities
// ================================================================

import { Response } from 'express';

export interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface APIError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const response: APIResponse<T> = {
    data,
    message,
    success: true,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  pageSize: number,
  total: number,
  message: string = 'Success'
): void => {
  const totalPages = Math.ceil(total / pageSize);
  const response: PaginatedResponse<T> = {
    data,
    page,
    pageSize,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
  res.status(200).json({ ...response, message, success: true, timestamp: new Date().toISOString() });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error: string = 'Internal Server Error'
): void => {
  const response: APIError = {
    error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};
