import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const firestore = admin.firestore();

export const onReservationDelete = functions.firestore
  .document("reservations/{reservationId}")
  .onDelete(async (snap, context) => {
    const deletedReservation = snap.data();
    const { userId } = deletedReservation;
    const reservationId = context.params.reservationId;

    try {
      const userRef = firestore.collection("users").doc(userId);

      await userRef.update({
        reservations: admin.firestore.FieldValue.arrayRemove(reservationId),
      });

      console.log(
        "Reservation " + { reservationId } + "removed from User " + "{userId}"
      );

      const ordersSnapshot = await firestore
        .collection("orders")
        .where("reservations", "array-contains", reservationId)
        .get();

      if (!ordersSnapshot.empty) {
        const orderRef = ordersSnapshot.docs[0].ref;
        await orderRef.update({
          reservations: admin.firestore.FieldValue.arrayRemove(reservationId),
        });

        console.log(
          "Reservation " +
            { reservationId } +
            "removed from Order " +
            "{orderRef.id}"
        );
      } else {
        console.warn(`No order found containing Reservation ${reservationId}`);
      }
    } catch (error) {
      console.error("Error removing reservation from User document:", error);
    }
  });

// Helper function to calculate the date one week ago
const getOneWeekAgoDate = (): Date => {
  const now = new Date();
  now.setDate(now.getDate() - 7);
  return now;
};

// Function to delete old reservations
export const deleteOldReservations = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const oneWeekAgo = getOneWeekAgoDate();

    try {
      const snapshot = await firestore
        .collection("reservations")
        .where("date", "<=", oneWeekAgo.toISOString())
        .get();

      if (snapshot.empty) {
        console.log("No reservations to delete");
        return null;
      }

      const batch = firestore.batch();

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);

        const reservationId = doc.id;
        const data = doc.data();

        // Remove the reservation reference from the User document
        const userRef = firestore.collection("users").doc(data.userId);
        userRef.update({
          reservations: admin.firestore.FieldValue.arrayRemove(reservationId),
        });

        // Find and remove the reservation reference from the Order document
        firestore
          .collection("orders")
          .where("reservations", "array-contains", reservationId)
          .get()
          .then((ordersSnapshot) => {
            if (!ordersSnapshot.empty) {
              ordersSnapshot.docs.forEach((orderDoc) => {
                orderDoc.ref.update({
                  reservations:
                    admin.firestore.FieldValue.arrayRemove(reservationId),
                });
              });
            }
          });
      });

      await batch.commit();

      console.log("Old reservations deleted successfully");
    } catch (error) {
      console.error("Error deleting old reservations: ", error);
    }

    return null;
  });

// Example of an HTTP function, if you have any
export const helloWorld = functions.https.onRequest((req, res) => {
  console.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});
