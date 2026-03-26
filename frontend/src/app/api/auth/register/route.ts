import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { signAccessToken, setAuthCookie } from "@/lib/auth";
import { getAdminEmail } from "@/lib/admin-auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson, zodErrorToMessage } from "@/lib/http";
import { Roles } from "@/lib/permissions";
import { registerSchema } from "@/lib/validation";
import { User } from "@/models/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(zodErrorToMessage(parsed.error), 400);
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail === getAdminEmail()) {
      return jsonError("This email is reserved.", 409);
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return jsonError("Email already registered.", 409);
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: Roles.VIEWER,
    });

    const token = signAccessToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );

    setAuthCookie(response, token);
    return response;
  } catch {
    return jsonError("Unable to register user.", 500);
  }
}
