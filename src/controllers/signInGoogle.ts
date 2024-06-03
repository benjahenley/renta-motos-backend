import { authenticate } from "@/lib/firestore";
import { User } from "@/models/user";

export async function signInGoogle(email: string, uid: string) {
  try {
    const uid = await User.checkUser(email);
    if (uid) {
      return;
    }

    const user = await User.createGoogleUser(email, uid);

    return user;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
