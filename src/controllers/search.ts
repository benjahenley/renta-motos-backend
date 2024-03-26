import { index } from "@/lib/algolia";

export async function getResultsFromAlgolia(q: any, offset: any, limit: any) {
  const hits = await index.search(q as string, {
    hitsPerPage: limit,
    offset,
  });
  return hits;
}
