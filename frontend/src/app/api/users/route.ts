import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, zodErrorToMessage } from "@/lib/http";
import { escapeRegex } from "@/lib/regex";
import { normalizePersistedRole, Roles } from "@/lib/permissions";
import { requireRole } from "@/lib/rbac";
import { paginationSchema } from "@/lib/validation";
import { User } from "@/models/user";

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
      limit: searchParams.get("limit") ?? "20",
      q: searchParams.get("q") ?? undefined,
    });

    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    const { page, limit, q } = parsed.data;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    await connectToDatabase();

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const data = users.map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: normalizePersistedRole(user.role),
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return jsonError("Unable to fetch users.", 500);
  }
}
