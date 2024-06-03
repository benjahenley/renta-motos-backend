import {
  deleteReservation,
  getReservationsByDate,
} from "@/controllers/reservation";
import { reservationsByDateSchema } from "@/yup/reservation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get("id");
    console.log(reservationId);

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
