import { getAllReservations } from "@/controllers/reservation";
import { verifyUserRole } from "@/controllers/user";
import { authenticateToken } from "@/middlewares/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const uid = await authenticateToken(req);

    const isAuthorized = await verifyUserRole(uid);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "User does not have permission to access this site" },
        { status: 500 }
      );
    }

    const reservations = await getAllReservations();

    return NextResponse.json({ reservations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
