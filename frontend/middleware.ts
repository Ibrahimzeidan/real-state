import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(req: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
