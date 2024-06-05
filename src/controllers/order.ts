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

export async function updateOrderAndReservations(
  orderId: string,
  userId: string
) {
  const reservationIds = await Order.changeStatusToApproved(orderId, userId);

  const reservation =
    await Reservation.changeReservationsToApproved(reservationIds);

  return;
}
