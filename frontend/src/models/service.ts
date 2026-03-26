import { Schema, models, model, type InferSchemaType } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export type ServiceDocument = InferSchemaType<typeof ServiceSchema>;

export const Service = models.Service || model("Service", ServiceSchema);
