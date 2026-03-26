"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const contactSubmission_1 = require("../models/contactSubmission");
const async_1 = require("../utils/async");
const permissions_1 = require("../utils/permissions");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.post("/", (0, async_1.asyncHandler)(async (req, res) => {
    const parsed = validation_1.contactSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    await (0, db_1.connectDb)();
    const submission = await contactSubmission_1.ContactSubmission.create(parsed.data);
    return res.status(201).json({ data: submission });
}));
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
    await (0, db_1.connectDb)();
    const [items, total] = await Promise.all([
        contactSubmission_1.ContactSubmission.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        contactSubmission_1.ContactSubmission.countDocuments(),
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
