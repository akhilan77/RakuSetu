import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/app.js';
import { ACCESS_TOKEN_EXPIRY } from './constants.js';

export class JWTService {
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  generateAccessToken(payload: { userId: string; phone: string; roles: string[]; tokenVersion: number }): string {
    return jwt.sign(
      {
        sub: payload.userId,
        phone: payload.phone,
        roles: payload.roles,
        tokenVersion: payload.tokenVersion,
      },
      appConfig.jwt.secret,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  verifyAccessToken(token: string): any {
    return jwt.verify(token, appConfig.jwt.secret);
  }
}
export const jwtService = new JWTService();
