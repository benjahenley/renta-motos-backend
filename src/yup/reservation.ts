import * as yup from "yup";

// Custom method to check if a date is in the past
yup.addMethod<yup.StringSchema>(
  yup.string,
  "notInPast",
  function (errorMessage) {
    return this.test("notInPast", errorMessage, function (value) {
      const { path, createError } = this;
      return (
        (value && new Date(value) >= new Date()) ||
        createError({ path, message: errorMessage })
      );
    });
  }
);

// Utility function to check if a time is within a specified range (ignoring the date)
const isTimeInRange = (
  timeString: string,
  start: string,
  end: string
): boolean => {
  const time = new Date(timeString);
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const timeHours = time.getUTCHours();
  const timeMinutes = time.getUTCMinutes();

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const timeTotalMinutes = timeHours * 60 + timeMinutes;

  return (
    timeTotalMinutes >= startTotalMinutes && timeTotalMinutes <= endTotalMinutes
  );
};

const allowedStartTimes = ["10:00", "12:00", "14:00", "16:00"];
const allowedEndTimes = ["12:00", "14:00", "16:00", "18:00"];

// Utility function to check if time is in allowed times
const isAllowedTime = (timeString: string, allowedTimes: string[]): boolean => {
  const time = new Date(timeString);
  const formattedTime = time.toISOString().slice(11, 16);
  return allowedTimes.includes(formattedTime);
};

const reservationSchema = yup.object().shape({
  date: yup.string().required().notInPast("Date cannot be in the past"),
  startTime: yup
    .string()
    .required()
    .notInPast("Start time cannot be in the past")
    .test(
      "same-day-as-date",
      "Start time must be on the same day as date",
      function (value) {
        const { date } = this.parent;
        if (date && value) {
          const dateOnly: string = new Date(date).toISOString().split("T")[0];
          const startDate = new Date(value).toISOString().split("T")[0];
          return dateOnly === startDate;
        }
        return true;
      }
    )
    .test(
      "allowed-start-time",
      "Start time must be 10:00, 12:00, 14:00, or 16:00",
      function (value) {
        return value ? isAllowedTime(value, allowedStartTimes) : true;
      }
    ),
  endTime: yup
    .string()
    .required()
    .notInPast("End Time cannot be in the past")
    .test(
      "same-day-as-date",
      "End time must be on the same day as date",
      function (value) {
        const { date } = this.parent;
        if (date && value) {
          const dateOnly = new Date(date).toISOString().split("T")[0];
          const endDate = new Date(value).toISOString().split("T")[0];
          return dateOnly === endDate;
        }
        return true;
      }
    )
    .test(
      "allowed-end-time",
      "End time must be 12:00, 14:00, 16:00, or 18:00",
      function (value) {
        return value ? isAllowedTime(value, allowedEndTimes) : true;
      }
    )
    .test(
      "end-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        if (startTime && value) {
          return new Date(value) > new Date(startTime);
        }
        return true;
      }
    )
    .test(
      "minimum-2-hours-apart",
      "End time must be at least 2 hours after start time",
      function (value) {
        const { startTime } = this.parent;
        if (startTime && value) {
          const start = new Date(startTime);
          const end = new Date(value);
          const diffHours =
            (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return diffHours >= 2;
        }
        return true;
      }
    ),
  jetskiId: yup.string().required(),
});

const timeSchema = yup
  .string()
  .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format")
  .test("is-before-1800", "Time must not be later than 18:00", (value) => {
    if (!value) return false;
    const [hours, minutes] = value.split(":").map(Number);
    return hours < 18 || (hours === 18 && minutes === 0);
  });

const dateSchema = yup
  .string()
  .required("Date is required")
  .test("is-not-past", "Date must not be in the past", (value) => {
    if (!value) return false;
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  });

export const mainReservationSchema = yup.object({
  date: dateSchema,
  adults: yup.number().required(),
  startTime: timeSchema.required("Start time is required"),
  endTime: timeSchema
    .required("End time is required")
    .test(
      "is-after-start-time",
      "End time must be at least 30 minutes after start time",
      function (value) {
        const { startTime } = this.parent;
        if (!value || !startTime) return false;

        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = value.split(":").map(Number);

        const startDate = new Date();
        startDate.setHours(startHours, startMinutes);

        const endDate = new Date();
        endDate.setHours(endHours, endMinutes);

        const timeDifference =
          (endDate.getTime() - startDate.getTime()) / 60000;

        return timeDifference >= 30;
      }
    ),
  excursion: yup.boolean().required(),
  excursionName: yup
    .string()
    .oneOf(
      [
        "isla-margarita",
        "cala-salada",
        "cala-comte",
        "cala-ubarca",
        "portixol",
        "isla-es-vedra",
        "listing-1",
      ],
      "Excursion name must be one of the predefined values"
    )
    .when("excursion", (excursion, schema) =>
      excursion
        ? schema.required("Excursion name is required when excursion is true")
        : schema.notRequired().nullable()
    ),
});

export const reservationsByDateSchema = yup.object({
  date: yup.string().required().notInPast("Date cannot be in the past"),
});

export const patchReservationSchema = yup.object({
  status: yup.string().oneOf(["approved", "cancelled", "pending"]).required(),
});

export const reservationsByUidSchema = yup.object({
  uid: yup.string().required(),
});

export const reservationUpdateSchema = yup.object({
  reservationId: yup.string().required(),
});
