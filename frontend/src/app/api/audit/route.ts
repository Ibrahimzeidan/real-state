import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { requireRole } from "@/lib/rbac";
import { Roles } from "@/lib/permissions";
import { paginationSchema } from "@/lib/validation";
import { AuditLog } from "@/models/auditLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    if (!authUser) {
      return jsonError("Unauthorized.", 401);
    }

    const roleError = requireRole(authUser, [Roles.ADMIN]);
    if (roleError) {
      return roleError;
    }

    const { searchParams } = new URL(req.url);
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "10",
    });
    if (!parsed.success) {
      return jsonError("Invalid pagination parameters.", 400);
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const entityType = searchParams.get("entityType");
    const actorId = searchParams.get("actorId");

    const filter: Record<string, unknown> = {};
    if (entityType) {
      filter.entityType = entityType;
    }
    if (actorId && isValidObjectId(actorId)) {
      filter.actorId = actorId;
    }

    await connectToDatabase();

    const [items, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return jsonError("Unable to fetch audit logs.", 500);
  }
}
