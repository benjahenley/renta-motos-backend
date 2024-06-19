import { getAvailableJetskis } from "@/controllers/jetskis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jetskis = await getAvailableJetskis();
    return NextResponse.json(jetskis);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
