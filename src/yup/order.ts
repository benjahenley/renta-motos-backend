import * as yup from "yup";

export const orderUpdateSchema = yup.object({
  orderId: yup.string().required(),
});
