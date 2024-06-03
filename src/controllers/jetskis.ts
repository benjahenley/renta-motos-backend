import { Jetski } from "@/models/jetski";

export async function getAllJetskis() {
  const jetskis = await Jetski.getJetskis();
  return jetskis;
}
