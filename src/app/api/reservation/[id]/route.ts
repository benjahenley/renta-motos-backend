import { getReservationById } from "@/controllers/reservation";
import { authenticateToken } from "@/middlewares/token";
import { NextRequest, NextResponse } from "next/server";

// CREATE RESERVATION
export async function GET(request: NextRequest) {
  try {
    await authenticateToken(request);

    const url = new URL(request.url);
    const reservationId = url.pathname.split("/").pop();
    console.log(reservationId);

    const reservation = await getReservationById(reservationId!);

    return NextResponse.json(reservation);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
