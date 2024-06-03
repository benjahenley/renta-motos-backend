export type Status = "pending" | "confirmed" | "cancelled";

export interface ReservationData {
  date: string;
  startTime: string;
  endTime: string;
  userId: string;
  jetskiId: string;
  status: Status;
  expirationDate: string;
}
export interface ReservationInputData {
  userId: string;
  reservations: ReservationItem[];
}

export interface ReservationItem {
  date: string;
  startTime: string;
  endTime: string;
  jetskiId: string;
}
