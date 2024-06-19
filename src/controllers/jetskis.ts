import { Jetski } from "@/models/jetski";

export async function getAllJetskis() {
  const jetskis = await Jetski.getAllJetskis();
  return jetskis;
}

export async function getAvailableJetskis() {
  const jetskis = await Jetski.getAvailableJetskis();
  return jetskis;
}

export async function toggleAvailable(jetskiId: string) {
  const jetski = await Jetski.toggleAvailable(jetskiId);
  return jetski;
}

export async function createNewJetski(name: string) {
  const jetski = await Jetski.createNewJetski(name);
  return jetski;
}
