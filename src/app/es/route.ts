import { NextRequest, NextResponse } from "next/server";

/** 308 Permanent Redirect: /es и /es/ → / (fallback когда middleware не срабатывает, напр. локально) */
export function GET(request: NextRequest) {
  const url = new URL("/", request.url);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 308);
}
