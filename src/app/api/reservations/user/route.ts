import { getReservationsByUserUid } from "@/controllers/reservation";
import { authenticateToken } from "@/middlewares/token";
import { reservationsByUidSchema } from "@/yup/reservation";
import { NextRequest, NextResponse } from "next/server";

//GET RESERVATIONS BY UID
export async function GET(req: NextRequest) {
  try {
    const uid = await authenticateToken(req);
    console.log(uid);

    if (!uid) {
      return NextResponse.json({ error: "No uid found" }, { status: 400 });
    }

    await reservationsByUidSchema.validate({ uid });

    const reservations = await getReservationsByUserUid(uid);

    return NextResponse.json({ reservations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
