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
    const jetskisSnap = await collection.get();
    const items = jetskisSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return items;
  }

  static async findJetski() {}

  static async addReservation(reservation: any) {
    const jetskiRef = collection.doc(reservation.data.jetskiId);

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
