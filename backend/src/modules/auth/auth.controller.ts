import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { ok } from '../../utils/response.js';
import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/v1/auth/refresh',
  });
};

const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth/refresh',
  });
};

export class AuthController {
  async requestOtp(req: Request, res: Response) {
    const { phone } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await authService.requestOtp(phone, ipAddress, userAgent);
    return ok(res, {}, 'OTP sent successfully');
  }

  async verifyOtp(req: Request, res: Response) {
    const { phone, otp } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await authService.verifyOtp(phone, otp, ipAddress, userAgent);
    setRefreshTokenCookie(res, result.refreshToken);
    return ok(res, result, 'Verification successful');
  }

  async refresh(req: Request, res: Response) {
    let token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      } else {
        token = req.headers.authorization; // Dev raw fallback
      }
    }

    if (!token) {
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, 'Refresh token is required');
    }

    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await authService.refreshTokens(token, ipAddress, userAgent);
    setRefreshTokenCookie(res, result.refreshToken);
    return ok(res, result, 'Token refreshed successfully');
  }

  async logout(req: Request, res: Response) {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (token) {
      await authService.logout(token, ipAddress, userAgent);
    }
    clearRefreshTokenCookie(res);
    return ok(res, {}, 'Logout successful');
  }

  async getMe(req: Request, res: Response) {
    const userId = req.user?.id!;
    const user = await authService.getMe(userId);
    return ok(res, { user });
  }
}
export const authController = new AuthController();
