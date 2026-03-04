import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 🔥 ถ้า login แล้ว ห้ามเข้า /login
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔒 ป้องกันเฉพาะ path ที่ต้อง auth
  const protectedPaths = ["/dashboard", "/admin"];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
