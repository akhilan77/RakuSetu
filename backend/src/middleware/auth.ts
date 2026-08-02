import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.js';
import { AppError } from './error.js';
import { ErrorCode } from '../constants/error-codes.js';
import { Role } from '@prisma/client';

interface JwtPayload {
  userId?: string;
  sub?: string;
  phone: string;
  roles: Role[];
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(
      401,
      ErrorCode.UNAUTHENTICATED,
      'Authentication token is required'
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, appConfig.jwt.secret) as JwtPayload;
    
    req.user = {
      id: (payload.sub || payload.userId)!,
      phone: payload.phone,
      roles: payload.roles,
    };

    next();
  } catch (err) {
    throw new AppError(
      401,
      ErrorCode.UNAUTHENTICATED,
      'Invalid or expired authentication token'
    );
  }
}
