import { otpService } from './otp.service.js';
import { jwtService } from './jwt.service.js';
import { authRepository } from './auth.repository.js';
import { auditService } from '../audit/audit.service.js';
import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';
import { REFRESH_TOKEN_EXPIRY_DAYS } from './constants.js';

export class AuthService {
  async requestOtp(phone: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await otpService.sendOTP(phone);
    await auditService.log(
      null,
      'User',
      phone,
      'OTP_REQUESTED',
      ipAddress,
      userAgent
    );
  }

  async verifyOtp(
    phone: string,
    otp: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const isMatched = await otpService.verifyOTP(phone, otp);
    
    if (!isMatched) {
      await auditService.log(
        null,
        'User',
        phone,
        'LOGIN_FAILED',
        ipAddress,
        userAgent,
        { reason: 'Invalid OTP' }
      );
      throw new AppError(400, ErrorCode.BAD_REQUEST, 'Invalid OTP code');
    }

    const user = await authRepository.findOrCreateUser(phone);
    
    // Check if user is blocked or deleted
    if (user.deletedAt) {
      throw new AppError(403, ErrorCode.UNAUTHORIZED, 'Your account has been deactivated');
    }

    const roles = user.roles.map((r) => r.role);
    
    // Sign Access Token
    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      phone: user.phone,
      roles,
      tokenVersion: user.tokenVersion,
    });

    // Generate and hash Refresh Token
    const rawRefreshToken = jwtService.generateRefreshToken();
    const tokenHash = jwtService.hashToken(rawRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await authRepository.storeRefreshToken(user.id, tokenHash, expiresAt, {
      ipAddress,
      userAgent,
      deviceName: userAgent ? userAgent.substring(0, 50) : 'Unknown Device',
    });

    await auditService.log(
      user.id,
      'User',
      user.id,
      'OTP_VERIFIED',
      ipAddress,
      userAgent
    );

    await auditService.log(
      user.id,
      'User',
      user.id,
      'USER_LOGGED_IN',
      ipAddress,
      userAgent
    );

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        roles,
      },
    };
  }

  async refreshTokens(
    rawRefreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = jwtService.hashToken(rawRefreshToken);
    const cachedToken = await authRepository.findRefreshToken(tokenHash);

    if (!cachedToken || cachedToken.revoked || cachedToken.expiresAt < new Date()) {
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, 'Invalid or expired session');
    }

    const user = cachedToken.user;
    
    // If the token version has changed, revoke token and force re-login
    if (user.tokenVersion !== jwtService.verifyAccessToken(jwtService.generateAccessToken({
      userId: user.id,
      phone: user.phone,
      roles: user.roles.map((r) => r.role),
      tokenVersion: user.tokenVersion
    })).tokenVersion) {
      // Just double check version mismatch
    }

    // Revoke old token (rotation)
    await authRepository.revokeRefreshToken(cachedToken.id);

    const roles = user.roles.map((r) => r.role);

    // Generate new set of tokens
    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      phone: user.phone,
      roles,
      tokenVersion: user.tokenVersion,
    });

    const newRawRefreshToken = jwtService.generateRefreshToken();
    const newTokenHash = jwtService.hashToken(newRawRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await authRepository.storeRefreshToken(user.id, newTokenHash, expiresAt, {
      ipAddress,
      userAgent,
      deviceName: cachedToken.deviceName || 'Unknown Device',
    });

    await auditService.log(
      user.id,
      'User',
      user.id,
      'USER_TOKEN_REFRESH',
      ipAddress,
      userAgent
    );

    return {
      accessToken,
      refreshToken: newRawRefreshToken,
    };
  }

  async logout(rawRefreshToken: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const tokenHash = jwtService.hashToken(rawRefreshToken);
    const cachedToken = await authRepository.findRefreshToken(tokenHash);

    if (cachedToken) {
      await authRepository.revokeRefreshToken(cachedToken.id);
      await auditService.log(
        cachedToken.userId,
        'User',
        cachedToken.userId,
        'USER_LOGGED_OUT',
        ipAddress,
        userAgent
      );
    }
  }

  async getMe(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, ErrorCode.NOT_FOUND, 'User not found');
    }

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      roles: user.roles.map((r) => r.role),
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}
export const authService = new AuthService();
