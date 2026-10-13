import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Users, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Meet Your Psychologist",
  description:
    "Learn about [Psychologist Name], a registered psychologist offering online consultations with a warm, evidence-based, and inclusive approach.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-[#F0E9FF] via-[#FFF9F3] to-[#FFE4EF] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A78BFA]/10 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-[#F0E9FF] text-[#6D4EC9] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                About Me
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-[#24212E] mb-6 leading-tight">
                Hi, I&apos;m{" "}
                <span className="text-[#A78BFA]">[Psychologist Name]</span> 👋
              </h1>
              <p className="text-[#24212E]/65 text-lg leading-relaxed mb-6">
                I&apos;m a registered psychologist working with young adults who are
                navigating some of life&apos;s toughest moments — whether that&apos;s
                stress, self-doubt, burnout, relationship challenges, or simply
                feeling lost. I believe everyone deserves access to thoughtful,
                non-judgmental support.
              </p>
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold px-7 py-4 rounded-2xl transition-all shadow-[0_4px_20px_0_rgba(167,139,250,0.4)]"
              >
                Book a Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Portrait */}
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFD8C5] rounded-[3rem] rotate-3 scale-[0.96]" />
                <div className="relative w-80 aspect-[3/4] bg-gradient-to-br from-[#F0E9FF] to-[#FFE4EF] rounded-[3rem] border-4 border-white shadow-[0_8px_48px_0_rgba(167,139,250,0.2)] flex flex-col items-center justify-center overflow-hidden">
                  <div className="text-8xl mb-4">🌸</div>
                  <div className="bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl text-center mx-4">
                    <p className="font-display font-bold text-[#24212E]">[Psychologist Name]</p>
                    <p className="text-[#6D4EC9] text-sm">M.A., M.Phil. Psychology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-block bg-[#FFD8C5] text-[#24212E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            My Story
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#24212E] mb-6">
            Why I do this work
          </h2>
          <div className="prose prose-lg text-[#24212E]/70 max-w-none space-y-5">
            <p>
              [Psychologist Name&apos;s personal story goes here. Share what drew them to
              psychology, any personal experiences that shaped their approach, and
              their core belief about mental health care. Keep it authentic and
              warm — in their own voice.]
            </p>
            <p>
              [Continue with their journey — education, training, the populations
              they&apos;ve worked with, and what they learned along the way.]
            </p>
            <p>
              [Explain the pay-what-you-can model — why they chose it, what it
              means to them, and what they hope it enables.]
            </p>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section-padding bg-[#FFF9F3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#F0E9FF] text-[#6D4EC9] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Qualifications
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#24212E]">
              Education & Professional Registration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: "M.Phil. Applied Psychology",
                sub: "[University Name] · [Year]",
                color: "#F0E9FF",
                iconColor: "#A78BFA",
              },
              {
                icon: BookOpen,
                title: "M.A. Psychology",
                sub: "[University Name] · [Year]",
                color: "#FFE4EF",
                iconColor: "#F472B6",
              },
              {
                icon: Heart,
                title: "B.A. (Hons.) Psychology",
                sub: "[University Name] · [Year]",
                color: "#B8E9D1",
                iconColor: "#34D399",
              },
              {
                icon: Users,
                title: "RCI Registration",
                sub: "Rehabilitation Council of India · [Reg. No.]",
                color: "#FFD8C5",
                iconColor: "#FB923C",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-5 rounded-2xl card-hover"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" style={{ color: item.iconColor }} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-[#24212E]">{item.title}</p>
                    <p className="text-[#24212E]/60 text-sm">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-block bg-[#B8E9D1] text-[#24212E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            My Approach
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#24212E] mb-6">
            What to expect from a session
          </h2>
          <div className="space-y-5 text-[#24212E]/70 leading-relaxed">
            <p>
              Every session begins with you — where you&apos;re at, what&apos;s on your mind,
              and what feels important right now. There&apos;s no agenda, no checklist,
              no rush. I work collaboratively, which means we figure things out together.
            </p>
            <p>
              My approach draws on evidence-based frameworks including Cognitive
              Behavioural Therapy (CBT), mindfulness practices, and person-centred
              principles. I adapt my style to what works best for you — not the
              other way around.
            </p>
            <p>
              Sessions are fully online, held via a secure video call platform. All
              you need is a private space and a stable internet connection.
            </p>
          </div>

          {/* Languages */}
          <div className="mt-8 p-5 bg-[#F0E9FF] rounded-2xl flex items-start gap-4">
            <Globe className="w-5 h-5 text-[#6D4EC9] mt-0.5 shrink-0" />
            <div>
              <p className="font-display font-semibold text-[#24212E] mb-1">Languages</p>
              <p className="text-[#24212E]/65 text-sm">
                Sessions available in <strong>English</strong> and <strong>Hindi</strong>.
                [Add additional languages if applicable.]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[#F0E9FF]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="text-4xl mb-5">💜</div>
          <h2 className="font-display text-3xl font-bold text-[#24212E] mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#24212E]/65 mb-8">
            Booking takes less than 5 minutes. No referral needed.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_4px_20px_0_rgba(167,139,250,0.4)]"
          >
            Book a Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
