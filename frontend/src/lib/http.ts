import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export async function parseJson<T>(req: Request) {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function zodErrorToMessage(error: ZodError) {
  const issues = Array.isArray(error?.errors) ? error.errors : [];
  return issues.map((issue) => issue.message).join(", ");
}
