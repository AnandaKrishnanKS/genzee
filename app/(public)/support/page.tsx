import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Phone, Globe, ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Emergency & Crisis Resources — GenZee Psychologist",
  description:
    "Free, 24/7 crisis support, suicide prevention helplines, and emergency mental health contacts.",
};

const helplines = [
  {
    name: "Tele-MANAS (Govt of India)",
    phone: "14416 / 1800-891-4416",
    hours: "24/7, Toll-Free",
    language: "Multiple Indian Languages",
    desc: "National tele-mental health programme providing comprehensive mental health care services.",
  },
  {
    name: "KIRAN Mental Health Helpline",
    phone: "1800-599-0019",
    hours: "24/7, Toll-Free",
    language: "13 Languages",
    desc: "Dedicated 24/7 helpline by Ministry of Social Justice and Empowerment for psychological support and crisis management.",
  },
  {
    name: "iCall (TISS Mumbai)",
    phone: "9152987821",
    hours: "Monday to Saturday, 10:00 AM – 8:00 PM",
    language: "English, Hindi, Marathi",
    desc: "Psychosocial helpline run by the School of Human Ecology at Tata Institute of Social Sciences.",
  },
  {
    name: "Vandrevala Foundation",
    phone: "9999 666 555",
    hours: "24/7 Free Support",
    language: "Multiple Indian Languages",
    desc: "Free counseling and crisis response over phone and WhatsApp for emotional distress and depression.",
  },
  {
    name: "National Emergency Helpline",
    phone: "112",
    hours: "24/7 Immediate Dispatch",
    language: "All",
    desc: "Pan-India single emergency response number for police, ambulance, and life-threatening emergencies.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F3] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D4EC9] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Warning Banner */}
        <div className="p-6 rounded-[1.5rem] bg-[#FFD8C5]/40 border-2 border-[#FFD8C5] mb-12 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFD8C5] flex items-center justify-center text-[#24212E] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-[#24212E] mb-1">
              Important: This Service is Not for Emergencies
            </h1>
            <p className="text-[#24212E]/80 text-sm leading-relaxed">
              GenZee Psychologist is an appointment-only online consultation service. We do not provide immediate emergency response or acute psychiatric care. If you or someone you know is in acute distress or having thoughts of self-harm, please connect with the free emergency resources below immediately.
            </p>
          </div>
        </div>

        {/* Helpline List */}
        <h2 className="font-display font-bold text-2xl text-[#24212E] mb-6">
          Free Verified Crisis Helplines
        </h2>

        <div className="space-y-4 mb-12">
          {helplines.map((item) => (
            <div
              key={item.name}
              className="p-6 rounded-[1.5rem] bg-white border border-[#24212E]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-display font-bold text-lg text-[#24212E] mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#24212E]/60 mb-2">{item.desc}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-[#A78BFA]/10 text-[#6D4EC9] font-medium">
                    {item.hours}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#B8E9D1]/30 text-[#24212E] font-medium">
                    {item.language}
                  </span>
                </div>
              </div>
              <a
                href={`tel:${item.phone.replace(/[^0-9]/g, "")}`}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#24212E] text-white font-bold text-sm hover:bg-[#6D4EC9] transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call {item.phone}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-white/70 border border-[#24212E]/10 text-center">
          <p className="text-xs text-[#24212E]/60">
            For individuals outside India, please locate your local crisis hotline via{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6D4EC9] font-medium underline inline-flex items-center gap-1"
            >
              findahelpline.com <Globe className="w-3 h-3 inline" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
