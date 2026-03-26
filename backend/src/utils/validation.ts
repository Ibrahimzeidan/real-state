import { z } from "zod";

import { ROLE_OPTIONS } from "./permissions";

const sanitizeValue = (value: string) => value.replace(/\0/g, "").trim();

const safeString = (min: number, max?: number) => {
  let schema = z.string().trim();
  if (min > 0) {
    schema = schema.min(min);
  }
  if (typeof max === "number") {
    schema = schema.max(max);
  }
  return schema.transform(sanitizeValue);
};

const safeEmail = z
  .string()
  .trim()
  .email()
  .max(200)
  .transform(sanitizeValue);

const safeUrl = z.string().trim().url().transform(sanitizeValue);

export const roleSchema = z.enum(ROLE_OPTIONS);

export const registerSchema = z.object({
  name: safeString(2, 100),
  email: safeEmail,
  password: z.string().min(8).max(100),
  role: roleSchema.optional(),
});

export const loginSchema = z.object({
  email: safeEmail,
  password: z.string().min(8).max(100),
});

export const blogSchema = z.object({
  title: safeString(2, 200),
  content: safeString(2),
  image: safeUrl.optional().or(z.literal("")),
});

export const blogUpdateSchema = blogSchema.partial();

export const projectSchema = z.object({
  title: safeString(2, 200),
  description: safeString(2, 1000),
  images: z.array(safeUrl).optional(),
  details: z.any().optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export const pageContentSchema = z.object({
  content: z.any(),
});

export const contactSchema = z.object({
  name: safeString(2, 120),
  email: safeEmail,
  message: safeString(2, 2000),
});

export const projectInterestSchema = z.object({
  name: safeString(2, 120),
  email: safeEmail,
  message: safeString(2, 2000),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().trim().transform(sanitizeValue).optional(),
});
