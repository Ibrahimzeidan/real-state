import { isValidObjectId } from "mongoose";

import {
  ADMIN_NAME,
  getAdminEmail,
  isAdminId,
} from "@/lib/admin-auth";
import { connectToDatabase } from "@/lib/db";
import { AuditLog } from "@/models/auditLog";

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
  await connectToDatabase();
  await AuditLog.create({
    ...(isValidObjectId(actorId)
      ? { actorId }
      : isAdminId(actorId)
        ? {
            actorName: ADMIN_NAME,
            actorEmail: getAdminEmail(),
          }
        : {
            actorName: "System",
          }),
    action,
    entityType,
    entityId,
    changes: changes ?? null,
  });
}
