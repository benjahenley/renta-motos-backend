import * as yup from "yup";

export const userRoleSchema = yup.object({
  token: yup.string().required(),
});
