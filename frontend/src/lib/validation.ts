import { z } from "zod";

import { ROLE_OPTIONS } from "@/lib/permissions";

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

const optionalSafeString = (min: number, max?: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim().length === 0 ? undefined : value,
    safeString(min, max).optional(),
  );

const safeEmail = z
  .string()
  .trim()
  .email()
  .max(200)
  .transform(sanitizeValue);

export const emailSchema = safeEmail;

const safeUrl = z.string().trim().url().transform(sanitizeValue);

export const roleSchema = z.enum(ROLE_OPTIONS);

export const registerSchema = z.object({
  name: safeString(2, 100),
  email: safeEmail,
  password: z.string().min(8).max(100),
  role: roleSchema.optional(),
});

export const loginSchema = z.object({
  email: safeString(1, 200),
  password: z.string().min(1).max(100),
});

export const pageNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/i, "Page name can only use letters, numbers, and hyphens.")
  .transform(sanitizeValue);

export const adminCredentialsUpdateSchema = z
  .object({
    currentPassword: z.string().min(1).max(100),
    email: safeEmail.optional(),
    password: z.string().min(8).max(100).optional(),
    confirmPassword: z.string().min(8).max(100).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.email && !value.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide a new email or a new password.",
        path: ["email"],
      });
    }

    if (value.password && value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }

    if (!value.password && value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a new password first.",
        path: ["password"],
      });
    }
  });

export const blogSchema = z.object({
  title: safeString(2, 200),
  content: safeString(2),
  image: safeUrl.optional().or(z.literal("")),
});

export const blogUpdateSchema = blogSchema.partial();

export const newsSchema = z.object({
  title: safeString(2, 200),
  content: safeString(2),
  image: safeUrl.optional().or(z.literal("")),
  category: optionalSafeString(2, 80),
});

export const newsUpdateSchema = newsSchema.partial();

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

export const serviceSchema = z.object({
  title: safeString(2, 120),
  description: safeString(2, 1000),
});

export const serviceUpdateSchema = serviceSchema.partial();

export const userRoleUpdateSchema = z.object({
  role: roleSchema,
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().trim().transform(sanitizeValue).optional(),
});
