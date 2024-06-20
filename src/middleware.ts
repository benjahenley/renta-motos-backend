import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const origin = request.headers.get("origin");

  console.log("problem 1 en middleware");

  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,POST,DELETE",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
    return response;
  }
  console.log("problem 2 en middleware");

  const response = NextResponse.next();

  console.log("problem 3 en middleware");

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,POST,DELETE"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type"
  );

  console.log("success");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
