export default function add30Minutes(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(0, 0, 0, hours, minutes + 30);
  const newHours = String(date.getHours()).padStart(2, "0");
  const newMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${newHours}:${newMinutes}`;
}
