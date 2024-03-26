import { verifyCode } from "@/controllers/token";
import * as yup from "yup";
import { NextResponse } from "next/server";

let postSchema = yup.object().strict().shape({
  email: yup.string().email().required(),
  code: yup.number().strict().required(),
});

// Devuelve el token unico para cada usuario. Este debe estar presente en todas las api calls que se hagan dentro de una peticion de usuario
export async function POST(request: Request) {
  try {
    const { email, code } = await postSchema.validate(await request.json());

    const token = await verifyCode(email, code);

    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json(error, { status: 400 });
  }
}
