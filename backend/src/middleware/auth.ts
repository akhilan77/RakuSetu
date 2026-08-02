import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.js';
import { AppError } from './error.js';
import { ErrorCode } from '../constants/error-codes.js';
import { Role } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

interface JwtPayload {
  sub: string;
  phone: string;
  roles: Role[];
  tokenVersion: number;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
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
    
    // Check database to verify token version
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { tokenVersion: true },
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new AppError(
        401,
        ErrorCode.UNAUTHENTICATED,
        'Authentication token has been revoked or invalidated'
      );
    }

    req.user = {
      id: payload.sub,
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
