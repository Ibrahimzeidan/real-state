import { Router } from "express";

import { connectDb } from "../config/db";
import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { ContactSubmission } from "../models/contactSubmission";
import { asyncHandler } from "../utils/async";
import { Roles } from "../utils/permissions";
import { contactSchema, paginationSchema } from "../utils/validation";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    await connectDb();
    const submission = await ContactSubmission.create(parsed.data);

    return res.status(201).json({ data: submission });
  }),
);

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

    await connectDb();

    const [items, total] = await Promise.all([
      ContactSubmission.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactSubmission.countDocuments(),
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
