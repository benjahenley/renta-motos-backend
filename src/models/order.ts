import { getOneHourExpirationDate } from "@/helpers/getDate";
import { firestore } from "../lib/firestore";
import { OrderProps } from "@/interfaces/order";
import { User } from "./user";
import { Reservation } from "./reservation";

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
    await order.pull();

    return order;
  }

  static async findUserOrders(uid: string) {
    const ordersRef = await collection.where("userId", "==", uid).get();
    const orderData = [];

    for (const doc of ordersRef.docs) {
      const data = doc.data();
      const reservations = data.reservations;
      const reservationsData = await Reservation.findReservations(reservations);
      data.reservations = reservationsData;

      orderData.push(data);
    }

    return orderData;
  }

  static async changeStatusToApproved(orderId: string, userId: string) {
    const newOrderSnap = collection.doc(orderId);
    const orderSnap = await newOrderSnap.get();

    if (!orderSnap.exists) {
      throw new Error(`Order with id ${orderId} does not exist}`);
    }

    const order = new Order(newOrderSnap.id);
    await order.pull();

    if (order.data.userId !== userId) {
      throw new Error("User is not allowed to access this order");
    }

    order.data.status = "approved";
    await order.push();

    return order.data.reservations;
  }

  static async updateTransactionId(
    orderId: string,
    userUid: string,
    transactionId: string
  ) {
    const newOrderSnap = collection.doc(orderId);
    const orderSnap = await newOrderSnap.get();

    if (!orderSnap.exists) {
      throw new Error(`Order with id ${orderId} does not exist}`);
    }

    const order = new Order(newOrderSnap.id);
    await order.pull();

    // if (!order.data.transactionId) {
    //   order.data.transactionId = transactionId;
    // }

    if (order.data.userId !== userUid) {
      throw new Error(
        `User with id ${userUid} is not allowed to access this data}`
      );
    }

    order.data.transactionId = transactionId;

    await order.push();

    return order.data;
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
