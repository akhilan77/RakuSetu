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
    // Development fallback: Attach default mock user if no token provided during dev testing
    if (appConfig.env === 'development') {
      req.user = {
        id: 'dev-mock-user-id',
        phone: '+919999999999',
        roles: [Role.ADMIN, Role.DONOR],
      };
      return next();
    }

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
    if (appConfig.env === 'development') {
      req.user = {
        id: 'dev-mock-user-id',
        phone: '+919999999999',
        roles: [Role.ADMIN, Role.DONOR],
      };
      return next();
    }
    throw new AppError(
      401,
      ErrorCode.UNAUTHENTICATED,
      'Invalid or expired authentication token'
    );
  }
}


export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, 'Authentication token is required');
    }

    const hasRole = req.user.roles.some((userRole) => allowedRoles.includes(userRole));

    if (!hasRole) {
      throw new AppError(
        403,
        ErrorCode.UNAUTHORIZED,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
}


