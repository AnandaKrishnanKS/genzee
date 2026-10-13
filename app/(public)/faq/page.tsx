import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import FAQPreviewSection from "@/components/home/FAQPreviewSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — GenZee Psychologist",
  description:
    "Everything you need to know about sessions, online consultations, privacy, payment options, and how therapy works.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/20 text-[#6D4EC9] text-xs font-semibold mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got questions? We've got clear answers.</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#24212E] tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#24212E]/70 text-lg max-w-2xl mx-auto">
            Everything you need to know before booking your first session. No complicated jargon or gatekeeping.
          </p>
        </div>
      </section>

      <FAQPreviewSection />

      <section className="py-16 px-6 bg-white/60 border-t border-[#24212E]/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl text-[#24212E] mb-3">
            Still have questions?
          </h2>
          <p className="text-[#24212E]/70 mb-6">
            Feel free to reach out via our contact page or email us directly at{" "}
            <a href="mailto:hello@genzee-psychologist.com" className="text-[#6D4EC9] font-medium underline">
              hello@genzee-psychologist.com
            </a>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6D4EC9] text-white font-medium shadow-md hover:bg-[#583CA8] transition-all"
            >
              <span>Book a Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#24212E]/15 text-[#24212E] font-medium hover:bg-black/5 transition-all"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
