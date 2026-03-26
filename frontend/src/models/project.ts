import { Schema, models, model, type InferSchemaType } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

ProjectSchema.index({ title: "text", description: "text" });

export type ProjectDocument = InferSchemaType<typeof ProjectSchema>;

export const Project = models.Project || model("Project", ProjectSchema);
