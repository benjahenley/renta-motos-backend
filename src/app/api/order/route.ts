import {
  createOrder,
  getOrderById,
  updateOrderAndReservations,
} from "@/controllers/order";
import { createReservations } from "@/controllers/reservation";
import { getOneHourExpirationDate } from "@/helpers/getDate";
import { authenticateToken } from "@/middlewares/token";
import { orderUpdateSchema } from "@/yup/order";
import { mainReservationSchema } from "@/yup/reservation";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

function handleError(e: unknown) {
  if (e instanceof yup.ValidationError) {
    const errors = e.inner.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    return NextResponse.json({ errors }, { status: 400 });
  }
  return NextResponse.json({ error: (e as Error).message }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateToken(request);
    const { reservations, adults } = await mainReservationSchema.validate(
      await request.json(),
      {
        abortEarly: false,
      }
    );

    const expirationDate = getOneHourExpirationDate();
    console.log("hola");

    const { reservationIds, price } = await createReservations({
      userId,
      reservations,
    });

    console.log(reservationIds, price);

    const orderId = await createOrder({
      userId,
      price,
      reservationIds,
      adults,
      expirationDate,
    });

    return NextResponse.json({ orderId });
  } catch (e: unknown) {
    return handleError(e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await authenticateToken(request);

    var { orderId } = await orderUpdateSchema.validate(await request.json(), {
      abortEarly: false,
    });

    const order = await updateOrderAndReservations(orderId, userId);

    return NextResponse.json({ message: "Success! Order has been approved" });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await authenticateToken(req);

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    const order = await getOrderById(orderId!);

    return NextResponse.json({ order });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
