import { isSameDay, isWithinInterval, parseISO } from "date-fns";
import { occursOnDay } from "./recurrence";

// Checks if two events overlap in time on a given day
function eventsOverlap(e1, e2, day) {
  if (!occursOnDay(e1, day) || !occursOnDay(e2, day)) return false;
  const s1 = parseISO(e1.startDateTime);
  const e1End = e1.endDateTime ? parseISO(e1.endDateTime) : s1;
  const s2 = parseISO(e2.startDateTime);
  const e2End = e2.endDateTime ? parseISO(e2.endDateTime) : s2;
  return (
    isWithinInterval(s1, { start: s2, end: e2End }) ||
    isWithinInterval(e1End, { start: s2, end: e2End }) ||
    isWithinInterval(s2, { start: s1, end: e1End }) ||
    isWithinInterval(e2End, { start: s1, end: e1End })
  );
}

// Returns true if the event conflicts with any existing event
export function hasConflict(event, allEvents) {
  const day = parseISO(event.startDateTime);
  return allEvents.some(e =>
    e.id !== event.id && eventsOverlap(event, e, day)
  );
}
