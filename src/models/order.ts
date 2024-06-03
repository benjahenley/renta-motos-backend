import { getOneHourExpirationDate } from "@/helpers/getDate";
import { firestore } from "../lib/firestore";
import { OrderProps } from "@/interfaces/order";
import { User } from "./user";

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
    const order = new Order(newOrderSnap.id);
    order.pull();

    return order;
  }

  static async createOrderWithReservations({
    userId,
    reservationIds,
    price,
    adults,
    expirationDate,
  }: OrderProps) {
    const orderObject = {
      reservations: reservationIds,
      price,
      adults,
      userId,
      expirationDate,
      status: "pending",
    };

    const orderRef = await collection.add(orderObject);
    await User.appendOrder(orderRef.id, userId);

    return orderRef.id;
  }
}
