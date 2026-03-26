"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.projectInterestSchema = exports.contactSchema = exports.pageContentSchema = exports.projectUpdateSchema = exports.projectSchema = exports.blogUpdateSchema = exports.blogSchema = exports.loginSchema = exports.registerSchema = exports.roleSchema = void 0;
const zod_1 = require("zod");
const permissions_1 = require("./permissions");
const sanitizeValue = (value) => value.replace(/\0/g, "").trim();
const safeString = (min, max) => {
    let schema = zod_1.z.string().trim();
    if (min > 0) {
        schema = schema.min(min);
    }
    if (typeof max === "number") {
        schema = schema.max(max);
    }
    return schema.transform(sanitizeValue);
};
const safeEmail = zod_1.z
    .string()
    .trim()
    .email()
    .max(200)
    .transform(sanitizeValue);
const safeUrl = zod_1.z.string().trim().url().transform(sanitizeValue);
exports.roleSchema = zod_1.z.enum(permissions_1.ROLE_OPTIONS);
exports.registerSchema = zod_1.z.object({
    name: safeString(2, 100),
    email: safeEmail,
    password: zod_1.z.string().min(8).max(100),
    role: exports.roleSchema.optional(),
});
exports.loginSchema = zod_1.z.object({
    email: safeEmail,
    password: zod_1.z.string().min(8).max(100),
});
exports.blogSchema = zod_1.z.object({
    title: safeString(2, 200),
    content: safeString(2),
    image: safeUrl.optional().or(zod_1.z.literal("")),
});
exports.blogUpdateSchema = exports.blogSchema.partial();
exports.projectSchema = zod_1.z.object({
    title: safeString(2, 200),
    description: safeString(2, 1000),
    images: zod_1.z.array(safeUrl).optional(),
    details: zod_1.z.any().optional(),
});
exports.projectUpdateSchema = exports.projectSchema.partial();
exports.pageContentSchema = zod_1.z.object({
    content: zod_1.z.any(),
});
exports.contactSchema = zod_1.z.object({
    name: safeString(2, 120),
    email: safeEmail,
    message: safeString(2, 2000),
});
exports.projectInterestSchema = zod_1.z.object({
    name: safeString(2, 120),
    email: safeEmail,
    message: safeString(2, 2000),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    q: zod_1.z.string().trim().transform(sanitizeValue).optional(),
});
