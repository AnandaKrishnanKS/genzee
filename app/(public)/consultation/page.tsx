import type { Metadata } from "next";
import Link from "next/link";
import { Video, Clock, Globe, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Consultations — How It Works",
  description:
    "Learn about online psychological consultations with GenZee Psychologist. Fully online, flexible, and confidential sessions at a price you choose.",
};

export default function ConsultationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-[#FFF9F3] to-[#F0E9FF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-[#F0E9FF] text-[#6D4EC9] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            Online Consultations
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[#24212E] mb-6 leading-tight">
            Support that fits{" "}
            <span className="text-gradient">your life</span>
          </h1>
          <p className="text-[#24212E]/65 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Fully online, one-to-one psychological consultations. No commute, no
            waiting rooms — just an honest conversation from wherever you feel most
            comfortable.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_4px_20px_0_rgba(167,139,250,0.4)]"
          >
            Book a Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#24212E] mb-4">
              What happens in a session?
            </h2>
            <p className="text-[#24212E]/60 max-w-xl mx-auto">
              Sessions are 50 minutes long, held via a secure video conferencing platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Video,
                title: "Video Call",
                desc: "Sessions take place over a secure video link sent to you by email before your appointment. No account registration required.",
                color: "#F0E9FF",
                iconColor: "#A78BFA",
              },
              {
                icon: Clock,
                title: "50-Minute Sessions",
                desc: "Each session is 50 minutes. There's no fixed agenda — we work at your pace and focus on what matters most to you today.",
                color: "#FFE4EF",
                iconColor: "#F472B6",
              },
              {
                icon: Globe,
                title: "Available Online",
                desc: "You can connect from anywhere with a stable internet connection. Available to clients across India and internationally.",
                color: "#B8E9D1",
                iconColor: "#34D399",
              },
              {
                icon: ShieldCheck,
                title: "Strictly Confidential",
                desc: "Everything shared in your session is kept private. Your details are stored securely and never shared without your consent.",
                color: "#FFD8C5",
                iconColor: "#FB923C",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-7 rounded-[1.5rem] card-hover"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" style={{ color: item.iconColor }} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#24212E] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#24212E]/65 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Areas of Practice */}
      <section className="section-padding bg-[#FFF9F3]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-[#24212E] mb-4">
              Areas of Practice
            </h2>
            <p className="text-[#24212E]/60">
              Some of the areas I regularly support people with:
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Stress & Anxiety",
              "Emotional Well-being",
              "Self-esteem & Identity",
              "Burnout",
              "Relationship Challenges",
              "Life Transitions",
              "Grief & Loss",
              "Academic Pressure",
              "Work-Life Balance",
              "Loneliness & Isolation",
            ].map((area) => (
              <span
                key={area}
                className="bg-white border border-[#A78BFA]/20 text-[#6D4EC9] font-medium px-4 py-2 rounded-full text-sm shadow-sm"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="text-center text-[#24212E]/40 text-sm mt-6">
            This is not an exhaustive list. If you&apos;re unsure if this is right for
            you, please reach out via the contact page.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-gradient-to-br from-[#6D4EC9] to-[#A78BFA]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5">
            Pay what you can
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            There&apos;s no fixed session fee. You choose a contribution that feels right
            for your financial situation. The same care and attention are offered at
            every contribution level — no questions asked.
          </p>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-display font-bold text-white mb-3">
              Minimum contribution: ₹100
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              A small minimum helps cover the cost of running the platform. Free sessions
              are available in limited circumstances — please reach out to discuss.
            </p>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-white text-[#6D4EC9] font-bold px-8 py-4 rounded-2xl hover:bg-[#F0E9FF] transition-all shadow-lg"
          >
            Book Your Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Important Notes */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-2xl font-bold text-[#24212E] mb-6">
            Important to know
          </h2>
          <div className="space-y-4">
            {[
              "These are psychological consultations, not medical treatment or psychiatric services.",
              "This service is for adults aged 18 and over.",
              "This is not an emergency or crisis service. If you are in immediate danger, please call 112.",
              "Sessions are fully online — you will need a stable internet connection and a private space.",
              "Your first session does not commit you to any ongoing arrangement.",
            ].map((note) => (
              <div key={note} className="flex items-start gap-3 p-4 bg-[#FFF9F3] rounded-xl">
                <span className="text-[#A78BFA] font-bold mt-0.5">•</span>
                <p className="text-[#24212E]/70 text-sm leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
