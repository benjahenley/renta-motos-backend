import { User } from "@/models/user";
import { Auth } from "@/models/auth";
import { transporter } from "@/lib/nodemailer";
import addMinutes from "date-fns/addMinutes";
import gen from "random-seed";

// export async function findOrCreateAuth(email: string) {
//   const cleanEmail = email.trim().toLowerCase();
//   const auth = await Auth.findByEmail(cleanEmail);
//   if (auth) {
//     return auth;
//   } else {
//     const newUser = await User.createNewUser({
//       email: cleanEmail,
//     });
//     const newAuth = await Auth.createNewAuth({
//       email: cleanEmail,
//       userId: newUser.id,
//       code: "",
//       expires: new Date(),
//     });

//     return newAuth;
//   }
// }

export async function sendVerificationLink(link: string, email: string) {
  // const auth = (await findOrCreateAuth(email)) as any;
  // var random = gen.create();
  // const code = random.intBetween(10000, 99999);
  // const now = new Date();
  // const twentyMinFromNow = addMinutes(now, 20);
  // auth.data.code = code;
  // auth.data.expires = twentyMinFromNow.toISOString();
  // await auth.push();

  const msg = {
    to: email,
    subject: "Confirm your account to enter Ibij Rent",
    text: `your code is ${link}, don't share this code with anybody.`,
  };

  try {
    await transporter.sendMail(msg);

    return true;
  } catch (e: any) {
    return null;
  }
}
