import { Schema, models, model, type InferSchemaType } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

BlogSchema.index({ title: "text", content: "text" });

export type BlogDocument = InferSchemaType<typeof BlogSchema>;

export const Blog = models.Blog || model("Blog", BlogSchema);
