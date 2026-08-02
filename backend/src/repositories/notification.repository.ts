import { prisma } from '../lib/prisma.js';
import { Prisma } from '@prisma/client';

export class NotificationRepository {
  async log(data: Prisma.NotificationLogUncheckedCreateInput) {
    return prisma.notificationLog.create({
      data,
    });
  }

  async updateStatus(id: string, status: any, providerResponse?: any) {
    return prisma.notificationLog.update({
      where: { id },
      data: {
        status,
        providerResponse,
        updatedAt: new Date(),
      },
    });
  }
}
export const notificationRepository = new NotificationRepository();
