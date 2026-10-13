"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { ConsentSchema, type ConsentInput } from "@/lib/validations";
import { CONSENT_VERSION } from "@/lib/constants";
import type { BookingData } from "./BookingWizard";
import { format, parseISO } from "date-fns";

interface StepConsentProps {
  bookingData: BookingData;
  onNext: (appointmentId: string, reference: string) => Promise<void>;
  onBack: () => void;
}

export default function StepConsent({
  bookingData,
  onNext,
  onBack,
}: StepConsentProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConsentInput>({
    resolver: zodResolver(ConsentSchema),
    defaultValues: {
      privacyConsent: false,
      consultationConsent: false,
      cancellationConsent: false,
      ageConfirmed: false,
    },
  });

  const onSubmit = async () => {
    setServerError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotStartUtc: bookingData.selectedSlot!.startUtc,
          slotEndUtc: bookingData.selectedSlot!.endUtc,
          clientTimezone: bookingData.clientDetails!.timezone,
          clientDetails: bookingData.clientDetails!,
          intakeDescription: bookingData.intakeDescription,
          consentVersion: CONSENT_VERSION,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      await onNext(data.appointmentId, data.reference);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  const slotDate = bookingData.selectedSlot
    ? format(parseISO(bookingData.selectedSlot.startUtc), "EEEE, MMMM d, yyyy")
    : "";

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#6D4EC9] text-sm font-medium mb-5 hover:text-[#A78BFA] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="font-display text-2xl font-bold text-[#24212E] mb-2">
        Before we confirm
      </h2>
      <p className="text-[#24212E]/55 text-sm mb-6">
        Please read and agree to the following before your session is created.
      </p>

      {/* Session summary */}
      <div className="bg-[#F0E9FF]/60 rounded-2xl p-5 mb-6">
        <h3 className="font-display font-bold text-[#24212E] mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#A78BFA]" />
          Session Summary
        </h3>
        <div className="space-y-1 text-sm text-[#24212E]/70">
          <p><strong>Date:</strong> {slotDate}</p>
          <p><strong>Time:</strong> {bookingData.selectedSlot?.label} ({bookingData.clientDetails?.timezone})</p>
          <p><strong>Name:</strong> {bookingData.clientDetails?.name}</p>
          <p><strong>Email:</strong> {bookingData.clientDetails?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Privacy */}
        <div className="flex items-start gap-3 p-4 bg-white border-2 border-[#F0E9FF] rounded-xl">
          <input
            id="privacyConsent"
            type="checkbox"
            {...register("privacyConsent")}
            className="mt-0.5 w-4 h-4 rounded accent-[#A78BFA]"
          />
          <label htmlFor="privacyConsent" className="text-sm text-[#24212E]/70 leading-relaxed">
            I have read and agree to the{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#6D4EC9] underline">
              Privacy Policy
            </a>{" "}
            and understand how my personal information is stored and used.
          </label>
        </div>
        {errors.privacyConsent && (
          <p className="text-red-500 text-xs" role="alert">{errors.privacyConsent.message}</p>
        )}

        {/* Consultation */}
        <div className="flex items-start gap-3 p-4 bg-white border-2 border-[#F0E9FF] rounded-xl">
          <input
            id="consultationConsent"
            type="checkbox"
            {...register("consultationConsent")}
            className="mt-0.5 w-4 h-4 rounded accent-[#A78BFA]"
          />
          <label htmlFor="consultationConsent" className="text-sm text-[#24212E]/70 leading-relaxed">
            I understand that this is a psychological consultation service, not a medical
            or emergency service, and I consent to participate.
          </label>
        </div>
        {errors.consultationConsent && (
          <p className="text-red-500 text-xs" role="alert">{errors.consultationConsent.message}</p>
        )}

        {/* Cancellation */}
        <div className="flex items-start gap-3 p-4 bg-white border-2 border-[#F0E9FF] rounded-xl">
          <input
            id="cancellationConsent"
            type="checkbox"
            {...register("cancellationConsent")}
            className="mt-0.5 w-4 h-4 rounded accent-[#A78BFA]"
          />
          <label htmlFor="cancellationConsent" className="text-sm text-[#24212E]/70 leading-relaxed">
            I have read and accept the{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#6D4EC9] underline">
              cancellation policy
            </a>
            .
          </label>
        </div>
        {errors.cancellationConsent && (
          <p className="text-red-500 text-xs" role="alert">{errors.cancellationConsent.message}</p>
        )}

        {/* Age */}
        <div className="flex items-start gap-3 p-4 bg-white border-2 border-[#F0E9FF] rounded-xl">
          <input
            id="ageConfirmed2"
            type="checkbox"
            {...register("ageConfirmed")}
            className="mt-0.5 w-4 h-4 rounded accent-[#A78BFA]"
          />
          <label htmlFor="ageConfirmed2" className="text-sm text-[#24212E]/70 leading-relaxed">
            I confirm I am 18 years of age or older.
          </label>
        </div>
        {errors.ageConfirmed && (
          <p className="text-red-500 text-xs" role="alert">{errors.ageConfirmed.message}</p>
        )}

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(167,139,250,0.35)] disabled:opacity-70"
        >
          {isSubmitting ? "Creating your booking…" : "Confirm & Proceed to Payment →"}
        </button>
      </form>
    </div>
  );
}
