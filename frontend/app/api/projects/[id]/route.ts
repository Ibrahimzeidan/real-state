import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { requireRole } from "@/lib/rbac";
import { Roles } from "@/lib/permissions";
import { projectUpdateSchema } from "@/lib/validation";
import { Project } from "@/models/project";
import { logAudit } from "@/services/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const normalizeDoc = (doc: any) => {
  if (!doc) return doc;
  const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...plain, _id: String(plain._id) };
};

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>;
};

const normalizeId = (value: string) =>
  decodeURIComponent(String(value || "")).trim();

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const { id: rawId } = await params;
    const id = normalizeId(rawId);
    if (!isValidObjectId(id)) {
      return jsonError("Invalid project id.", 400);
    }

    await connectToDatabase();
    const project = await Project.findById(id).lean();
    if (!project) {
      return jsonError("Project not found.", 404);
    }

    return NextResponse.json({ data: normalizeDoc(project) });
  } catch (error) {
    return jsonError("Unable to fetch project.", 500);
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: rawId } = await params;
    const id = normalizeId(rawId);
    if (!isValidObjectId(id)) {
      return jsonError("Invalid project id.", 400);
    }

    const authUser = await requireAuth(req);
    if (!authUser) {
      return jsonError("Unauthorized.", 401);
    }

    const roleError = requireRole(authUser, [Roles.ADMIN, Roles.PROJECT_EDITOR]);
    if (roleError) {
      return roleError;
    }

    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = projectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    const updates = { ...parsed.data };
    if (!Object.keys(updates).length) {
      return jsonError("No updates provided.", 400);
    }

    await connectToDatabase();
    const updated = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return jsonError("Project not found.", 404);
    }

    await logAudit({
      actorId: authUser.id,
      action: "update",
      entityType: "Project",
      entityId: updated._id.toString(),
      changes: updates,
    });

    return NextResponse.json({ data: normalizeDoc(updated) });
  } catch (error) {
    return jsonError("Unable to update project.", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: rawId } = await params;
    const id = normalizeId(rawId);
    if (!isValidObjectId(id)) {
      return jsonError("Invalid project id.", 400);
    }

    const authUser = await requireAuth(req);
    if (!authUser) {
      return jsonError("Unauthorized.", 401);
    }

    const roleError = requireRole(authUser, [Roles.ADMIN, Roles.PROJECT_EDITOR]);
    if (roleError) {
      return roleError;
    }

    await connectToDatabase();
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return jsonError("Project not found.", 404);
    }

    await logAudit({
      actorId: authUser.id,
      action: "delete",
      entityType: "Project",
      entityId: deleted._id.toString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError("Unable to delete project.", 500);
  }
}
