import { sendCode } from "@/controllers/auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const postSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export async function POST(request: Request) {
  try {
    const { email, password } = await postSchema.validate(await request.json());
    const auth = await sendCode(email);
    return NextResponse.json({ auth });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
