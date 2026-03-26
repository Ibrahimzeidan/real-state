import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { signAccessToken, setAuthCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { jsonError, parseJson } from "@/lib/http";
import { loginSchema } from "@/lib/validation";
import { User } from "@/models/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await parseJson<unknown>(req);
    if (!body) {
      return jsonError("Invalid JSON payload.");
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Invalid email or password.", 400);
    }

    const { email, password } = parsed.data;

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return jsonError("Invalid email or password.", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return jsonError("Invalid email or password.", 401);
    }

    const token = signAccessToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return jsonError("Unable to login.", 500);
  }
}
