import { Schema, models, model, type InferSchemaType } from "mongoose";

const NewsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String },
    category: { type: String, trim: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

NewsSchema.index({ title: "text", content: "text", category: "text" });

export type NewsDocument = InferSchemaType<typeof NewsSchema>;

export const News = models.News || model("News", NewsSchema);
