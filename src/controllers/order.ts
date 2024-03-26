import { createPreference } from "@/lib/mercadopago";
import { Order } from "@/models/order";
import { Product } from "@/models/products";

export async function handleOrder(
  userId: string,
  productId: any,
  productData: object
) {
  const product: any = await Product.checkProduct(productId);
  if (!product) {
    throw new Error("product does not exist");
  }

  const order = await Order.createNewOrder({
    productId,
    productData,
    state: "pending",
    userId,
  });

  if (!order.id) {
    throw new Error("failed to create order");
  }

  console.log("Order with id:" + order.id + " was created");

  const preference = await createPreference({
    items: [
      {
        title: product.fields.Name,
        description: product.fields.Description.substring(0, 256),
        picture_url: "http://www.myapp.com/myimage.jpg",
        category_id: "car_electronics",
        quantity: 1,
        currency_id: "ARS",
        unit_price: product.fields["Unit cost"],
      },
    ],
    back_urls: {
      success: "https://www.google.com.ar",
      pending: "https://www.google.com.ar",
    },
    external_reference: order.id,
    notification_url: `https://dwf-m9-desafio-final-eight.vercel.app/api/ipn/mercadopago`,
  });

  console.log("preference with id: " + preference.body.id + " was created");

  order.initPoint = preference.body.init_point;
  await order.push();

  return order;
}

export async function getMyOrders(userId: string) {
  const orders = await Order.getAll(userId);

  return orders;
}

export async function getOrderById(orderId: string) {
  const order = new Order(orderId);
  await order.pull();

  return order.data;
}
