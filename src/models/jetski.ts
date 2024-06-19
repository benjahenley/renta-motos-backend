import { firestore } from "../lib/firestore";

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

  static async getAllJetskis(): Promise<any[]> {
    const jetskisSnap = await collection.get();

    if (jetskisSnap.empty) {
      throw new Error("No Jetskis found");
    }

    const data: any[] = [];
    jetskisSnap.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  }

  static async getAvailableJetskis(): Promise<any[]> {
    const jetskisSnap = await collection.where("available", "==", true).get();

    if (jetskisSnap.empty) {
      throw new Error("No Jetskis found");
    }

    const data: any[] = [];
    jetskisSnap.forEach((doc) => {
      data.push(doc.id);
    });

    return data;
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
      const available = jetskiData!.available;
      await jetskiRef.update({ available: !available });
      return true;
    } catch (error: any) {
      console.error(
        `Error toggling availability for jetski ${jetskiId}:`,
        error
      );
      throw new Error(`Failed to toggle availability: ${error.message}`);
    }
  }

  static async createNewJetski(name: string) {
    try {
      const jetskiRef = collection.doc();
      const data = {
        available: true,
        name,
      };
      return await jetskiRef.set(data);
    } catch (error: any) {
      throw new Error("Error creating new Jetski:", error);
    }
  }
}
