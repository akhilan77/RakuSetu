import { auditRepository } from './audit.repository.js';

export class AuditService {
  async log(
    userId: string | null,
    entityType: string,
    entityId: string | null,
    action: string,
    ipAddress?: string,
    userAgent?: string,
    details?: Record<string, any>
  ) {
    try {
      return await prisma.auditLog.create({
        data: {
          userId,
          entityType,
          entityId,
          action,
          ipAddress,
          userAgent,
          payload: details || {},
        },
      });
    } catch (err) {
      console.error('AuditLog writing failed:', err);
    }
  }

  async logMutation(
    userId: string | null,
    entityType: string,
    entityId: string | null,
    action: string,
    details?: Record<string, any>,
    req?: any
  ) {
    return this.log(
      userId,
      entityType,
      entityId,
      action,
      req?.ip,
      req?.headers?.['user-agent'],
      details
    );
  }
}
export const auditService = new AuditService();
