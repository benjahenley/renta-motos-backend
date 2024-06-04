import { User } from "@/models/user";

export async function verifyUserRole(uid: string) {
  const isAllowed = await User.checkRole(uid);

  return isAllowed;
}
