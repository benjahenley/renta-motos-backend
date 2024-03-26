import { Order } from "@/models/order";

export async function updateOrderStatus(orderId: string) {
  const getDbOrder = new Order(orderId);
  await getDbOrder.pull();
  getDbOrder.data.state = "cerrado";
  await getDbOrder.push();
  return true;
}
