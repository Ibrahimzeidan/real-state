"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const db_1 = require("../config/db");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const auditLog_1 = require("../models/auditLog");
const async_1 = require("../utils/async");
const permissions_1 = require("../utils/permissions");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, (0, rbac_1.requireRole)([permissions_1.Roles.ADMIN]), (0, async_1.asyncHandler)(async (req, res) => {
    const parsed = validation_1.paginationSchema.safeParse({
        page: req.query.page ?? "1",
        limit: req.query.limit ?? "10",
    });
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid pagination parameters." });
    }
    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;
    const entityType = req.query.entityType;
    const actorId = req.query.actorId;
    const filter = {};
    if (entityType) {
        filter.entityType = entityType;
    }
    if (actorId && (0, mongoose_1.isValidObjectId)(actorId)) {
        filter.actorId = actorId;
    }
    await (0, db_1.connectDb)();
    const [items, total] = await Promise.all([
        auditLog_1.AuditLog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        auditLog_1.AuditLog.countDocuments(filter),
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
