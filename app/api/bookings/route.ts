import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadDataStore, saveDataStore } from "@/lib/data-store";
import { CreateBookingSchema } from "@/lib/validations";
import { countWords } from "@/lib/utils";
import { generateReference } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      slotStartUtc,
      slotEndUtc,
      clientTimezone,
      clientDetails,
      intakeDescription,
      consentVersion,
    } = parsed.data;

    // Validate word count server-side (up to 300 words)
    if (intakeDescription && countWords(intakeDescription) > 300) {
      return NextResponse.json(
        { error: "Description exceeds 300 words" },
        { status: 400 }
      );
    }

    const startTime = new Date(slotStartUtc);
    const endTime = new Date(slotEndUtc);
    const now = new Date();

    // Slot must be in the future
    if (startTime <= now) {
      return NextResponse.json(
        { error: "This slot is no longer available." },
        { status: 409 }
      );
    }

    const reference = generateReference();

    // Attempt saving to DB first
    try {
      const settings = await db.consultationSettings.findFirst();
      const bookingLeadMinutes = settings?.bookingLeadMinutes ?? 120;
      const cutoff = new Date(now.getTime() + bookingLeadMinutes * 60 * 1000);
      if (startTime <= cutoff) {
        return NextResponse.json(
          {
            error: `Bookings must be made at least ${bookingLeadMinutes} minutes in advance.`,
          },
          { status: 409 }
        );
      }

      const appointment = await db.$transaction(async (tx) => {
        const conflicting = await tx.appointment.findFirst({
          where: {
            status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        });

        if (conflicting) throw new Error("SLOT_TAKEN");

        const client = await tx.client.upsert({
          where: { email: clientDetails.email },
          create: {
            name: clientDetails.name,
            email: clientDetails.email,
            phone: clientDetails.phone ?? null,
            country: clientDetails.country,
            timezone: clientDetails.timezone,
            language: clientDetails.language ?? null,
          },
          update: {
            name: clientDetails.name,
            phone: clientDetails.phone ?? null,
            country: clientDetails.country,
            timezone: clientDetails.timezone,
          },
        });

        const newAppointment = await tx.appointment.create({
          data: {
            reference,
            clientId: client.id,
            startTime,
            endTime,
            clientTimezone,
            professionalTimezone: settings?.professionalTimezone ?? "Asia/Kolkata",
            status: "PENDING_PAYMENT",
            intakeDescription: intakeDescription ?? null,
            consentVersion,
            consentAt: now,
          },
        });

        return newAppointment;
      });

      return NextResponse.json({
        appointmentId: appointment.id,
        reference: appointment.reference,
      });
    } catch (dbErr: any) {
      if (dbErr?.message === "SLOT_TAKEN") {
        return NextResponse.json(
          { error: "This slot was just booked. Please choose another time." },
          { status: 409 }
        );
      }

      // Fall back to data store
      const store = loadDataStore();
      const newClientId = "cl_" + Date.now();
      const newAptId = "apt_" + Date.now();

      const newClient = {
        id: newClientId,
        name: clientDetails.name,
        email: clientDetails.email,
        phone: clientDetails.phone ?? "",
        country: clientDetails.country,
        timezone: clientDetails.timezone,
        language: clientDetails.language ?? "",
        createdAt: now.toISOString(),
      };

      const newAppointment = {
        id: newAptId,
        reference,
        clientId: newClientId,
        client: newClient,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        clientTimezone,
        professionalTimezone: store.settings.professionalTimezone,
        status: "PENDING_PAYMENT" as const,
        sessionType: "ONLINE",
        intakeDescription: intakeDescription ?? "",
        createdAt: now.toISOString(),
      };

      store.clients.push(newClient);
      store.appointments.push(newAppointment);
      saveDataStore(store);

      return NextResponse.json({
        appointmentId: newAppointment.id,
        reference: newAppointment.reference,
      });
    }
  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}
