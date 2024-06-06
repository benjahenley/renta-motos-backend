interface Reservation {
  date: string;
  startTime: string;
  endTime: string;
  jetskiId: string;
}

export const getPrice = (reservations: Reservation[]) => {
  let totalPrice = 0;

  reservations.forEach((reservation) => {
    const startTime = new Date(reservation.startTime).getTime();
    const endTime = new Date(reservation.endTime).getTime();
    const durationInHours = (endTime - startTime) / (1000 * 60 * 60);

    if (durationInHours <= 2) {
      totalPrice += 250;
    } else if (durationInHours <= 4) {
      totalPrice += 300;
    } else {
      totalPrice += 450;
    }
  });

  return totalPrice;
};
