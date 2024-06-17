import { toggleAvailable } from "@/controllers/jetskis";
import { authenticateToken } from "@/middlewares/token";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    console.log("Request received at API endpoint");
    await authenticateToken(req);

    const { jetskiId } = await req.json();
    console.log("Jetski ID:", jetskiId);

    const jetskis = await toggleAvailable(jetskiId);
    const response = NextResponse.json({ jetskis });

    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3000"
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,POST"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
    return response;
  } catch (e: unknown) {
    console.log("Error:", (e as Error).message);
    const response = NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );

    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3000"
    );

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,POST"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
    return response;
  }
}
