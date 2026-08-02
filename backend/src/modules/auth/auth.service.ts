import { authRepository } from './auth.repository.js';
import { otpService } from './otp.service.js';
import { jwtService } from './jwt.service.js';
import { prisma } from '../../lib/prisma.js';
import { REFRESH_TOKEN_EXPIRY_DAYS } from './constants.js';
import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';
import { logger } from '../../lib/logger.js';

export class AuthService {
  async logAuthAudit(
    actorId: string | null,
    action: string,
    entityId: string,
    ipAddress?: string,
    userAgent?: string,
    metadata: any = {}
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          actorId,
          action,
          entityType: 'User',
          entityId,
          ipAddress,
          userAgent,
          metadata,
        },
      });
      // Fire auth event logging
      logger.info({ actorId, action, entityId }, `Auth Event: ${action}`);
    } catch (err) {
      logger.error({ error: err }, 'Failed to write audit log');
    }
  }

  async requestOtp(phone: string, ip: string, ua: string) {
    await otpService.generateAndSendOTP(phone, ip);
    await this.logAuthAudit(null, 'OTP_REQUESTED', phone, ip, ua);
  }

  async verifyOtpAndLogin(
    phone: string,
    otp: string,
    ip: string,
    ua: string,
    deviceMeta: {
      deviceName?: string;
      deviceId?: string;
      platform?: string;
      browser?: string;
    }
  ) {
    await otpService.verifyOTP(phone, otp);

    let user = await authRepository.findUserByPhone(phone);
    let isNew = false;
    
    if (!user) {
      user = await authRepository.createUser(phone, 'New User');
      isNew = true;
    }

    const plainRefreshToken = jwtService.generateRandomToken();
    const hash = jwtService.hashToken(plainRefreshToken);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: hash,
      expiresAt: expiry,
      ipAddress: ip,
      userAgent: ua,
      ...deviceMeta,
    });

    const accessToken = jwtService.signAccessToken({
      userId: user.id,
      phone: user.phone,
      roles: user.roles.map((r) => r.role),
      tokenVersion: user.tokenVersion,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.logAuthAudit(user.id, isNew ? 'USER_SIGNED_UP' : 'USER_LOGGED_IN', user.id, ip, ua);

    return { user, accessToken, refreshToken: plainRefreshToken };
  }

  async refreshTokens(
    plainRefreshToken: string,
    ip: string,
    ua: string,
    deviceMeta: {
      deviceName?: string;
      deviceId?: string;
      platform?: string;
      browser?: string;
    }
  ) {
    const hash = jwtService.hashToken(plainRefreshToken);
    const existingToken = await authRepository.findRefreshTokenByHash(hash);

    if (!existingToken || existingToken.revoked || existingToken.expiresAt < new Date()) {
      if (existingToken) {
        // Potential token reuse / replay attack. Revoke all refresh tokens for this user!
        await authRepository.revokeAllRefreshTokensForUser(existingToken.userId);
        await this.logAuthAudit(existingToken.userId, 'REFRESH_TOKEN_REUSE_DETECTED', existingToken.userId, ip, ua);
      }
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, 'Invalid or expired refresh token');
    }

    // Revoke old token
    await authRepository.revokeRefreshTokenByHash(hash);

    // Create new rotated token
    const newPlainRefreshToken = jwtService.generateRandomToken();
    const newHash = jwtService.hashToken(newPlainRefreshToken);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await authRepository.createRefreshToken({
      userId: existingToken.userId,
      tokenHash: newHash,
      expiresAt: expiry,
      ipAddress: ip,
      userAgent: ua,
      ...deviceMeta,
    });

    const accessToken = jwtService.signAccessToken({
      userId: existingToken.user.id,
      phone: existingToken.user.phone,
      roles: existingToken.user.roles.map((r) => r.role),
      tokenVersion: existingToken.user.tokenVersion,
    });

    await this.logAuthAudit(existingToken.userId, 'TOKEN_REFRESHED', existingToken.userId, ip, ua);

    return { accessToken, refreshToken: newPlainRefreshToken };
  }

  async logout(plainRefreshToken: string, ip: string, ua: string) {
    const hash = jwtService.hashToken(plainRefreshToken);
    const existingToken = await authRepository.findRefreshTokenByHash(hash);

    if (existingToken) {
      await authRepository.revokeRefreshTokenByHash(hash);
      await this.logAuthAudit(existingToken.userId, 'USER_LOGGED_OUT', existingToken.userId, ip, ua);
    }
  }

  async getMe(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, ErrorCode.NOT_FOUND, 'User not found');
    }
    return user;
  }
}
export const authService = new AuthService();
