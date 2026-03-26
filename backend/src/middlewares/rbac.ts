import type { Request, Response, NextFunction } from "express";

import { checkPermission, type Role } from "../utils/permissions";

export function requireRole(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    if (!checkPermission(req.user.role, roles)) {
      return res.status(403).json({ error: "Forbidden." });
    }

    next();
  };
}
