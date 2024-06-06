import { Jetski } from "@/models/jetski";

export async function getAllJetskis() {
  const jetskis = await Jetski.getJetskis();
  return jetskis;
}

export async function toggleAvailable(jetskiId: string) {
  const jetski = await Jetski.toggleAvailable(jetskiId);
  return jetski;
}
