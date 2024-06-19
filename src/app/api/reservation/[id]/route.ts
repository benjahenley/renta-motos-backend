import { changeStatus, getReservationById } from "@/controllers/reservation";
import { authenticateToken } from "@/middlewares/token";
import { patchReservationSchema } from "@/yup/reservation";
import { NextRequest, NextResponse } from "next/server";

// GET RESERVATION
export async function GET(request: NextRequest) {
  try {
    await authenticateToken(request);

    const url = new URL(request.url);
    const reservationId = url.pathname.split("/").pop();

    const reservation = await getReservationById(reservationId!);

    return NextResponse.json(reservation);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// UPDATE RESERVATION STATUS
export async function PATCH(request: NextRequest) {
  try {
    const uid = await authenticateToken(request);

    const url = new URL(request.url);
    const reservationId = url.pathname.split("/").pop();
    const { status } = await patchReservationSchema.validate(
      await request.json()
    );

    await changeStatus(reservationId!, uid, status);

    return NextResponse.json(
      `Reservation with ID:${reservationId} with status modified to ${status} successfully`
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
