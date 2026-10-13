import { z } from "zod";
import { countWords } from "@/lib/utils";

// ─── Booking ──────────────────────────────────────────────────────────────────

export const ClientDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .optional()
    .or(z.literal("")),
  country: z.string().min(2, "Please select your country"),
  timezone: z.string().min(1, "Please select your timezone"),
  language: z.string().optional(),
  ageConfirmed: z.boolean().refine((v) => v === true, {
    message: "You must confirm you are 18 or older",
  }),
});

export type ClientDetailsInput = z.infer<typeof ClientDetailsSchema>;

export const IntakeDescriptionSchema = z.object({
  description: z
    .string()
    .max(3000, "Please keep your description under 3000 characters")
    .refine(
      (text) => countWords(text) <= 300,
      "Please keep your description under 300 words"
    )
    .optional()
    .or(z.literal("")),
});

export type IntakeDescriptionInput = z.infer<typeof IntakeDescriptionSchema>;

export const ConsentSchema = z.object({
  privacyConsent: z.boolean().refine((v) => v === true, {
    message: "You must agree to the privacy policy",
  }),
  consultationConsent: z.boolean().refine((v) => v === true, {
    message: "You must consent to the consultation terms",
  }),
  cancellationConsent: z.boolean().refine((v) => v === true, {
    message: "You must agree to the cancellation policy",
  }),
  ageConfirmed: z.boolean().refine((v) => v === true, {
    message: "You must confirm you are 18 or older",
  }),
});

export type ConsentInput = z.infer<typeof ConsentSchema>;

export const CreateBookingSchema = z.object({
  slotStartUtc: z.string().datetime(),
  slotEndUtc: z.string().datetime(),
  clientTimezone: z.string(),
  clientDetails: ClientDetailsSchema,
  intakeDescription: z.string().max(2000).optional(),
  consentVersion: z.string(),
  sessionHoldId: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

// ─── Payment ──────────────────────────────────────────────────────────────────

export const CreatePaymentOrderSchema = z.object({
  appointmentId: z.string().cuid(),
  amountPaise: z.number().int().min(1),
});

export const VerifyPaymentSchema = z.object({
  appointmentId: z.string().cuid(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UpdateContentSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const FAQSchema = z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(10).max(2000),
  order: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});

export const AvailabilityRuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  isActive: z.boolean().optional(),
});

export const UpdateConsultationSettingsSchema = z.object({
  sessionDurationMinutes: z.number().int().min(15).max(120),
  bufferMinutes: z.number().int().min(0).max(60),
  bookingLeadMinutes: z.number().int().min(0),
  maxAdvanceDays: z.number().int().min(1).max(365),
  professionalTimezone: z.string(),
  minPaymentPaise: z.number().int().min(0),
  maxPaymentPaise: z.number().int().min(1),
  freeSessionsEnabled: z.boolean(),
});

export const ReschedulingSchema = z.object({
  appointmentId: z.string().cuid(),
  newSlotStartUtc: z.string().datetime(),
  newSlotEndUtc: z.string().datetime(),
  reason: z.string().optional(),
});

export const CancelSchema = z.object({
  appointmentId: z.string().cuid(),
  reason: z.string().optional(),
});

export const AddMeetingLinkSchema = z.object({
  appointmentId: z.string().cuid(),
  meetingLink: z.string().url("Please enter a valid URL"),
  meetingInstructions: z.string().optional(),
});
