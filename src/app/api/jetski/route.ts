import { createNewJetski, toggleAvailable } from "@/controllers/jetskis";
import { authenticateToken } from "@/middlewares/token";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await authenticateToken(req);

    const { jetskiId } = await req.json();
    console.log(jetskiId);

    const jetskis = await toggleAvailable(jetskiId);
    const response = NextResponse.json({ jetskis });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,POST"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );

    return response;
  } catch (e: any) {
    console.log("Error:", e.message);
    const response = NextResponse.json({ error: e.message }, { status: 500 });

    response.headers.set("Access-Control-Allow-Origin", "*");
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

export function OPTIONS() {
  const response = new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,POST",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
  return response;
}
// Create new JETSKI
export async function POST(req: NextRequest) {
  try {
    await authenticateToken(req);

    const { name } = await req.json();

    const jetski = await createNewJetski(name);
    const response = NextResponse.json({ jetski });

    response.headers.set("Access-Control-Allow-Origin", "*");
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

    response.headers.set("Access-Control-Allow-Origin", "*");

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
