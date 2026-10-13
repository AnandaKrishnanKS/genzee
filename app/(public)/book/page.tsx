import type { Metadata } from "next";
import BookingWizard from "@/components/booking/BookingWizard";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book your online psychological consultation with GenZee Psychologist. Choose your time, share a little about yourself, and pay what you can.",
  robots: { index: false },
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F0E9FF] to-[#FFF9F3] py-12 px-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#24212E] mb-3">
          Book your session 💜
        </h1>
        <p className="text-[#24212E]/60 text-lg max-w-md mx-auto">
          A few simple steps to reserve your time. You&apos;re in the right place.
        </p>
      </div>

      {/* Wizard */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <BookingWizard />
      </div>

      {/* Trust footer */}
      <div className="border-t border-[#F0E9FF] py-6">
        <div className="max-w-2xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 text-sm text-[#24212E]/40">
          {[
            { icon: ShieldCheck, text: "Secure & private" },
            { text: "Pay what you can" },
            { text: "Cancel anytime" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#A78BFA]" />
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
