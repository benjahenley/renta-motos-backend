import { index } from "../lib/algolia";
import { firestore } from "../lib/firestore";

const collection = firestore.collection("products");

export class Product {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: any;
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
  static async createNewProduct(data = {}) {
    const product = await collection.add(data);
    const productData = new Product(product.id);
    await productData.pull();
    return productData;
  }

  static async checkProduct(productId: string) {
    const productSnap: any = await index.getObject(productId);
    if (productSnap) {
      return productSnap;
    } else {
      return false;
    }
  }
}
