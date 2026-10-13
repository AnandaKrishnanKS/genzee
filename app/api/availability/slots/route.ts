import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadDataStore } from "@/lib/data-store";
import { generateSlots, formatInTimeZone } from "@/lib/date";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date"); // YYYY-MM-DD
  const clientTimezone = searchParams.get("timezone") ?? "Asia/Kolkata";

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  try {
    let professionalTz = "Asia/Kolkata";
    let sessionDuration = 50;
    let bufferMinutes = 10;
    let bookingLeadMinutes = 120;
    let startTime = "10:00";
    let endTime = "18:00";
    let isBlocked = false;
    let bookedSlots: { startTime: Date; endTime: Date }[] = [];

    const dayOfWeek = new Date(date + "T12:00:00.000Z").getDay();

    try {
      const settings = await db.consultationSettings.findFirst();
      if (settings) {
        professionalTz = settings.professionalTimezone;
        sessionDuration = settings.sessionDurationMinutes;
        bufferMinutes = settings.bufferMinutes;
        bookingLeadMinutes = settings.bookingLeadMinutes;
      }

      const exception = await db.availabilityException.findUnique({ where: { date } });
      if (exception?.isBlocked) isBlocked = true;

      const rule = await db.availabilityRule.findFirst({
        where: { dayOfWeek, isActive: true },
      });

      if (!isBlocked && rule) {
        startTime = rule.startTime;
        endTime = rule.endTime;
      } else if (!isBlocked && !rule) {
        isBlocked = true;
      }

      const dayStartUtc = new Date(`${date}T00:00:00Z`);
      const dayEndUtc = new Date(`${date}T23:59:59Z`);
      const booked = await db.appointment.findMany({
        where: {
          startTime: { gte: dayStartUtc, lte: dayEndUtc },
          status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
        },
        select: { startTime: true, endTime: true },
      });
      bookedSlots = booked.map((b) => ({ startTime: b.startTime, endTime: b.endTime }));
    } catch (dbErr) {
      // Fall back to local store
      const store = loadDataStore();
      professionalTz = store.settings.professionalTimezone;
      sessionDuration = store.settings.sessionDurationMinutes;
      bufferMinutes = store.settings.bufferMinutes;
      bookingLeadMinutes = store.settings.bookingLeadMinutes;

      const exc = store.exceptions.find((e) => e.date === date);
      if (exc?.isBlocked) isBlocked = true;

      const rule = store.availabilityRules.find((r) => r.dayOfWeek === dayOfWeek && r.isActive);
      if (!isBlocked && rule) {
        startTime = rule.startTime;
        endTime = rule.endTime;
      } else if (!isBlocked && !rule) {
        isBlocked = true;
      }

      bookedSlots = store.appointments
        .filter(
          (a) =>
            a.startTime.startsWith(date) &&
            (a.status === "CONFIRMED" || a.status === "PENDING_PAYMENT")
        )
        .map((a) => ({ startTime: new Date(a.startTime), endTime: new Date(a.endTime) }));
    }

    if (isBlocked) {
      return NextResponse.json({ slots: [] });
    }

    const allSlots = generateSlots(
      date,
      startTime,
      endTime,
      sessionDuration,
      bufferMinutes,
      professionalTz
    );

    const nowUtc = new Date();
    const cutoffUtc = new Date(nowUtc.getTime() + bookingLeadMinutes * 60 * 1000);

    const slots = allSlots.map((slot) => {
      const isPastCutoff = slot.startUtc <= cutoffUtc;
      const isBooked = bookedSlots.some(
        (b) => slot.startUtc < b.endTime && slot.endUtc > b.startTime
      );
      const isAvailable = !isPastCutoff && !isBooked;

      return {
        startUtc: slot.startUtc.toISOString(),
        endUtc: slot.endUtc.toISOString(),
        displayTime: formatInTimeZone(slot.startUtc, clientTimezone, "hh:mm a"),
        displayEnd: formatInTimeZone(slot.endUtc, clientTimezone, "hh:mm a"),
        isAvailable,
      };
    });

    return NextResponse.json({
      slots,
      timezone: clientTimezone,
      professionalTimezone: professionalTz,
    });
  } catch (error) {
    console.error("Availability slots error:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
