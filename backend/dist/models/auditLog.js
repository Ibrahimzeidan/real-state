"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const AuditLogSchema = new mongoose_1.Schema({
    actorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    changes: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.AuditLog = mongoose_1.models.AuditLog || (0, mongoose_1.model)("AuditLog", AuditLogSchema);
