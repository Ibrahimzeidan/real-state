import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { escapeRegex } from "@/lib/regex";
import { requireRole } from "@/lib/rbac";
import { Roles } from "@/lib/permissions";
import { newsSchema, paginationSchema } from "@/lib/validation";
import { News } from "@/models/news";
import { logAudit } from "@/services/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const normalizeDoc = (doc: any) => {
  if (!doc) return doc;
  const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...plain, _id: String(plain._id) };
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "10",
      q: searchParams.get("q") ?? undefined,
    });

    if (!parsed.success) {
      return jsonError("Invalid pagination parameters.", 400);
    }

    const { page, limit, q } = parsed.data;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [
        { title: regex },
        { content: regex },
        { category: regex },
      ];
    }

    await connectToDatabase();

    const [items, total] = await Promise.all([
      News.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      News.countDocuments(filter),
    ]);
    const safeItems = Array.isArray(items) ? items : [];

    return NextResponse.json({
      data: safeItems.map(normalizeDoc),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return jsonError("Unable to fetch news.", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    if (!authUser) {
      return jsonError("Unauthorized.", 401);
    }

    const roleError = requireRole(authUser, [Roles.ADMIN, Roles.BLOG_EDITOR]);
    if (roleError) {
      return roleError;
    }

    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = newsSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    const { title, content, image, category } = parsed.data;

    await connectToDatabase();

    const news = await News.create({
      title,
      content,
      image: image || undefined,
      category: category || undefined,
      authorId: authUser.id,
    });

    await logAudit({
      actorId: authUser.id,
      action: "create",
      entityType: "News",
      entityId: news._id.toString(),
      changes: { title },
    });

    return NextResponse.json({ data: normalizeDoc(news) }, { status: 201 });
  } catch (error) {
    return jsonError("Unable to create news.", 500);
  }
}
