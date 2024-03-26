import * as corsModule from "cors";

const cors = corsModule.default({
  methods: ["POST", "GET", "HEAD", "PATCH", "DELETE"],
});

export default function corsMiddleware(req: any, res: any, callback: any) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      callback(req, res);
      return resolve(result);
    });
  });
}
