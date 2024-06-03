export function getOneHourExpirationDate() {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + 60 * 60 * 1000);

  return expirationDate.toISOString();
}
