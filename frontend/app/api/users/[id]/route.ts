import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { requireRole } from "@/lib/rbac";
import { Roles } from "@/lib/permissions";
import { userRoleUpdateSchema } from "@/lib/validation";
import { User } from "@/models/user";
import { logAudit } from "@/services/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: rawId } = await params;
    if (!isValidObjectId(rawId)) {
      return jsonError("Invalid user id.", 400);
    }

    const authUser = await requireAuth(req);
    if (!authUser) {
      return jsonError("Unauthorized.", 401);
    }

    const roleError = requireRole(authUser, [Roles.ADMIN]);
    if (roleError) {
      return roleError;
    }

    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = userRoleUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    await connectToDatabase();
    const updated = await User.findByIdAndUpdate(
      rawId,
      { role: parsed.data.role },
      { new: true, runValidators: true },
    ).select("name email role createdAt");

    if (!updated) {
      return jsonError("User not found.", 404);
    }

    await logAudit({
      actorId: authUser.id,
      action: "update",
      entityType: "User",
      entityId: updated._id.toString(),
      changes: { role: updated.role },
    });

    return NextResponse.json({
      data: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        role: updated.role,
        createdAt: updated.createdAt,
      },
    });
  } catch {
    return jsonError("Unable to update user.", 500);
  }
}
