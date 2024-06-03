import { OrderProps } from "@/interfaces/order";
import { Order } from "@/models/order";
import { User } from "@/models/user";

export async function createOrder(data: OrderProps) {
  const orderId = await Order.createOrderWithReservations(data);

  return orderId;
}

export async function getOrderById(orderId: string) {
  const order = new Order(orderId);
  await order.pull();

  return order.data;
}
