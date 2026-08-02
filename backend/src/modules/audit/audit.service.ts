import { auditRepository } from './audit.repository.js';

export class AuditService {
  async log(
    actorId: string | null,
    entityType: string,
    entityId: string,
    action: string,
    ipAddress?: string,
    userAgent?: string,
    metadata?: any
  ): Promise<void> {
    await auditRepository.createLog({
      actorId,
      entityType,
      entityId,
      action,
      ipAddress,
      userAgent,
      metadata,
    });
  }
}
export const auditService = new AuditService();
