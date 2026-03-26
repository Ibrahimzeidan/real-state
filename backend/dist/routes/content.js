"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const pageContent_1 = require("../models/pageContent");
const audit_1 = require("../services/audit");
const async_1 = require("../utils/async");
const permissions_1 = require("../utils/permissions");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.get("/:page", (0, async_1.asyncHandler)(async (req, res) => {
    const pageName = req.params.page;
    if (!pageName) {
        return res.status(400).json({ error: "Page name is required." });
    }
    await (0, db_1.connectDb)();
    const page = await pageContent_1.PageContent.findOne({ pageName }).lean();
    return res.json({
        data: page ?? { pageName, content: null },
    });
}));
router.put("/:page", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN]), (0, async_1.asyncHandler)(async (req, res) => {
    const pageName = req.params.page;
    if (!pageName) {
        return res.status(400).json({ error: "Page name is required." });
    }
    const parsed = validation_1.pageContentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    await (0, db_1.connectDb)();
    const updated = await pageContent_1.PageContent.findOneAndUpdate({ pageName }, { content: parsed.data.content }, { new: true, upsert: true, setDefaultsOnInsert: true });
    if (req.user) {
        await (0, audit_1.logAudit)({
            actorId: req.user.id,
            action: "update",
            entityType: "PageContent",
            entityId: updated._id.toString(),
            changes: { pageName },
        });
    }
    return res.json({ data: updated });
}));
exports.default = router;
