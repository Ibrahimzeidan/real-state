import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { getAdminEmail, getAdminPassword } from "@/lib/admin-auth";
import { updateEnvFile } from "@/lib/env-file";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { Roles } from "@/lib/permissions";
import { adminCredentialsUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await requireAuth(req);
    if (!authUser) {
      return jsonError("Unauthorized.", 401);
    }

    if (authUser.role !== Roles.ADMIN) {
      return jsonError("Forbidden.", 403);
    }

    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = adminCredentialsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    const currentEmail = getAdminEmail();
    const currentPassword = getAdminPassword();

    if (!secureCompare(parsed.data.currentPassword, currentPassword)) {
      return jsonError("Current password is incorrect.", 401);
    }

    const nextEmail = parsed.data.email ?? currentEmail;
    const nextPassword = parsed.data.password ?? currentPassword;

    if (nextEmail === currentEmail && nextPassword === currentPassword) {
      return jsonError("No credential changes were provided.", 400);
    }

    const envPath = await updateEnvFile({
      ADMIN_EMAIL: nextEmail,
      ADMIN_PASSWORD: nextPassword,
    });

    process.env.ADMIN_EMAIL = nextEmail;
    process.env.ADMIN_PASSWORD = nextPassword;
    process.env.STATIC_ADMIN_EMAIL = nextEmail;
    process.env.STATIC_ADMIN_PASSWORD = nextPassword;

    return NextResponse.json({
      data: {
        email: nextEmail,
        envPath,
        restartRecommended: true,
      },
      message: "Admin credentials updated. Restart the frontend server if the new login does not work immediately in another browser.",
    });
  } catch {
    return jsonError("Unable to update admin credentials.", 500);
  }
}
