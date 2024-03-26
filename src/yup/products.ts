import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

let querySchema = yup.object().shape({
  q: yup.string().required(),
  offset: yup.string(),
  limit: yup.string().required().strict(),
});

export function productsYupMiddleware(callback: any) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);
      callback(req, res);
    } catch (error: any) {
      return res.status(400).send({
        message: "missing or invalid parameters in query",
        error: error.message,
      });
    }
  };
}
