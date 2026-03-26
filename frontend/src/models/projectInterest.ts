import { Schema, models, model, type InferSchemaType } from "mongoose";

const ProjectInterestSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export type ProjectInterestDocument =
  InferSchemaType<typeof ProjectInterestSchema>;

export const ProjectInterest =
  models.ProjectInterest || model("ProjectInterest", ProjectInterestSchema);
