import { NextResponse } from "next/server";

import type { AuthUser } from "@/lib/auth";
import { checkPermission, type Role } from "@/lib/permissions";

export function requireRole(user: AuthUser, roles: Role[]) {
  if (!checkPermission(user.role, roles)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  return null;
}
