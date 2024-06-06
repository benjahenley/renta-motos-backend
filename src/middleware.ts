import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = ["http://localhost:3000"];

  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
  }

  console.log("Middleware activated");

  if (request.method === "OPTIONS") {
    return response;
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
