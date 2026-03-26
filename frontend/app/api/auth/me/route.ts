import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    if (!authUser) {
      return jsonError("Unauthorized.", 401);
    }

    return NextResponse.json({
      user: {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
      },
    });
  } catch (error) {
    return jsonError("Unable to fetch user.", 500);
  }
}
