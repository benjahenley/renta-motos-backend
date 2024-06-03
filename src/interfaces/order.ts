export interface OrderProps {
  userId: string;
  reservationIds: string[];
  adults: number;
  price: number;
  expirationDate: string;
}

export interface FirestoreOrderAttributes {
  userId: string;
  reservations: string[];
  adults: number;
  price: number;
  expirationDate: string;
}
