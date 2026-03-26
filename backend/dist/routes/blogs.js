"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const db_1 = require("../config/db");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const blog_1 = require("../models/blog");
const audit_1 = require("../services/audit");
const async_1 = require("../utils/async");
const permissions_1 = require("../utils/permissions");
const regex_1 = require("../utils/regex");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.get("/", (0, async_1.asyncHandler)(async (req, res) => {
    const parsed = validation_1.paginationSchema.safeParse({
        page: req.query.page ?? "1",
        limit: req.query.limit ?? "10",
        q: req.query.q ?? undefined,
    });
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid pagination parameters." });
    }
    const { page, limit, q } = parsed.data;
    const skip = (page - 1) * limit;
    const filter = {};
    if (q) {
        const regex = new RegExp((0, regex_1.escapeRegex)(q), "i");
        filter.$or = [{ title: regex }, { content: regex }];
    }
    await (0, db_1.connectDb)();
    const [items, total] = await Promise.all([
        blog_1.Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        blog_1.Blog.countDocuments(filter),
    ]);
    return res.json({
        data: items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}));
router.post("/", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN, permissions_1.Roles.BLOG_EDITOR]), (0, async_1.asyncHandler)(async (req, res) => {
    const parsed = validation_1.blogSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    await (0, db_1.connectDb)();
    const { title, content, image } = parsed.data;
    const blog = await blog_1.Blog.create({
        title,
        content,
        image: image || undefined,
        authorId: req.user?.id,
    });
    if (req.user) {
        await (0, audit_1.logAudit)({
            actorId: req.user.id,
            action: "create",
            entityType: "Blog",
            entityId: blog._id.toString(),
            changes: { title },
        });
    }
    return res.status(201).json({ data: blog });
}));
router.get("/:id", (0, async_1.asyncHandler)(async (req, res) => {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        return res.status(400).json({ error: "Invalid blog id." });
    }
    await (0, db_1.connectDb)();
    const blog = await blog_1.Blog.findById(req.params.id).lean();
    if (!blog) {
        return res.status(404).json({ error: "Blog not found." });
    }
    return res.json({ data: blog });
}));
router.put("/:id", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN, permissions_1.Roles.BLOG_EDITOR]), (0, async_1.asyncHandler)(async (req, res) => {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        return res.status(400).json({ error: "Invalid blog id." });
    }
    const parsed = validation_1.blogUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    const updates = { ...parsed.data };
    if (!Object.keys(updates).length) {
        return res.status(400).json({ error: "No updates provided." });
    }
    if (updates.image === "") {
        delete updates.image;
    }
    await (0, db_1.connectDb)();
    const updated = await blog_1.Blog.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    if (!updated) {
        return res.status(404).json({ error: "Blog not found." });
    }
    if (req.user) {
        await (0, audit_1.logAudit)({
            actorId: req.user.id,
            action: "update",
            entityType: "Blog",
            entityId: updated._id.toString(),
            changes: updates,
        });
    }
    return res.json({ data: updated });
}));
router.delete("/:id", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN, permissions_1.Roles.BLOG_EDITOR]), (0, async_1.asyncHandler)(async (req, res) => {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        return res.status(400).json({ error: "Invalid blog id." });
    }
    await (0, db_1.connectDb)();
    const deleted = await blog_1.Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: "Blog not found." });
    }
    if (req.user) {
        await (0, audit_1.logAudit)({
            actorId: req.user.id,
            action: "delete",
            entityType: "Blog",
            entityId: deleted._id.toString(),
        });
    }
    return res.json({ success: true });
}));
exports.default = router;
