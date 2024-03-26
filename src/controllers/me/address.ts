import { User } from "@/models/user";

export async function updateUserAddress(userId: string, address: string) {
  const user = await User.updateAddress(userId, address);
  console.log("succesfully updated user address to" + address);
  return user;
}
