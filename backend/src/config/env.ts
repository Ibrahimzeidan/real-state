import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required."),
  MONGODB_DB: z.string().optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required."),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  CORS_ORIGIN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
