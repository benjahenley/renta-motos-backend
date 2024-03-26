import { User } from "@/models/user";

export async function getUserData(userId: string) {
  const user = new User(userId);
  await user.pull();
  return user.data;
}

export async function updateUser(userId: string, data: any) {
  const user = await User.updateUser(userId, data);
  console.log("succesfully updated user with id: " + userId);
  return user;
}
