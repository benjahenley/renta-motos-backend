// import "../lib/controllers";
import { isAfter } from "date-fns";
import { firestore } from "../lib/firestore";

const collection = firestore.collection("auth");
export class Auth {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id: any) {
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }

  static async findByEmail(email: string) {
    const cleanEmail = Auth.cleanEmail(email);
    const results = await collection.where("email", "==", cleanEmail).get();
    if (results.docs.length) {
      const first = results.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    } else {
      return null;
    }
  }

  static async createNewAuth(data: any) {
    const auth = await collection.add(data);
    const newAuth = new Auth(auth.id);
    newAuth.data = data;
    return newAuth;
  }

  static cleanEmail(email: string) {
    return email.trim().toLowerCase();
  }

  isCodeExpired() {
    const now = new Date();
    const expires = this.data.expires.toDate();
    return isAfter(now, expires);
  }

  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail = Auth.cleanEmail(email);
    const result = await collection
      .where("email", "==", email)
      .where("code", "==", code)
      .get();

    if (result.empty) {
      console.error("email y code no coinciden");
      return null;
    } else {
      const doc = result.docs[0];
      const auth = new Auth(doc.id);
      auth.data = doc.data();
      return auth;
    }
  }
}
