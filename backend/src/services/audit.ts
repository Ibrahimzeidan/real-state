import { AuditLog } from "../models/auditLog";

type AuditParams = {
  actorId: string;
  action: "create" | "update" | "delete";
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
};

export async function logAudit({
  actorId,
  action,
  entityType,
  entityId,
  changes,
}: AuditParams) {
  await AuditLog.create({
    actorId,
    action,
    entityType,
    entityId,
    changes: changes ?? null,
  });
}
