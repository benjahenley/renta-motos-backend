import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

let bodySchema = yup.object().shape({
  email: yup.string().email().required(),
});

export function yupAuthMiddleware(callback: any) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const validity = await bodySchema.isValid(req.body);
    if (!validity) {
      throw res.status(400).send({
        message: "missing elements in the body. a mail must be provided",
      });
    } else {
      callback(req, res);
    }
  };
}
