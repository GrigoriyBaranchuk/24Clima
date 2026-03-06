import { NextRequest, NextResponse } from "next/server";

/** 308 Permanent Redirect: /es/:path* → /:path* (fallback когда middleware не срабатывает) */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.length ? `/${path.join("/")}/` : "/";
  const url = new URL(pathStr, request.url);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 308);
}
