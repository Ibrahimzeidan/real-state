"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
require("dotenv/config");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(4000),
    MONGODB_URI: zod_1.z.string().min(1, "MONGODB_URI is required."),
    MONGODB_DB: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string().min(1, "JWT_SECRET is required."),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().default(12),
    CORS_ORIGIN: zod_1.z.string().optional(),
});
exports.env = envSchema.parse(process.env);
