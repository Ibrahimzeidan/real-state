import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken, type AuthUser } from "../utils/auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const user = verifyAccessToken(token);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  req.user = user;
  next();
}
