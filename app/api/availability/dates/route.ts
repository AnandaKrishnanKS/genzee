import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadDataStore } from "@/lib/data-store";
import { generateSlots } from "@/lib/date";
import { parseISO } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));

  try {
    let timezone = "Asia/Kolkata";
    let sessionDuration = 50;
    let bufferMinutes = 10;
    let bookingLeadMinutes = 120;
    let rules: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[] = [];
    let blockedDates = new Set<string>();
    let bookedAppointments: { startTime: Date; endTime: Date }[] = [];

    try {
      const settings = await db.consultationSettings.findFirst();
      if (settings) {
        timezone = settings.professionalTimezone;
        sessionDuration = settings.sessionDurationMinutes;
        bufferMinutes = settings.bufferMinutes;
        bookingLeadMinutes = settings.bookingLeadMinutes;
      }

      rules = await db.availabilityRule.findMany({ where: { isActive: true } });

      const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
      const monthEnd = `${year}-${String(month).padStart(2, "0")}-31`;
      const exceptions = await db.availabilityException.findMany({
        where: { date: { gte: monthStart, lte: monthEnd } },
      });
      blockedDates = new Set(exceptions.filter((e) => e.isBlocked).map((e) => e.date));

      const startOfMonthUtc = new Date(`${monthStart}T00:00:00Z`);
      const endOfMonthUtc = new Date(`${year}-${String(month).padStart(2, "0")}-31T23:59:59Z`);
      const booked = await db.appointment.findMany({
        where: {
          startTime: { gte: startOfMonthUtc, lte: endOfMonthUtc },
          status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
        },
        select: { startTime: true, endTime: true },
      });
      bookedAppointments = booked.map((b) => ({ startTime: b.startTime, endTime: b.endTime }));
    } catch (dbErr) {
      // Fall back to local store
      const store = loadDataStore();
      timezone = store.settings.professionalTimezone;
      sessionDuration = store.settings.sessionDurationMinutes;
      bufferMinutes = store.settings.bufferMinutes;
      bookingLeadMinutes = store.settings.bookingLeadMinutes;
      rules = store.availabilityRules.filter((r) => r.isActive);
      blockedDates = new Set(store.exceptions.filter((e) => e.isBlocked).map((e) => e.date));
      bookedAppointments = store.appointments
        .filter((a) => a.status === "CONFIRMED" || a.status === "PENDING_PAYMENT")
        .map((a) => ({ startTime: new Date(a.startTime), endTime: new Date(a.endTime) }));
    }

    const nowUtc = new Date();
    const cutoffUtc = new Date(nowUtc.getTime() + bookingLeadMinutes * 60 * 1000);
    const availableDates: string[] = [];

    const daysInMonth = new Date(year, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dateObj = parseISO(dateStr);
      const dayOfWeek = dateObj.getDay();

      if (blockedDates.has(dateStr)) continue;

      const rule = rules.find((r) => r.dayOfWeek === dayOfWeek);
      if (!rule) continue;

      const slots = generateSlots(
        dateStr,
        rule.startTime,
        rule.endTime,
        sessionDuration,
        bufferMinutes,
        timezone
      );

      const hasAvailableSlot = slots.some((slot) => {
        if (slot.startUtc <= cutoffUtc) return false;
        const isBooked = bookedAppointments.some(
          (b) => slot.startUtc < b.endTime && slot.endUtc > b.startTime
        );
        return !isBooked;
      });

      if (hasAvailableSlot) {
        availableDates.push(dateStr);
      }
    }

    return NextResponse.json({ availableDates });
  } catch (error) {
    console.error("Availability dates error:", error);
    return NextResponse.json({ availableDates: [] }, { status: 500 });
  }
}
