import { signUp } from "@/controllers/signUp";
import { signUpSchema } from "@/yup/signUp";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, uid } =
      await signUpSchema.validate(await request.json());

    const token = await signUp({
      firstName,
      lastName,
      email,
      password,
      uid,
    });

    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
