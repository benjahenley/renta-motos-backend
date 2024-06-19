export type Status = "pending" | "approved" | "cancelled";
export interface ReservationInputData {
  date: string;
  userId: string;
  startTime: string;
  endTime: string;
  adults: number;
  excursion: boolean;
  excursionName?: string | undefined;
  expirationDate: string;
}
export interface ReservationItem {
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  adults: number;
  excursion: boolean;
  excursionName?: string | undefined;
  price: number;
  status: Status;
  expirationDate: string;
}
