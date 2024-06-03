import { UserRole } from "@/interfaces/user";
import { authenticate, firestore } from "../lib/firestore";
import { sendVerificationLink } from "@/controllers/auth";

const collection = firestore.collection("users");

export class User {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id: any) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }

  static async checkUser(email: string) {
    const snapshot = await collection.where("email", "==", email).get();

    if (snapshot.empty) {
      return null;
    } else {
      return snapshot.docs[0].data().uid;
    }
  }

  static async getFullName(userId: string) {
    const userRef = collection.where("uid", "==", userId);
    const snapshot = await userRef.get();
    const data = snapshot.docs[0].data();
    const fullName = `${data.firstName} ${data.lastName}`;
    console.log(fullName);

    return fullName;
  }

  static async appendOrder(orderId: string, userId: string) {
    const userRef = collection.where("uid", "==", userId);
    const userSnap = await userRef.get();

    const user = new User(userSnap.docs[0].id);
    await user.pull();

    if (!user.data.orders) {
      user.data.orders = [];
    }

    user.data.orders.push(orderId);
    await user.push();
    return;
  }

  static async checkIfAuthenticated(uid: string) {
    const emailRef = await authenticate.getUser(uid);

    if (!emailRef.emailVerified) {
      return null;
    } else {
      return true;
    }
  }

  static async updateUser(userId: string, data: any) {
    const userRef = new User(userId);
    await userRef.ref.update(data);
    await userRef.pull();

    return userRef.data;
  }

  static async addReservations(userId: string, reservationIds: string[]) {
    const userSnapshot = await collection
      .where("uid", "==", userId)
      .limit(1)
      .get();

    const userRef = userSnapshot.docs[0].ref;
    const user = new User(userRef.id);

    await user.pull();

    if (!user.data.reservations) {
      user.data.reservations = [];
    }

    reservationIds.forEach((id) => {
      user.data.reservations.push(id);
    });

    await user.push();

    return;
  }

  static async removeReservation(userId: string, reservationIds: string[]) {
    const userSnapshot = await collection
      .where("uid", "==", userId)
      .limit(1)
      .get();

    return;
  }

  static async createNewUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    uid: string
  ) {
    try {
      const userRef = await collection.add({
        uid,
        role: "user",
        email,
        firstName,
        lastName,
        createdAt: new Date(),
      });

      const userData = await userRef.get();

      return userData.id;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async createGoogleUser(email: string, uid: string) {
    const user = await collection.add({ uid, email });

    return user;
  }

  static async generateToken(uid: string) {
    const customToken = await authenticate.createCustomToken(uid);

    return customToken;
  }
}
