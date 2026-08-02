import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../lib/logger.js';
import { ErrorCode } from '../constants/error-codes.js';
import { fail } from '../utils/response.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details: Record<string, any> = {}
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Extract request ID if available
  const reqId = req.headers['x-request-id'] || 'unknown';

  if (err instanceof AppError) {
    logger.warn({ reqId, code: err.code, message: err.message, details: err.details }, 'AppError caught');
    return fail(res, err.statusCode, err.code, err.message, err.details);
  }

  if (err instanceof ZodError) {
    const details = err.errors.reduce((acc, current) => {
      const path = current.path.join('.');
      acc[path] = current.message;
      return acc;
    }, {} as Record<string, string>);

    logger.warn({ reqId, details }, 'Validation Error (Zod)');
    return fail(
      res,
      422,
      ErrorCode.VALIDATION_ERROR,
      'Validation failed',
      details
    );
  }

  // Handle default / unexpected server errors
  logger.error({ reqId, error: { message: err.message, stack: err.stack } }, 'Unhandled Exception');
  
  const responseMessage = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : err.message;

  return fail(
    res,
    500,
    ErrorCode.INTERNAL_SERVER_ERROR,
    responseMessage
  );
}
