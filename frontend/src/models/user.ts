import { Schema, models, model, type InferSchemaType } from "mongoose";

import { ROLE_OPTIONS } from "@/lib/permissions";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ROLE_OPTIONS, default: "VIEWER" },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

export const User = models.User || model("User", UserSchema);
