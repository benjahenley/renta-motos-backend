import { ReservationInputData } from "@/interfaces/reservation";
import { Jetski } from "@/models/jetski";
import { Reservation } from "@/models/reservation";
import { User } from "@/models/user";

export async function createReservation(data: ReservationInputData) {
  try {
    await Reservation.checkForOverlaps(data);

    const reservationId = await Reservation.createReservation(data);

    return reservationId;
  } catch (e: unknown) {
    throw new Error((e as Error).message);
  }
}

export async function updateReservation(userId: string, reservationId: string) {
  try {
    await Reservation.changeReservationsToApproved(userId, reservationId);

    return true;
  } catch (e: unknown) {
    throw new Error((e as Error).message);
  }
}

export async function getReservationsByDate(date: string) {
  const hit = await Reservation.getByDate(date);
  return hit;
}

export async function getReservationsByUserUid(uid: string) {
  const hit = await Reservation.getByUserUid(uid);
  return hit;
}

export async function getAllReservations() {
  const hits = await Reservation.getAll();
  return hits;
}

export async function getReservationById(reservationId: string) {
  const hits = await Reservation.getById(reservationId);
  return hits;
}

export async function deleteReservation(reservationId: string) {
  await Reservation.removeReservation(reservationId);

  return;
}
