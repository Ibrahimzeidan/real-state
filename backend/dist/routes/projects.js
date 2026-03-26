"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const db_1 = require("../config/db");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const project_1 = require("../models/project");
const projectInterest_1 = require("../models/projectInterest");
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
        filter.$or = [{ title: regex }, { description: regex }];
    }
    await (0, db_1.connectDb)();
    const [items, total] = await Promise.all([
        project_1.Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        project_1.Project.countDocuments(filter),
    ]);
    return res.json({
        data: items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}));
router.post("/", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN, permissions_1.Roles.PROJECT_EDITOR]), (0, async_1.asyncHandler)(async (req, res) => {
    const parsed = validation_1.projectSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    await (0, db_1.connectDb)();
    const project = await project_1.Project.create(parsed.data);
    if (req.user) {
        await (0, audit_1.logAudit)({
            actorId: req.user.id,
            action: "create",
            entityType: "Project",
            entityId: project._id.toString(),
            changes: { title: project.title },
        });
    }
    return res.status(201).json({ data: project });
}));
router.get("/:id", (0, async_1.asyncHandler)(async (req, res) => {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        return res.status(400).json({ error: "Invalid project id." });
    }
    await (0, db_1.connectDb)();
    const project = await project_1.Project.findById(req.params.id).lean();
    if (!project) {
        return res.status(404).json({ error: "Project not found." });
    }
    return res.json({ data: project });
}));
router.put("/:id", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN, permissions_1.Roles.PROJECT_EDITOR]), (0, async_1.asyncHandler)(async (req, res) => {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        return res.status(400).json({ error: "Invalid project id." });
    }
    const parsed = validation_1.projectUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    const updates = { ...parsed.data };
    if (!Object.keys(updates).length) {
        return res.status(400).json({ error: "No updates provided." });
    }
    await (0, db_1.connectDb)();
    const updated = await project_1.Project.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    if (!updated) {
        return res.status(404).json({ error: "Project not found." });
    }
    if (req.user) {
        await (0, audit_1.logAudit)({
            actorId: req.user.id,
            action: "update",
            entityType: "Project",
            entityId: updated._id.toString(),
            changes: updates,
        });
    }
    return res.json({ data: updated });
}));
router.delete("/:id", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN, permissions_1.Roles.PROJECT_EDITOR]), (0, async_1.asyncHandler)(async (req, res) => {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        return res.status(400).json({ error: "Invalid project id." });
    }
    await (0, db_1.connectDb)();
    const deleted = await project_1.Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: "Project not found." });
    }
    if (req.user) {
        await (0, audit_1.logAudit)({
            actorId: req.user.id,
            action: "delete",
            entityType: "Project",
            entityId: deleted._id.toString(),
        });
    }
    return res.json({ success: true });
}));
router.post("/:id/interest", (0, async_1.asyncHandler)(async (req, res) => {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        return res.status(400).json({ error: "Invalid project id." });
    }
    const parsed = validation_1.projectInterestSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    await (0, db_1.connectDb)();
    const project = await project_1.Project.findById(req.params.id).select("_id").lean();
    if (!project) {
        return res.status(404).json({ error: "Project not found." });
    }
    const interest = await projectInterest_1.ProjectInterest.create({
        projectId: req.params.id,
        ...parsed.data,
    });
    return res.status(201).json({ data: interest });
}));
router.get("/:id/interest", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN]), (0, async_1.asyncHandler)(async (req, res) => {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        return res.status(400).json({ error: "Invalid project id." });
    }
    const parsed = validation_1.paginationSchema.safeParse({
        page: req.query.page ?? "1",
        limit: req.query.limit ?? "10",
    });
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid pagination parameters." });
    }
    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;
    await (0, db_1.connectDb)();
    const filter = { projectId: req.params.id };
    const [items, total] = await Promise.all([
        projectInterest_1.ProjectInterest.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        projectInterest_1.ProjectInterest.countDocuments(filter),
    ]);
    return res.json({
        data: items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}));
exports.default = router;
