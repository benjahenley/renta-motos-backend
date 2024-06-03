import { signInGoogle } from "@/controllers/signInGoogle";
import { NextResponse } from "next/server";
import * as yup from "yup";

const postSchema = yup.object({
  email: yup.string().email().required(),
  uid: yup.string().required(),
});

export async function POST(request: Request) {
  try {
    const { email, uid } = await postSchema.validate(await request.json());
    const auth = await signInGoogle(email, uid);

    return NextResponse.json({ auth });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
