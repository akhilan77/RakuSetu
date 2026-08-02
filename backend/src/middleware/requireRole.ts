import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from './error.js';
import { ErrorCode } from '../constants/error-codes.js';

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new AppError(
        401,
        ErrorCode.UNAUTHENTICATED,
        'Authentication is required to perform this action'
      );
    }

    const hasRole = user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      throw new AppError(
        403,
        ErrorCode.UNAUTHORIZED,
        'You do not have permission to perform this action'
      );
    }

    next();
  };
}
