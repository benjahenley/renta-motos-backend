import { index } from "@/lib/algolia";

export async function getProductById(productId: string) {
  const hit = await index.getObject(productId as string);
  return hit;
}
