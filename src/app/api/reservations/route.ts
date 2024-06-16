import { getReservationsByDate } from "@/controllers/reservation";
import { reservationsByDateSchema } from "@/yup/reservation";
import { NextRequest, NextResponse } from "next/server";

function parseDate(dateString: string) {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

//GET RESERVATIONS BY DATE
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    console.log(date);

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    await reservationsByDateSchema.validate({ date });

    const reservations = await getReservationsByDate(date);

    return NextResponse.json({ reservations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
