import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigins[0],
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (
    request.method === "OPTIONS" &&
    origin &&
    allowedOrigins.includes(origin)
  ) {
    return NextResponse.next({
      headers: corsHeaders,
    });
  }

  const response = NextResponse.next();
  if (origin && allowedOrigins.includes(origin)) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
