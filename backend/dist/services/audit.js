"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = logAudit;
const auditLog_1 = require("../models/auditLog");
async function logAudit({ actorId, action, entityType, entityId, changes, }) {
    await auditLog_1.AuditLog.create({
        actorId,
        action,
        entityType,
        entityId,
        changes: changes ?? null,
    });
}
