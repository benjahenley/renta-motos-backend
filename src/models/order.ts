import { firestore } from "../lib/firestore";

type Estado = "pago" | "pendiente";

const collection = firestore.collection("orders");
export class Order {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  initPoint: any;
  state: Estado;
  constructor(id: any) {
    this.state = "pendiente";
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
  static async createNewOrder(data: any) {
    const newOrderSnap = await collection.add(data);
    const order = await new Order(newOrderSnap.id);
    order.data = data;
    return order;
  }

  async addInitPoint(initPoint: string) {
    const updated = await this.ref.update({ initPoint });
    this.initPoint = initPoint;
    return true;
  }

  async confirmPayment(orderId: any) {
    this.state = "pago";
    await this.ref.update({ state: "pago" });
    return true;
  }

  async getDbOrder(id: string) {
    const order = await collection.doc(id);
  }

  static async getAll(id: string) {
    let hits: Array<any> = [];

    const orders = await collection.where("userId", "==", id);
    const orderData = await orders.get();

    orderData.forEach((doc) => {
      hits.push(doc.data());
    });

    return hits;
  }
}
