import { Auth } from "@/models/auth";
import { generate } from "@/middlewares/jwt";

export async function verifyCode(email: string, code: number) {
  var auth: any = await Auth.findByEmailAndCode(email, code);
  if (!auth) {
    throw new Error("not allowed");
  }

  const expired = auth.isCodeExpired();
  if (expired) {
    throw new Error("token expirado");
  }

  const token = generate({ userId: auth.data.userId });
  return token;
}
