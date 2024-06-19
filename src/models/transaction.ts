import { firestore } from "../lib/firestore";

const collection = firestore.collection("transactions");

export class Transaction {
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

  static async createTransaction(transactionId: string, reservationId: string) {
    const instance = collection.doc();
    const transactionSnap = new Transaction(instance.id);

    transactionSnap.data = {
      id: transactionId,
      reservationId: reservationId,
      createdAt: new Date().toISOString(),
    };

    try {
      await instance.set(transactionSnap.data);
      return transactionSnap.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new Error("Unable to create transaction");
    }
  }
}
