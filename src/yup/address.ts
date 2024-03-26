import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

let bodySchema = yup.object().strict().shape({
  address: yup.string().strict().required(),
});

export function yupAddressMiddleware(callback: any) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse,
    token: any
  ) {
    const validity = await bodySchema.isValid(req.body);
    if (validity) {
      callback(req, res, token);
    } else {
      throw res.status(400).json({
        message: "missing address",
      });
    }
  };
}
