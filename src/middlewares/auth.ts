import { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { decode } from "./jwt";

export function authMiddleware(callback: any) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = parseToken(req);
    if (!token) {
      return res.status(401).send({ message: "no hay token" });
    }
    const decodedToken = decode(token);
    if (decodedToken) {
      callback(req, res, decodedToken);
    } else {
      return res.status(401).send({ message: "token incorrecto" });
    }
  };
}
//
