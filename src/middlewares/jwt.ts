import jwt from "jsonwebtoken";

export function generate(obj: any) {
  return jwt.sign(obj, process.env.JWT_SECRET as string);
}

export function decode(token: any) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as any);
  } catch (e) {
    console.error("token incorrecto");
    return null;
  }
}
