import { Router } from "express";
import { isValidObjectId } from "mongoose";

import { connectDb } from "../config/db";
import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { Project } from "../models/project";
import { ProjectInterest } from "../models/projectInterest";
import { logAudit } from "../services/audit";
import { asyncHandler } from "../utils/async";
import { Roles } from "../utils/permissions";
import { escapeRegex } from "../utils/regex";
import {
  paginationSchema,
  projectInterestSchema,
  projectSchema,
  projectUpdateSchema,
} from "../utils/validation";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = paginationSchema.safeParse({
      page: req.query.page ?? "1",
      limit: req.query.limit ?? "10",
      q: req.query.q ?? undefined,
    });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid pagination parameters." });
    }

    const { page, limit, q } = parsed.data;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};

    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

    await connectDb();
    const [items, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(filter),
    ]);

    return res.json({
      data: items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }),
);

router.post(
  "/",
  requireAuth,
  requireRole([Roles.ADMIN, Roles.PROJECT_EDITOR]),
  asyncHandler(async (req, res) => {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    await connectDb();
    const project = await Project.create(parsed.data);

    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        action: "create",
        entityType: "Project",
        entityId: project._id.toString(),
        changes: { title: project.title },
      });
    }

    return res.status(201).json({ data: project });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project id." });
    }

    await connectDb();
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    return res.json({ data: project });
  }),
);

router.put(
  "/:id",
  requireAuth,
  requireRole([Roles.ADMIN, Roles.PROJECT_EDITOR]),
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project id." });
    }

    const parsed = projectUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    const updates = { ...parsed.data } as Record<string, unknown>;
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No updates provided." });
    }

    await connectDb();
    const updated = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Project not found." });
    }

    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        action: "update",
        entityType: "Project",
        entityId: updated._id.toString(),
        changes: updates,
      });
    }

    return res.json({ data: updated });
  }),
);

router.delete(
  "/:id",
  requireAuth,
  requireRole([Roles.ADMIN, Roles.PROJECT_EDITOR]),
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project id." });
    }

    await connectDb();
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Project not found." });
    }

    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        action: "delete",
        entityType: "Project",
        entityId: deleted._id.toString(),
      });
    }

    return res.json({ success: true });
  }),
);

router.post(
  "/:id/interest",
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project id." });
    }

    const parsed = projectInterestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    await connectDb();
    const project = await Project.findById(req.params.id).select("_id").lean();
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const interest = await ProjectInterest.create({
      projectId: req.params.id,
      ...parsed.data,
    });

    return res.status(201).json({ data: interest });
  }),
);

router.get(
  "/:id/interest",
  requireAuth,
  requireRole([Roles.ADMIN]),
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project id." });
    }

    const parsed = paginationSchema.safeParse({
      page: req.query.page ?? "1",
      limit: req.query.limit ?? "10",
    });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid pagination parameters." });
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    await connectDb();

    const filter = { projectId: req.params.id };
    const [items, total] = await Promise.all([
      ProjectInterest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProjectInterest.countDocuments(filter),
    ]);

    return res.json({
      data: items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }),
);

export default router;
