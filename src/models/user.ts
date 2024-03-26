import { firestore } from "../lib/firestore";

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
  static async checkUser(userId: any) {
    const findUser = await collection.doc(userId);
    if (!findUser) {
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

  static async updateAddress(userId: string, address: string) {
    const userRef = new User(userId);
    await userRef.pull();
    userRef.data.address = address;
    await userRef.push();

    return userRef.data;
  }

  static async createNewUser(data: any) {
    const newUserSnap = await collection.add(data);
    const newUser = new User(newUserSnap.id);
    newUser.data = data;
    return newUser;
  }
}
