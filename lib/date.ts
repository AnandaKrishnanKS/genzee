import {
  format,
  parseISO,
  addDays,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  addMinutes,
  isSameDay,
  differenceInMinutes,
} from "date-fns";
import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";

export {
  format,
  parseISO,
  addDays,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  addMinutes,
  isSameDay,
  differenceInMinutes,
  toZonedTime,
  fromZonedTime,
  formatInTimeZone,
};

/**
 * Format a UTC date for display in a specific timezone.
 */
export function formatInTz(
  utcDate: Date,
  timezone: string,
  formatStr: string
): string {
  return formatInTimeZone(utcDate, timezone, formatStr);
}

/**
 * Convert "YYYY-MM-DD" + "HH:MM" in a given tz to a UTC Date.
 */
export function localToUtc(
  dateStr: string,
  timeStr: string,
  timezone: string
): Date {
  const localDatetime = `${dateStr}T${timeStr}:00`;
  return fromZonedTime(localDatetime, timezone);
}

/**
 * Get today's date string "YYYY-MM-DD" in a given timezone.
 */
export function todayInTz(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
}

/**
 * Generate time slots for a given day based on availability rules.
 */
export function generateSlots(
  date: string,
  startTime: string,
  endTime: string,
  durationMinutes: number,
  bufferMinutes: number,
  timezone: string
): { startUtc: Date; endUtc: Date; label: string }[] {
  const slots: { startUtc: Date; endUtc: Date; label: string }[] = [];

  let current = localToUtc(date, startTime, timezone);
  const end = localToUtc(date, endTime, timezone);

  while (
    isAfter(
      end,
      addMinutes(current, durationMinutes)
    ) ||
    end.getTime() === addMinutes(current, durationMinutes).getTime()
  ) {
    const slotEnd = addMinutes(current, durationMinutes);
    const label = formatInTimeZone(current, timezone, "h:mm a");
    slots.push({ startUtc: current, endUtc: slotEnd, label });
    current = addMinutes(slotEnd, bufferMinutes);
  }

  return slots;
}
