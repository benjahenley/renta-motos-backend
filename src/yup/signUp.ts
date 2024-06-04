import * as yup from "yup";

export const signUpSchema = yup.object({
  firstName: yup
    .string()
    .min(2, { message: "Name Must be at least 3 characters long" })
    .required(),
  lastName: yup
    .string()
    .min(3, { message: "Name Must be at least 3 characters long" })
    .required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8, { message: "Password Must be at least 8 characters long" })
    .required(),
  uid: yup.string().required(),
});