import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

let bodySchema = yup.object().strict().shape({
  email: yup.string().email().required(),
  code: yup.number().strict().required(),
});

export function yupTokenMiddleware(callback: any) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const validity = await bodySchema.isValid(req.body);
    if (validity) {
      callback(req, res);
    } else {
      throw res.status(400).json({
        message:
          "missing elements in the body of your request. you must enter an email and a code to continue. your code must be a in a number format, not a string",
      });
    }
  };
}
