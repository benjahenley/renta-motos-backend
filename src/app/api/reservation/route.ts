import { deleteReservation } from "@/controllers/reservation";
import { authenticateToken } from "@/middlewares/token";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const uid = await authenticateToken(req);

    const { searchParams } = new URL(req.url);
    const reservationId = searchParams.get("id");

    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId is required" },
        { status: 400 }
      );
    }

    await deleteReservation(reservationId);

    return NextResponse.json({
      success: "Successfully removed reservation from database",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
