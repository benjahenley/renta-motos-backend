import { OrderProps } from "@/interfaces/order";
import { Order } from "@/models/order";
import { Reservation } from "@/models/reservation";

export async function createOrder(data: OrderProps) {
  const orderId = await Order.createOrderWithReservations(data);
  return orderId;
}

export async function getOrderById(orderId: string) {
  const order = new Order(orderId);
  await order.pull();

  return order.data;
}

export async function getUserOrders(uid: string) {
  const orders = await Order.findUserOrders(uid);

  return orders;
}

export async function updateOrderAndReservations(
  orderId: string,
  userId: string
) {
  const reservationIds = await Order.changeStatusToApproved(orderId, userId);

  const reservation =
    await Reservation.changeReservationsToApproved(reservationIds);

  return;
}

export async function updateOrderTransactionId(
  orderId: string,
  userUid: string,
  transactionId: string
) {
  try {
    await Order.updateTransactionId(orderId, userUid, transactionId);
    // await Transaction

    return { ok: true };
  } catch (e: any) {
    throw new Error(e.message);
  }
}
