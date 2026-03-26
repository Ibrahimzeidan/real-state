import { Schema, models, model, type InferSchemaType } from "mongoose";

const PageContentSchema = new Schema(
  {
    pageName: { type: String, required: true, unique: true, trim: true },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export type PageContentDocument = InferSchemaType<typeof PageContentSchema>;

export const PageContent =
  models.PageContent || model("PageContent", PageContentSchema);
