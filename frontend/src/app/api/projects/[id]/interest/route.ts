import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { requireRole } from "@/lib/rbac";
import { Roles } from "@/lib/permissions";
import { paginationSchema, projectInterestSchema } from "@/lib/validation";
import { Project } from "@/models/project";
import { ProjectInterest } from "@/models/projectInterest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>;
};

const normalizeId = (value: string) =>
  decodeURIComponent(String(value || "")).trim();

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: rawId } = await params;
    const id = normalizeId(rawId);
    if (!isValidObjectId(id)) {
      return jsonError("Invalid project id.", 400);
    }

    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = projectInterestSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    await connectToDatabase();

    const project = await Project.findById(id).select("_id").lean();
    if (!project) {
      return jsonError("Project not found.", 404);
    }

    const interest = await ProjectInterest.create({
      projectId: id,
      ...parsed.data,
    });

    return NextResponse.json({ data: interest }, { status: 201 });
  } catch (error) {
    return jsonError("Unable to submit interest.", 500);
  }
}

export async function GET(req: NextRequest, { params }: RouteContext) {
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

    const filter = { projectId: id };
    const [items, total] = await Promise.all([
      ProjectInterest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProjectInterest.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return jsonError("Unable to fetch project interests.", 500);
  }
}
