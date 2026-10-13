import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy & Confidentiality Policy — GenZee Psychologist",
  description:
    "How we protect your psychological consultation records, personal data, and confidentiality.",
};

export default function PrivacyPage() {
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
          <div className="w-10 h-10 rounded-xl bg-[#B8E9D1]/40 flex items-center justify-center text-[#24212E]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#24212E]">
            Privacy & Confidentiality
          </h1>
        </div>
        <p className="text-xs text-[#24212E]/50 mb-10">Last updated: October 2026</p>

        <div className="prose prose-zinc max-w-none space-y-8 text-[#24212E]/80 text-sm sm:text-base leading-relaxed">
          <section className="p-6 rounded-2xl bg-white border border-[#24212E]/10">
            <div className="flex items-center gap-2 mb-2 text-[#6D4EC9] font-semibold text-xs tracking-wider uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>Strict Therapist-Client Privilege</span>
            </div>
            <h2 className="font-display font-bold text-xl text-[#24212E] mb-3">
              1. The Principle of Confidentiality
            </h2>
            <p>
              Everything discussed within a consultation session remains strictly confidential between you and the psychologist. No session content or intake descriptions are ever shared with parents, partners, employers, or third parties without your explicit written consent.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-[#24212E]/10">
            <div className="flex items-center gap-2 mb-2 text-[#6D4EC9] font-semibold text-xs tracking-wider uppercase">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Legal Limits</span>
            </div>
            <h2 className="font-display font-bold text-xl text-[#24212E] mb-3">
              2. Exceptions to Confidentiality
            </h2>
            <p className="mb-2">
              In accordance with professional psychological ethics and law, confidentiality may only be breached under the following critical circumstances:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-sm text-[#24212E]/70">
              <li>There is clear, immediate risk of serious physical harm or suicide to yourself.</li>
              <li>There is imminent risk of harm to an identifiable other person.</li>
              <li>Mandatory legal disclosure orders from a court of law.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-[#24212E]/10">
            <h2 className="font-display font-bold text-xl text-[#24212E] mb-3">
              3. Data Retention & Security
            </h2>
            <p>
              Your personal contact details and intake notes are stored on encrypted, access-restricted databases. We do not sell, rent, or monetize your personal data. Payments are processed securely via PCI-DSS compliant gateways (Razorpay) and credit card data is never stored on our servers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
