import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";

import { getAdminAuthUser, isAdminUser } from "@/lib/admin-auth";
import type { Role } from "@/lib/permissions";
import { normalizePersistedRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  return secret;
}

export function signAccessToken(user: AuthUser) {
  const secret = getJwtSecret();
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      subject: user.id,
      expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
    },
  );
}

export function verifyAccessToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    if (!payload?.sub || !payload?.email || !payload?.role) {
      return null;
    }
    return {
      id: String(payload.sub),
      name: String(payload.name || ""),
      email: String(payload.email),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function getAuthUserFromToken(token: string): Promise<AuthUser | null> {
  const payload = verifyAccessToken(token);
  if (!payload) {
    return null;
  }

  if (isAdminUser(payload)) {
    return getAdminAuthUser();
  }

  try {
    await connectToDatabase();
    const user = await User.findById(payload.id)
      .select("name email role")
      .lean<any>();
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: normalizePersistedRole(user.role) as Role,
    };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies.get("token")?.value ?? null;
}

export async function requireAuth(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }
  return await getAuthUserFromToken(token);
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
