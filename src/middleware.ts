import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = ["http://localhost:3000"];
  console.log(`Origin: ${origin}`);

  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":
          origin && allowedOrigins.includes(origin) ? origin : "",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,POST,DELETE",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
    console.log("Handling preflight request");
    return response;
  }

  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    console.log("Setting CORS headers");
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,POST,DELETE"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
