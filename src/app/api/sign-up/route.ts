import { signUp } from "@/controllers/signUp";
import { NextResponse } from "next/server";
import * as yup from "yup";

const postSchema = yup.object({
  firstName: yup
    .string()
    .min(2, { message: "Name Must be at least 3 characters long" })
    .required(),
  lastName: yup
    .string()
    .min(3, { message: "Name Must be at least 3 characters long" })
    .required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8, { message: "Password Must be at least 8 characters long" })
    .required(),
  uid: yup.string().required(),
});

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, uid } =
      await postSchema.validate(await request.json());

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
