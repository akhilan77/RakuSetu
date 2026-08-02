import { prisma } from '../../lib/prisma.js';
import { Role } from '@prisma/client';

export class AuthRepository {
  async findUserByPhone(phone: string) {
    return prisma.user.findUnique({
      where: { phone },
      include: { roles: true },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
  }

  async createUser(phone: string, defaultName: string) {
    return prisma.user.create({
      data: {
        phone,
        name: defaultName,
        phoneVerifiedAt: new Date(),
        roles: {
          create: [{ role: Role.DONOR }],
        },
      },
      include: { roles: true },
    });
  }

  async incrementUserTokenVersion(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });
  }

  async createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    deviceName?: string;
    deviceId?: string;
    platform?: string;
    browser?: string;
  }) {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { roles: true } } },
    });
  }

  async revokeRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.update({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  async revokeAllRefreshTokensForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}
export const authRepository = new AuthRepository();
