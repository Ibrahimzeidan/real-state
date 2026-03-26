import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { requireRole } from "@/lib/rbac";
import { Roles } from "@/lib/permissions";
import { pageContentSchema, pageNameSchema } from "@/lib/validation";
import { PageContent } from "@/models/pageContent";
import { logAudit } from "@/services/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: { page: string } | Promise<{ page: string }>;
};

function parsePageName(rawPageName: string) {
  const parsed = pageNameSchema.safeParse(rawPageName);
  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}

function serializePageContent(page: any) {
  if (!page) {
    return null;
  }

  return {
    id: page._id?.toString?.() ?? null,
    pageName: page.pageName,
    content: page.content,
    createdAt: page.createdAt ?? null,
    updatedAt: page.updatedAt ?? null,
  };
}

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const { page: rawPageName } = await params;
    const pageName = parsePageName(rawPageName);
    if (!pageName) {
      return jsonError("Invalid page name.", 400);
    }

    await connectToDatabase();
    const page = await PageContent.findOne({ pageName }).lean();

    return NextResponse.json({
      data: serializePageContent(page) ?? {
        id: null,
        pageName,
        content: null,
        createdAt: null,
        updatedAt: null,
      },
    });
  } catch {
    return jsonError("Unable to fetch page content.", 500);
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { page: rawPageName } = await params;
    const pageName = parsePageName(rawPageName);
    if (!pageName) {
      return jsonError("Invalid page name.", 400);
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

    return NextResponse.json({ data: serializePageContent(updated) });
  } catch {
    return jsonError("Unable to update page content.", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { page: rawPageName } = await params;
    const pageName = parsePageName(rawPageName);
    if (!pageName) {
      return jsonError("Invalid page name.", 400);
    }

    const authUser = await requireAuth(req);
    if (!authUser) {
      return jsonError("Unauthorized.", 401);
    }

    const roleError = requireRole(authUser, [Roles.ADMIN]);
    if (roleError) {
      return roleError;
    }

    await connectToDatabase();
    const deleted = await PageContent.findOneAndDelete({ pageName });
    if (!deleted) {
      return jsonError("Page content not found.", 404);
    }

    await logAudit({
      actorId: authUser.id,
      action: "delete",
      entityType: "PageContent",
      entityId: deleted._id.toString(),
      changes: { pageName },
    });

    return NextResponse.json({
      data: {
        id: deleted._id.toString(),
        pageName: deleted.pageName,
      },
    });
  } catch {
    return jsonError("Unable to delete page content.", 500);
  }
}
