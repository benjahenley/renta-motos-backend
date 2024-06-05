import { getUserOrders } from "@/controllers/order";
import { authenticateToken } from "@/middlewares/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const uid = await authenticateToken(request);

    const orders = await getUserOrders(uid);

    return NextResponse.json({ orders });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
