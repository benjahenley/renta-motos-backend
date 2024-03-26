import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

export async function createPreference(data = {}) {
  const res = await mercadopago.preferences.create(data);
  return res;
}

export async function getMerchantOrder(id: any) {
  try {
    const res = await mercadopago.merchant_orders.get(id);
    console.log({ res });
    return res.body;
  } catch (e: any) {
    console.log(e.message, 11111);
    throw new Error(e.message);
  }
}
