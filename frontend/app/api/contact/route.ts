import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { requireRole } from "@/lib/rbac";
import { Roles } from "@/lib/permissions";
import { contactSchema, paginationSchema } from "@/lib/validation";
import { ContactSubmission } from "@/models/contactSubmission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    await connectToDatabase();
    const submission = await ContactSubmission.create(parsed.data);

    return NextResponse.json({ data: submission }, { status: 201 });
  } catch (error) {
    return jsonError("Unable to submit contact form.", 500);
  }
}

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

    await connectToDatabase();

    const [items, total] = await Promise.all([
      ContactSubmission.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactSubmission.countDocuments(),
    ]);

    return NextResponse.json({
      data: items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return jsonError("Unable to fetch contact submissions.", 500);
  }
}
