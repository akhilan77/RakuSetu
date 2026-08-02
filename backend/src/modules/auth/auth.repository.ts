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

  async findOrCreateUser(phone: string) {
    const existing = await this.findUserByPhone(phone);
    if (existing) return existing;

    return prisma.user.create({
      data: {
        phone,
        name: 'New User',
        roles: {
          create: [{ role: Role.DONOR }],
        },
      },
      include: { roles: true },
    });
  }

  async storeRefreshToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
    metadata: { deviceName?: string; ipAddress?: string; userAgent?: string }
  ) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token: tokenHash,
        expiresAt,
        deviceName: metadata.deviceName,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });
  }

  async findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: {
        user: {
          include: { roles: true },
        },
      },
    });
  }

  async revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
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
}
export const authRepository = new AuthRepository();
