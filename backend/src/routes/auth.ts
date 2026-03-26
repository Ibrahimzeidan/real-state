import { Router } from "express";
import bcrypt from "bcrypt";

import { connectDb } from "../config/db";
import { env } from "../config/env";
import { requireAuth } from "../middlewares/auth";
import { User } from "../models/user";
import { asyncHandler } from "../utils/async";
import { signAccessToken } from "../utils/auth";
import { Roles } from "../utils/permissions";
import { loginSchema, registerSchema } from "../utils/validation";

const router = Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    const { name, email, password } = parsed.data;

    await connectDb();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: Roles.VIEWER,
    });

    const token = signAccessToken({
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
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const { email, password } = parsed.data;

    await connectDb();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signAccessToken({
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
  }),
);

router.post("/logout", (_req, res) => {
  return res.json({ success: true });
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    await connectDb();
    const user = await User.findById(req.user.id);
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
  }),
);

export default router;
