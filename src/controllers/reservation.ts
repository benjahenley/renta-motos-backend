import { ReservationInputData } from "@/interfaces/reservation";
import { Jetski } from "@/models/jetski";
import { Order } from "@/models/order";
import { Reservation } from "@/models/reservation";
import { User } from "@/models/user";

export async function createReservations(data: ReservationInputData) {
  try {
    await Reservation.checkForOverlaps(data);
    const reservationIds = await Reservation.createReservations(data);
    return reservationIds;
  } catch (e: unknown) {
    throw new Error((e as Error).message);
  }
}

export async function getReservationsByDate(date: string) {
  const hit = await Reservation.getByDate(date);
  return hit;
}

export async function getAllReservations() {
  const hits = await Reservation.getAll();
  return hits;
}

export async function deleteReservation(reservationId: string) {
  await Reservation.removeReservation(reservationId);

  return;
}
