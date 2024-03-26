import algoliasearch from "algoliasearch";

const client = algoliasearch(
  "K98RO3JPW0",
  process.env.API_KEY_ALGOLIA as string
);

export const index = client.initIndex("products");
