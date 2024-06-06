import { User } from "@/models/user";
import { UserRole } from "@/interfaces/user";

type Props = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  uid: string;
};

export async function signUp({
  email,
  firstName,
  lastName,
  password,
  uid,
}: Props) {
  const checkEmail = await User.checkUser(email);

  if (checkEmail) throw new Error("there is already a user with that email");

  try {
    const userId = await User.createNewUser(
      email,
      password,
      firstName,
      lastName,
      uid
    );

    return userId;
  } catch (e: any) {
    return e.message;
  }
}
