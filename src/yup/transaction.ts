import * as yup from "yup";

export const transactionSchema = yup.object({
  transactionId: yup.string().required(),
  orderId: yup.string().required(),
});
