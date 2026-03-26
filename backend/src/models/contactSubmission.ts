import { Schema, models, model, type InferSchemaType } from "mongoose";

const ContactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export type ContactSubmissionDocument =
  InferSchemaType<typeof ContactSubmissionSchema>;

export const ContactSubmission =
  models.ContactSubmission ||
  model("ContactSubmission", ContactSubmissionSchema);
