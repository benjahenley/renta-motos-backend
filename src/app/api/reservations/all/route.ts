import { getAllReservations } from "@/controllers/reservation";
import { authenticateToken } from "@/middlewares/token";
import { reservationsByDateSchema } from "@/yup/reservation";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const reservations = await getAllReservations();

    return NextResponse.json({ reservations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
