import { firestore } from "../lib/firestore";

import { User } from "./user";
import { ReservationInputData } from "@/interfaces/reservation";
import { Jetski } from "./jetski";
import { getPrice } from "@/helpers/getPrice";

const collection = firestore.collection("reservas");

export class Reservation {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id: any) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }

  static async checkForOverlaps(data: ReservationInputData) {
    try {
      for (const reservation of data.reservations) {
        const jetskiExists = await Jetski.checkIfExists(reservation.jetskiId);

        if (!jetskiExists) {
          throw new Error(
            `Jetski with ID ${reservation.jetskiId} does not exist`
          );
        }

        const overlaps = await collection
          .where("date", "==", reservation.date)
          .where("jetskiId", "==", reservation.jetskiId)
          .get();

        if (!overlaps.empty) {
          overlaps.docs.forEach((doc) => {
            const existing = doc.data();
            const newStart = new Date(reservation.startTime).getTime();
            const newEnd = new Date(reservation.endTime).getTime();
            const existingStart = new Date(existing.startTime).getTime();
            const existingEnd = new Date(existing.endTime).getTime();

            if (newStart < existingEnd && newEnd > existingStart) {
              throw new Error(
                `Reservation time overlaps with an existing reservation on jetski ${reservation.jetskiId}`
              );
            }
          });
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`Error checking for overlaps: ${e.message}`);
        throw e;
      } else {
        console.error("Unknown error occurred during overlap check");
        throw new Error("Unknown error occurred during overlap check");
      }
    }
  }

  static async createReservations(reservationData: ReservationInputData) {
    const batch = firestore.batch();
    const reservationIds: string[] = [];
    const jetskiPromises = [];

    const price = getPrice(reservationData.reservations);

    for (const reservation of reservationData.reservations) {
      const newReservationRef = collection.doc();
      const reservationInstance = new Reservation(newReservationRef.id);

      const name = await User.getFullName(reservationData.userId);

      reservationInstance.data = {
        ...reservation,
        userFullName: name,
        userId: reservationData.userId,
        status: "pending",
      };

      batch.set(newReservationRef, reservationInstance.data);

      reservationIds.push(newReservationRef.id);

      jetskiPromises.push(Jetski.addReservation(reservationInstance));
    }

    await batch.commit();

    await Promise.all(jetskiPromises);

    await User.addReservations(reservationData.userId, reservationIds);

    console.log("Successfully added reservations!", reservationIds);

    return { reservationIds, price };
  }

  static async changeReservationsToApproved(reservationIds: string[]) {
    const batch = firestore.batch();

    for (const reservationId of reservationIds) {
      const reservationRef = collection.doc(reservationId);
      batch.update(reservationRef, { status: "approved" });
    }

    await batch.commit();
  }

  static async findReservations(reservationIds: string[]) {
    try {
      var reservations: object[] = [];

      for (const reservationId of reservationIds) {
        const reservationData = await collection.doc(reservationId).get();
        const data = reservationData!.data();

        reservations.push(data!);
      }

      return reservations;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async getByDate(date: string) {
    const reservations = collection.where("date", "==", date);
    const reservationData = await reservations.get();

    const items = reservationData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return items;
  }

  static async getAll() {
    const snapshot = await collection.get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    const reservations = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return reservations;
  }
  static async removeReservation(reservationId: string) {
    try {
      const reservationDocRef = collection.doc(reservationId);
      const reservationDoc = await reservationDocRef.get();

      if (!reservationDoc.exists) {
        throw new Error("Reservation not found");
      }

      await reservationDocRef.delete();
      console.log(`Reservation ${reservationId} deleted successfully`);
      return;
    } catch (error) {
      console.error("Error deleting reservation:", error);
      throw new Error("Error deleting reservation");
    }
  }
}
