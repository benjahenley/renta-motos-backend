import { createOrder } from "@/controllers/order";
import { createReservations } from "@/controllers/reservation";
import { getOneHourExpirationDate } from "@/helpers/getDate";
import { authenticateToken } from "@/middlewares/token";
import { mainReservationSchema } from "@/yup/reservation";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateToken(request);

    var { reservations, price, adults } = await mainReservationSchema.validate(
      await request.json(),
      {
        abortEarly: false,
      }
    );

    const expirationDate = getOneHourExpirationDate();

    const reservationIds = await createReservations({
      userId,
      reservations,
    });

    const orderId = await createOrder({
      userId,
      reservationIds,
      price,
      adults,
      expirationDate,
    });

    return NextResponse.json({ orderId });
  } catch (e: unknown) {
    if (e instanceof yup.ValidationError) {
      const errors = e.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
