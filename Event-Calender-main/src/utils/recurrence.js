import { isSameDay, addDays, addWeeks, addMonths, isAfter, isBefore } from "date-fns";

// Returns true if the event occurs on the given day
export function occursOnDay(event, day) {
  const start = new Date(event.startDateTime);
  if (event.recurrence === "none" || !event.recurrence) {
    return isSameDay(start, day);
  }
  if (isBefore(day, start)) return false;
  switch (event.recurrence) {
    case "daily":
      return true;
    case "weekly":
      // Optionally support custom days of week in event.recurrenceDays
      if (event.recurrenceDays) {
        return event.recurrenceDays.includes(day.getDay());
      }
      return start.getDay() === day.getDay();
    case "monthly":
      return start.getDate() === day.getDate();
    case "custom":
      // Custom interval (e.g., every N days/weeks)
      if (event.customInterval && event.customUnit) {
        let diff = 0;
        if (event.customUnit === "days") {
          diff = Math.floor((day - start) / (1000 * 60 * 60 * 24));
          return diff % event.customInterval === 0;
        } else if (event.customUnit === "weeks") {
          diff = Math.floor((day - start) / (1000 * 60 * 60 * 24 * 7));
          return diff % event.customInterval === 0;
        }
        // Add more units as needed
      }
      return false;
    default:
      return false;
  }
}
