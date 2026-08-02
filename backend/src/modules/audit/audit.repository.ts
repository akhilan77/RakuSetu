import { prisma } from '../../lib/prisma.js';

export class AuditRepository {
  async createLog(data: {
    actorId: string | null;
    entityType: string;
    entityId: string;
    action: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {
    return prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });
  }
}
export const auditRepository = new AuditRepository();
