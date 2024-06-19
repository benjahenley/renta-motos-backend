import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,POST,DELETE",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
    console.log("Handling preflight request");
    return response;
  }

  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,POST,DELETE"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type"
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
