import * as yup from "yup";

export const jetskiSchema = yup.object({
  jetskiId: yup.string().required(),
  // available: yup.boolean().required(),
});
export const patchJetskiSchema = yup.object({
  jetskiId: yup.string().required(),
  status: yup.boolean().required(),
});
