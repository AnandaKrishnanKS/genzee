"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import StepCalendar from "./StepCalendar";
import StepTimeSlots from "./StepTimeSlots";
import StepClientDetails from "./StepClientDetails";
import StepDescription from "./StepDescription";
import StepConsent from "./StepConsent";
import StepPayment from "./StepPayment";
import BookingConfirmation from "./BookingConfirmation";

export type BookingData = {
  selectedDate?: string; // YYYY-MM-DD
  selectedSlot?: { startUtc: string; endUtc: string; label: string };
  clientDetails?: {
    name: string;
    email: string;
    phone?: string;
    country: string;
    timezone: string;
    language?: string;
    ageConfirmed: boolean;
  };
  intakeDescription?: string;
  consentGiven?: boolean;
  appointmentId?: string;
  reference?: string;
  paymentStatus?: "pending" | "paid" | "free";
  amountPaise?: number;
};

const STEPS = [
  { id: 1, label: "Date" },
  { id: 2, label: "Time" },
  { id: 3, label: "Details" },
  { id: 4, label: "About you" },
  { id: 5, label: "Consent" },
  { id: 6, label: "Payment" },
];

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [isConfirmed, setIsConfirmed] = useState(false);

  const updateBooking = (updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  if (isConfirmed) {
    return (
      <BookingConfirmation
        data={bookingData}
        onReset={() => {
          setStep(1);
          setBookingData({});
          setIsConfirmed(false);
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#F0E9FF]" />
          <motion.div
            className="absolute left-0 top-5 h-0.5 bg-[#A78BFA] origin-left"
            animate={{ scaleX: (step - 1) / (STEPS.length - 1) }}
            transition={{ duration: 0.3 }}
          />
          {STEPS.map((s) => (
            <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step > s.id
                    ? "bg-[#A78BFA] text-white"
                    : step === s.id
                    ? "bg-[#A78BFA] text-white shadow-[0_0_0_4px_#F0E9FF]"
                    : "bg-white border-2 border-[#E9DAFF] text-[#24212E]/30"
                }`}
              >
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  step === s.id
                    ? "text-[#6D4EC9]"
                    : step > s.id
                    ? "text-[#A78BFA]"
                    : "text-[#24212E]/30"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {step === 1 && (
            <StepCalendar
              selectedDate={bookingData.selectedDate}
              onSelect={(date) => {
                updateBooking({ selectedDate: date, selectedSlot: undefined });
                next();
              }}
            />
          )}
          {step === 2 && (
            <StepTimeSlots
              date={bookingData.selectedDate!}
              clientTimezone={bookingData.clientDetails?.timezone}
              selectedSlot={bookingData.selectedSlot}
              onSelect={(slot) => {
                updateBooking({ selectedSlot: slot });
                next();
              }}
              onBack={prev}
            />
          )}
          {step === 3 && (
            <StepClientDetails
              initialValues={bookingData.clientDetails}
              onNext={(details) => {
                updateBooking({ clientDetails: details });
                next();
              }}
              onBack={prev}
            />
          )}
          {step === 4 && (
            <StepDescription
              initialValue={bookingData.intakeDescription}
              onNext={(desc) => {
                updateBooking({ intakeDescription: desc });
                next();
              }}
              onBack={prev}
            />
          )}
          {step === 5 && (
            <StepConsent
              bookingData={bookingData}
              onNext={async (appointmentId, reference) => {
                updateBooking({ appointmentId, reference });
                next();
              }}
              onBack={prev}
            />
          )}
          {step === 6 && (
            <StepPayment
              bookingData={bookingData}
              onSuccess={(amountPaise, paymentStatus) => {
                updateBooking({ amountPaise, paymentStatus });
                setIsConfirmed(true);
              }}
              onBack={prev}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
