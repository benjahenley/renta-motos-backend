import { Reservation } from "@/models/reservation";
import { Transaction } from "@/models/transaction";

export async function createTransaction(
  reservationId: string,
  transactionId: string
) {
  await Transaction.createTransaction(reservationId, transactionId);
  await Reservation.addTransactionId(reservationId, transactionId);

  return { ok: true };
}
