import { Router } from "express";
import { isValidObjectId } from "mongoose";

import { connectDb } from "../config/db";
import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { AuditLog } from "../models/auditLog";
import { asyncHandler } from "../utils/async";
import { Roles } from "../utils/permissions";
import { paginationSchema } from "../utils/validation";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole([Roles.ADMIN]),
  asyncHandler(async (req, res) => {
    const parsed = paginationSchema.safeParse({
      page: req.query.page ?? "1",
      limit: req.query.limit ?? "10",
    });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid pagination parameters." });
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const entityType = req.query.entityType as string | undefined;
    const actorId = req.query.actorId as string | undefined;

    const filter: Record<string, unknown> = {};
    if (entityType) {
      filter.entityType = entityType;
    }
    if (actorId && isValidObjectId(actorId)) {
      filter.actorId = actorId;
    }

    await connectDb();

    const [items, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
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
