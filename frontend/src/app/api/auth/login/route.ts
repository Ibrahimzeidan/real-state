import bcrypt from "bcrypt";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import {
  getAdminAuthUser,
  getAdminPassword,
  isAdminEmail,
} from "@/lib/admin-auth";
import { signAccessToken, setAuthCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson } from "@/lib/http";
import { normalizePersistedRole } from "@/lib/permissions";
import { emailSchema, loginSchema } from "@/lib/validation";
import { User } from "@/models/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(req: Request) {
  try {
    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Invalid email or password.", 400);
    }

    const { email, password } = parsed.data;
    const normalizedEmail = emailSchema.safeParse(email);
    if (!normalizedEmail.success) {
      return jsonError("Invalid email or password.", 400);
    }

    if (isAdminEmail(normalizedEmail.data)) {
      const adminPassword = getAdminPassword();
      if (!secureCompare(password, adminPassword)) {
        return jsonError("Invalid email or password.", 401);
      }

      const adminUser = getAdminAuthUser();
      const token = signAccessToken(adminUser);
      const response = NextResponse.json({
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          createdAt: null,
        },
      });

      setAuthCookie(response, token);
      return response;
    }

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail.data.toLowerCase() });
    if (!user) {
      return jsonError("Invalid email or password.", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return jsonError("Invalid email or password.", 401);
    }

    const role = normalizePersistedRole(user.role);
    const token = signAccessToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
    });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role,
        createdAt: user.createdAt,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch {
    return jsonError("Unable to login.", 500);
  }
}
