import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_ID } from "@/lib/admin-auth";
import { Roles } from "@/lib/permissions";

const PUBLIC_ROUTES = ["/login", "/register"];
const ADMIN_ALIAS_ROUTE = "/admin";
const ADMIN_DASHBOARD_ROUTE = "/admin-dashboard";

type JwtPayload = {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
};

function toBase64(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  return `${normalized}${padding ? "=".repeat(4 - padding) : ""}`;
}

function decodeBase64Url(value: string) {
  return atob(toBase64(value));
}

function decodeBase64UrlBytes(value: string) {
  const decoded = decodeBase64Url(value);
  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}

function parseSegment<T>(value: string): T | null {
  try {
    return JSON.parse(decodeBase64Url(value)) as T;
  } catch {
    return null;
  }
}

async function verifyJwt(token: string): Promise<JwtPayload | null> {
  const [headerSegment, payloadSegment, signatureSegment] = token.split(".");
  if (!headerSegment || !payloadSegment || !signatureSegment) {
    return null;
  }

  const header = parseSegment<{ alg?: string; typ?: string }>(headerSegment);
  if (!header || header.alg !== "HS256") {
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    decodeBase64UrlBytes(signatureSegment),
    new TextEncoder().encode(`${headerSegment}.${payloadSegment}`),
  );

  if (!isValid) {
    return null;
  }

  const payload = parseSegment<JwtPayload>(payloadSegment);
  if (!payload) {
    return null;
  }

  if (typeof payload.exp === "number" && payload.exp <= Date.now() / 1000) {
    return null;
  }

  return payload;
}

async function isAdminToken(token: string) {
  const payload = await verifyJwt(token);
  if (!payload) {
    return false;
  }

  return payload.sub === ADMIN_ID && payload.role === Roles.ADMIN;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === ADMIN_ALIAS_ROUTE || pathname.startsWith(`${ADMIN_ALIAS_ROUTE}/`)) {
    const isAdmin = await isAdminToken(token);
    if (!isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }

    const url = req.nextUrl.clone();
    const suffix = pathname.slice(ADMIN_ALIAS_ROUTE.length);
    url.pathname = `${ADMIN_DASHBOARD_ROUTE}${suffix || ""}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
