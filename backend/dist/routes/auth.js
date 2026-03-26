"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../config/db");
const env_1 = require("../config/env");
const auth_1 = require("../middlewares/auth");
const user_1 = require("../models/user");
const async_1 = require("../utils/async");
const auth_2 = require("../utils/auth");
const permissions_1 = require("../utils/permissions");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.post("/register", (0, async_1.asyncHandler)(async (req, res) => {
    const parsed = validation_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    const { name, email, password } = parsed.data;
    await (0, db_1.connectDb)();
    const existing = await user_1.User.findOne({ email: email.toLowerCase() });
    if (existing) {
        return res.status(409).json({ error: "Email already registered." });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, env_1.env.BCRYPT_SALT_ROUNDS);
    const user = await user_1.User.create({
        name,
        email,
        password: hashedPassword,
        role: permissions_1.Roles.VIEWER,
    });
    const token = (0, auth_2.signAccessToken)({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    });
    return res.status(201).json({
        token,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
}));
router.post("/login", (0, async_1.asyncHandler)(async (req, res) => {
    const parsed = validation_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid email or password." });
    }
    const { email, password } = parsed.data;
    await (0, db_1.connectDb)();
    const user = await user_1.User.findOne({ email: email.toLowerCase() });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
    }
    const isValid = await bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password." });
    }
    const token = (0, auth_2.signAccessToken)({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    });
    return res.json({
        token,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
}));
router.post("/logout", (_req, res) => {
    return res.json({ success: true });
});
router.get("/me", auth_1.requireAuth, (0, async_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized." });
    }
    await (0, db_1.connectDb)();
    const user = await user_1.User.findById(req.user.id);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized." });
    }
    return res.json({
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
}));
exports.default = router;
