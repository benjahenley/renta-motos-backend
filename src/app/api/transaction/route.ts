import { createTransaction } from "@/controllers/transaction";
import { authenticateToken } from "@/middlewares/token";
import { transactionSchema } from "@/yup/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const uid = await authenticateToken(req);

    const { reservationId, transactionId } = await transactionSchema.validate(
      await req.json()
    );

    await createTransaction(reservationId, transactionId);

    return NextResponse.json({ success: "Reservation has been updated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
