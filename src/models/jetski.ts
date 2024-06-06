import { firestore } from "../lib/firestore";
import {
  ReservationData,
  ReservationInputData,
} from "@/interfaces/reservation";

const collection = firestore.collection("jetskis");

export class Jetski {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id: any) {
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }

  static async getJetskis() {
    const jetskisSnap = await collection.where("available", "==", true).get();
    const items = jetskisSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return items;
  }

  static async checkIfExists(jetskiId: string) {
    const jetskisSnap = await collection.doc(jetskiId).get();

    if (!jetskisSnap.exists) {
      throw new Error(
        `Jetski with id ${jetskiId} does not exist on the database`
      );
    }

    return true;
  }

  static async toggleAvailable(jetskiId: string) {
    try {
      const jetskiRef = collection.doc(jetskiId);
      const jetskiDoc = await jetskiRef.get();

      if (!jetskiDoc.exists) {
        throw new Error(`Jetski with ID ${jetskiId} does not exist`);
      }

      const jetskiData = jetskiDoc.data();
      const currentAvailability = jetskiData!.available;

      const updatedAvailability = !currentAvailability;

      await jetskiRef.update({ available: updatedAvailability });

      const jetskiInstance = new Jetski(jetskiId);
      await jetskiInstance.pull();
      jetskiInstance.data.available = updatedAvailability;
      await jetskiInstance.push();

      return jetskiInstance.data;
    } catch (error: any) {
      console.error(
        `Error toggling availability for jetski ${jetskiId}:`,
        error
      );
      throw new Error(`Failed to toggle availability: ${error.message}`);
    }
  }

  static async addReservation(reservation: any) {
    const jetskiRef = collection.doc(reservation.data.jetskiId);
    if (!jetskiRef) {
      throw new Error("there is no Jetski with that ID");
    }

    const jetski = new Jetski(jetskiRef.id);
    await jetski.pull();

    if (!jetski.data.reservations) {
      jetski.data.reservations = [];
    }

    jetski.data.reservations.push(reservation.id);

    await jetski.push();
    return;
  }
}
