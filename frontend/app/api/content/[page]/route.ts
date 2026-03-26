import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { requireRole } from "@/lib/rbac";
import { Roles } from "@/lib/permissions";
import { pageContentSchema } from "@/lib/validation";
import { PageContent } from "@/models/pageContent";
import { logAudit } from "@/services/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: { page: string } | Promise<{ page: string }>;
};

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const { page: pageName } = await params;
    if (!pageName) {
      return jsonError("Page name is required.", 400);
    }

    await connectToDatabase();
    const page = await PageContent.findOne({ pageName }).lean();

    return NextResponse.json({
      data: page ?? { pageName, content: null },
    });
  } catch (error) {
    return jsonError("Unable to fetch page content.", 500);
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { page: pageName } = await params;
    if (!pageName) {
      return jsonError("Page name is required.", 400);
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

    const parsed = pageContentSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    await connectToDatabase();
    const updated = await PageContent.findOneAndUpdate(
      { pageName },
      { content: parsed.data.content },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    await logAudit({
      actorId: authUser.id,
      action: "update",
      entityType: "PageContent",
      entityId: updated._id.toString(),
      changes: { pageName },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return jsonError("Unable to update page content.", 500);
  }
}
