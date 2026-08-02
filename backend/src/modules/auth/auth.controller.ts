import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { ok } from '../../utils/response.js';
import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';
import { REFRESH_TOKEN_EXPIRY_DAYS } from './constants.js';

const isProd = process.env.NODE_ENV === 'production';

export class AuthController {
  private getClientIp(req: Request): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.ip || '127.0.0.1';
  }

  private extractDeviceMetadata(req: Request) {
    const ua = req.headers['user-agent'] || 'unknown';
    // Simplified parsing (in production, a library like ua-parser-js can be used)
    return {
      userAgent: ua,
      deviceName: ua.slice(0, 100),
      platform: req.headers['sec-ch-ua-platform'] as string || 'unknown',
    };
  }

  async requestOtp(req: Request, res: Response) {
    const { phone } = req.body;
    const ip = this.getClientIp(req);
    const ua = req.headers['user-agent'] || 'unknown';

    await authService.requestOtp(phone, ip, ua);
    return ok(res, {}, 'OTP sent successfully');
  }

  async verifyOtp(req: Request, res: Response) {
    const { phone, otp } = req.body;
    const ip = this.getClientIp(req);
    const ua = req.headers['user-agent'] || 'unknown';
    const deviceMeta = this.extractDeviceMetadata(req);

    const { user, accessToken, refreshToken } = await authService.verifyOtpAndLogin(
      phone,
      otp,
      ip,
      ua,
      deviceMeta
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    });

    return ok(res, { user, accessToken, refreshToken }, 'Login successful');
  }

  async refresh(req: Request, res: Response) {
    // Try to extract from cookie first, fall back to body or headers
    let token = req.cookies.refreshToken;
    if (!token && req.body.refreshToken) {
      token = req.body.refreshToken;
    }
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, 'Refresh token is required');
    }

    const ip = this.getClientIp(req);
    const ua = req.headers['user-agent'] || 'unknown';
    const deviceMeta = this.extractDeviceMetadata(req);

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(
      token,
      ip,
      ua,
      deviceMeta
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    });

    return ok(res, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed successfully');
  }

  async logout(req: Request, res: Response) {
    let token = req.cookies.refreshToken;
    if (!token && req.body.refreshToken) {
      token = req.body.refreshToken;
    }

    const ip = this.getClientIp(req);
    const ua = req.headers['user-agent'] || 'unknown';

    if (token) {
      await authService.logout(token, ip, ua);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
    });

    return ok(res, {}, 'Logout successful');
  }

  async me(req: Request, res: Response) {
    const userId = req.user?.id!;
    const user = await authService.getMe(userId);
    return ok(res, { user });
  }
}
export const authController = new AuthController();
