import { Router } from "express";
import { isValidObjectId } from "mongoose";

import { connectDb } from "../config/db";
import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { Blog } from "../models/blog";
import { logAudit } from "../services/audit";
import { asyncHandler } from "../utils/async";
import { Roles } from "../utils/permissions";
import { escapeRegex } from "../utils/regex";
import { blogSchema, blogUpdateSchema, paginationSchema } from "../utils/validation";

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
      filter.$or = [{ title: regex }, { content: regex }];
    }

    await connectDb();
    const [items, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
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
  requireRole([Roles.ADMIN, Roles.BLOG_EDITOR]),
  asyncHandler(async (req, res) => {
    const parsed = blogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    await connectDb();
    const { title, content, image } = parsed.data;
    const blog = await Blog.create({
      title,
      content,
      image: image || undefined,
      authorId: req.user?.id,
    });

    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        action: "create",
        entityType: "Blog",
        entityId: blog._id.toString(),
        changes: { title },
      });
    }

    return res.status(201).json({ data: blog });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog id." });
    }

    await connectDb();
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    return res.json({ data: blog });
  }),
);

router.put(
  "/:id",
  requireAuth,
  requireRole([Roles.ADMIN, Roles.BLOG_EDITOR]),
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog id." });
    }

    const parsed = blogUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    const updates = { ...parsed.data } as Record<string, unknown>;
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No updates provided." });
    }

    if (updates.image === "") {
      delete updates.image;
    }

    await connectDb();
    const updated = await Blog.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Blog not found." });
    }

    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        action: "update",
        entityType: "Blog",
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
  requireRole([Roles.ADMIN, Roles.BLOG_EDITOR]),
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog id." });
    }

    await connectDb();
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Blog not found." });
    }

    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        action: "delete",
        entityType: "Blog",
        entityId: deleted._id.toString(),
      });
    }

    return res.json({ success: true });
  }),
);

export default router;
