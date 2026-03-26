import { Schema, models, model, type InferSchemaType } from "mongoose";

const AuditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorName: { type: String, trim: true },
    actorEmail: { type: String, trim: true, lowercase: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    changes: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export type AuditLogDocument = InferSchemaType<typeof AuditLogSchema>;

export const AuditLog = models.AuditLog || model("AuditLog", AuditLogSchema);
