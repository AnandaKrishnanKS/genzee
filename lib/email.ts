import { Resend } from "resend";
import { db } from "@/lib/db";
import { EmailNotificationType } from "@prisma/client";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_build_placeholder_key");

const FROM = process.env.EMAIL_FROM ?? "GenZee Psychologist <hello@example.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "hello@example.com";

export interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
  appointmentId?: string;
  type: EmailNotificationType;
  bookingVersion?: number;
}

export async function sendEmail({
  to,
  subject,
  react,
  appointmentId,
  type,
  bookingVersion = 1,
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to,
      subject,
      react,
    });

    if (error || !data) {
      if (appointmentId) {
        await db.emailNotification.create({
          data: {
            appointmentId,
            type,
            recipientEmail: to,
            status: "FAILED",
            sentAt: new Date(),
            error: error?.message ?? "Unknown error",
            attemptCount: 1,
            bookingVersion,
          },
        });
      }
      return { success: false, error: error?.message ?? "Unknown error" };
    }

    if (appointmentId) {
      await db.emailNotification.create({
        data: {
          appointmentId,
          type,
          recipientEmail: to,
          status: "SENT",
          sentAt: new Date(),
          providerId: data.id,
          attemptCount: 1,
          bookingVersion,
        },
      });
    }

    return { success: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (appointmentId) {
      await db.emailNotification.create({
        data: {
          appointmentId,
          type,
          recipientEmail: to,
          status: "FAILED",
          sentAt: new Date(),
          error: message,
          attemptCount: 1,
          bookingVersion,
        },
      });
    }
    return { success: false, error: message };
  }
}

/**
 * Schedule reminder jobs when a booking is confirmed.
 */
export async function scheduleReminders(appointmentId: string) {
  const settings = await db.reminderSettings.findFirst();
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    include: { client: true },
  });
  if (!appointment) return;

  const now = new Date();
  const jobsToCreate = [];

  if (settings?.enabled24h ?? true) {
    const send24h = new Date(
      appointment.startTime.getTime() -
        (settings?.advance24hMinutes ?? 1440) * 60 * 1000
    );
    if (send24h > now) {
      jobsToCreate.push({
        appointmentId,
        type: EmailNotificationType.REMINDER_24H,
        recipientEmail: appointment.client.email,
        scheduledFor: send24h,
        bookingVersion: appointment.bookingVersion,
      });
    }
  }

  if (settings?.enabled1h ?? true) {
    const send1h = new Date(
      appointment.startTime.getTime() -
        (settings?.advance1hMinutes ?? 60) * 60 * 1000
    );
    if (send1h > now) {
      jobsToCreate.push({
        appointmentId,
        type: EmailNotificationType.REMINDER_1H,
        recipientEmail: appointment.client.email,
        scheduledFor: send1h,
        bookingVersion: appointment.bookingVersion,
      });
    }
  }

  // Check missing meeting link alert
  if (settings?.adminAlertMinutes) {
    const alertTime = new Date(
      appointment.startTime.getTime() -
        settings.adminAlertMinutes * 60 * 1000
    );
    if (alertTime > now) {
      jobsToCreate.push({
        appointmentId,
        type: EmailNotificationType.ADMIN_MISSING_LINK,
        recipientEmail:
          process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@example.com",
        scheduledFor: alertTime,
        bookingVersion: appointment.bookingVersion,
      });
    }
  }

  // Upsert to prevent duplicates
  for (const job of jobsToCreate) {
    await db.emailJob
      .upsert({
        where: {
          appointmentId_type_bookingVersion: {
            appointmentId: job.appointmentId,
            type: job.type,
            bookingVersion: job.bookingVersion,
          },
        },
        create: { ...job, status: "SCHEDULED" },
        update: {},
      })
      .catch(() => {
        // Already exists, skip
      });
  }
}

/**
 * Cancel all pending reminder jobs for an appointment.
 */
export async function cancelReminderJobs(appointmentId: string) {
  await db.emailJob.updateMany({
    where: {
      appointmentId,
      status: "SCHEDULED",
    },
    data: {
      status: "CANCELLED",
    },
  });
}
