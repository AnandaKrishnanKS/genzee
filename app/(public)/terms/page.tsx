import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service & Cancellation Policy — GenZee Psychologist",
  description:
    "Terms of service, session cancellations, rescheduling guidelines, and sliding scale payment rules.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F3] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D4EC9] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/20 flex items-center justify-center text-[#6D4EC9]">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#24212E]">
            Terms & Cancellation Policy
          </h1>
        </div>
        <p className="text-xs text-[#24212E]/50 mb-10">Last updated: October 2026</p>

        <div className="prose prose-zinc max-w-none space-y-8 text-[#24212E]/80 text-sm sm:text-base leading-relaxed">
          <section className="p-6 rounded-2xl bg-white border border-[#24212E]/10">
            <h2 className="font-display font-bold text-xl text-[#24212E] mb-3">
              1. Nature of the Service
            </h2>
            <p>
              GenZee Psychologist provides independent, confidential, online psychological consultations conducted via secure video link (e.g. Google Meet or Jitsi). These sessions are intended for counseling, personal growth, psychoeducation, and emotional support. They do not constitute emergency psychiatric intervention or hospital care.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-[#24212E]/10">
            <h2 className="font-display font-bold text-xl text-[#24212E] mb-3">
              2. Cancellation & Rescheduling
            </h2>
            <ul className="space-y-2 list-none p-0">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D4EC9] shrink-0 mt-1" />
                <span><strong>24+ Hours Notice:</strong> You may reschedule your session at no additional cost by contacting us at least 24 hours prior to the scheduled start time.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D4EC9] shrink-0 mt-1" />
                <span><strong>Less than 24 Hours:</strong> Cancellations made within 24 hours of the appointment or missed sessions (no-shows) may forfeit the fee to protect the therapist’s reserved time slot.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D4EC9] shrink-0 mt-1" />
                <span><strong>Late Arrival:</strong> If you are late, the session will still conclude at the pre-booked time to respect subsequent client slots.</span>
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-[#24212E]/10">
            <h2 className="font-display font-bold text-xl text-[#24212E] mb-3">
              3. Pay-What-You-Can / Sliding Scale
            </h2>
            <p>
              We operate an honest, dignity-centered Pay-What-You-Can sliding scale pricing model. Contributions are non-refundable once the consultation session has taken place.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-[#24212E]/10">
            <h2 className="font-display font-bold text-xl text-[#24212E] mb-3">
              4. Code of Conduct & Safety
            </h2>
            <p>
              Sessions are safe, judgment-free spaces. Any abusive, sexually inappropriate, threatening, or harmful behavior will result in the immediate termination of the session without refund and possible referral to authorities if required by law.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
