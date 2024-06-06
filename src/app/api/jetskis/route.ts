import { getAllJetskis } from "@/controllers/jetskis";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const jetskis = await getAllJetskis();
    return NextResponse.json({ jetskis });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
