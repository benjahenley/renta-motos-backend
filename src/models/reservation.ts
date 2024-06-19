import { firestore } from "../lib/firestore";

import { User } from "./user";
import { ReservationInputData, Status } from "@/interfaces/reservation";
import { Jetski } from "./jetski";
import { getPrice } from "@/helpers/getPrice";
import add30Minutes from "@/helpers/add30Minutes";

const collection = firestore.collection("reservations");

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

  static async checkForOverlaps(data: ReservationInputData): Promise<boolean> {
    const { date, startTime, endTime, excursion, excursionName, adults } = data;

    try {
      const availableJetskis: any = await Jetski.getAvailableJetskis();
      const instances = await collection.where("date", "==", date).get();

      if (instances.empty) {
        return true;
      }

      const timeSlotsMap: { [key: string]: number } = {};
      const guideMap: { [key: string]: Set<string> } = {};

      instances.docs.forEach((doc) => {
        const docData = doc.data();
        const docStartTime = docData.startTime;
        const docEndTime = docData.endTime;
        const docExcursion = docData.excursion;
        const docExcursionName = docData.excursionName;

        // Check for jetski overlaps
        let time = docStartTime;
        while (time < docEndTime) {
          if (!timeSlotsMap[time]) {
            timeSlotsMap[time] = 0;
          }
          timeSlotsMap[time]++;
          time = add30Minutes(time);
        }

        // Check for guide overlaps
        if (excursion && docExcursion) {
          let time = docStartTime;
          while (time < docEndTime) {
            if (!guideMap[time]) {
              guideMap[time] = new Set();
            }
            guideMap[time].add(docExcursionName);
            time = add30Minutes(time);
          }
        }
      });

      let checkTime = startTime;
      while (checkTime < endTime) {
        if (timeSlotsMap[checkTime] + adults > availableJetskis) {
          throw new Error(
            `Reservation time overlaps with existing reservations, exceeding available jetskis`
          );
        }

        if (
          excursion &&
          guideMap[checkTime] &&
          !guideMap[checkTime].has(excursionName!) &&
          guideMap[checkTime].size >= 2
        ) {
          throw new Error(
            `Reservation time overlaps with existing excursions, exceeding available guides`
          );
        }

        checkTime = add30Minutes(checkTime);
      }

      return true;
    } catch (e: any) {
      console.error("Error checking for overlaps:", e);
      throw new Error(e.message);
    }
  }

  static async getById(reservationId: string) {
    const reservationRef = collection.doc(reservationId);
    const reservationSnap = await reservationRef.get();
    return reservationSnap.data();
  }

  static async changeStatus(
    reservationId: string,
    uid: string,
    status: Status
  ) {
    const reservationRef = collection.doc(reservationId);

    try {
      const reservationSnap = await reservationRef.get();
      if (!reservationSnap.exists) {
        throw new Error("Reservation not found");
      }

      const reservationData = reservationSnap.data();
      if (!reservationData) {
        throw new Error("Failed to retrieve reservation data");
      }

      const expirationDate = reservationData.expirationDate;
      if (!expirationDate) {
        throw new Error("Expiration date not set for the reservation");
      }

      if (status === "approved") {
        const currentDate = new Date();
        if (new Date(expirationDate) < currentDate) {
          throw new Error("Reservation has expired");
        }
      }

      if (reservationData.userId !== uid) {
        throw new Error("User ID does not match");
      }

      // Update the reservation with approved status
      await reservationRef.update({
        status,
      });

      const updatedReservationSnap = await reservationRef.get();
      return updatedReservationSnap.data();
    } catch (error: any) {
      console.error("Error updating reservation status:", error);
      throw new Error(error.message);
    }
  }

  static async addTransactionId(reservationId: string, transactionId: string) {
    const reservationRef = collection.doc(reservationId);

    try {
      const reservationSnap = await reservationRef.get();
      if (!reservationSnap.exists) {
        throw new Error("Reservation not found");
      }

      // Update the reservation with transactionId
      await reservationRef.update({
        transactionId: transactionId,
      });

      const updatedReservationSnap = await reservationRef.get();
      return updatedReservationSnap.data();
    } catch (error) {
      console.error("Error updating reservation with transaction ID:", error);
      throw new Error("Unable to update reservation with transaction ID");
    }
  }

  static async createReservation(reservationData: ReservationInputData) {
    try {
      const newReservationRef = collection.doc();
      const userFullName = await User.getFullName(reservationData.userId);
      const price = getPrice(reservationData);

      const reservationDataToSave = {
        ...reservationData,
        price,
        userFullName,
        status: "pending",
      };

      await newReservationRef.set(reservationDataToSave);

      return newReservationRef.id;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw new Error("Unable to create reservation");
    }
  }

  static async getByDate(date: string) {
    const reservations = collection.where("date", "==", date);
    const reservationData = await reservations.get();

    const items = reservationData.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        excursion: data.excursion,
        excursionName: data.excursionName,
        data: data.date,
        adults: data.adults,
        startTime: data.startTime,
        endTime: data.endTime,
        expirationDate: data.expirationDate,
        status: data.status,
      };
    });

    return items;
  }

  static async getByUserUid(uid: string) {
    console.log({ uid });
    const reservations = collection.where("userId", "==", uid);
    const reservationData = await reservations.get();

    const items = reservationData.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date,
        adults: data.adults,
        startTime: data.startTime,
        endTime: data.endTime,
        excursionName: data.excursionName,
        userFullName: data.userFullName,
        price: data.price,
        expirationDate: data.expirationDate,
        status: data.status,
      };
    });

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
