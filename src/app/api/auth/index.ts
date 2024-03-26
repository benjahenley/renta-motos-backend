import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controllers/auth";
import methods from "micro-method-router";
import { yupAuthMiddleware } from "yup/auth";
import corsMiddleware from "../cors-middleware";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const auth = await sendCode(req.body.email);
    res.send(auth);
  } catch (e: any) {
    res.status(400).send({ message: e });
  }
}
const yupHandler = yupAuthMiddleware(postHandler);

const handler: any = methods({
  post: yupHandler,
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, handler);
};

export default corsHandler;
