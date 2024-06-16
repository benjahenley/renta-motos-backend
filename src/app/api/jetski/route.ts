import { toggleAvailable } from "@/controllers/jetskis";
import { authenticateToken } from "@/middlewares/token";
import { jetskiSchema } from "@/yup/jetski";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await authenticateToken(req);
    console.log(req);

    const { jetskiId } = await req.json();

    const jetskis = await toggleAvailable(jetskiId);
    return NextResponse.json({ jetskis });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
