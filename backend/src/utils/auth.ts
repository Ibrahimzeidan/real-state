import jwt from "jsonwebtoken";

import { env } from "../config/env";
import type { Role } from "./permissions";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function signAccessToken(user: AuthUser) {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
}

export function verifyAccessToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
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
