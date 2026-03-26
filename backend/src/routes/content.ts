import { Router } from "express";

import { connectDb } from "../config/db";
import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { PageContent } from "../models/pageContent";
import { logAudit } from "../services/audit";
import { asyncHandler } from "../utils/async";
import { Roles } from "../utils/permissions";
import { pageContentSchema } from "../utils/validation";

const router = Router();

router.get(
  "/:page",
  asyncHandler(async (req, res) => {
    const pageName = req.params.page;
    if (!pageName) {
      return res.status(400).json({ error: "Page name is required." });
    }

    await connectDb();
    const page = await PageContent.findOne({ pageName }).lean();
    return res.json({
      data: page ?? { pageName, content: null },
    });
  }),
);

router.put(
  "/:page",
  requireAuth,
  requireRole([Roles.ADMIN]),
  asyncHandler(async (req, res) => {
    const pageName = req.params.page;
    if (!pageName) {
      return res.status(400).json({ error: "Page name is required." });
    }

    const parsed = pageContentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    await connectDb();
    const updated = await PageContent.findOneAndUpdate(
      { pageName },
      { content: parsed.data.content },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        action: "update",
        entityType: "PageContent",
        entityId: updated._id.toString(),
        changes: { pageName },
      });
    }

    return res.json({ data: updated });
  }),
);

export default router;
