import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Clock,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Socials — GenZee Psychologist",
  description:
    "Get in touch directly or connect across our socials: Instagram, YouTube, X, and Facebook.",
};

const socialPlatforms = [
  {
    name: "Instagram",
    handle: "@genzee.psychologist",
    href: "https://instagram.com",
    tag: "Most active! 📸",
    tagColor: "bg-[#DD2A7B]/15 text-[#DD2A7B] border-[#DD2A7B]/30",
    bgClass: "hover:border-[#DD2A7B]/40 hover:bg-gradient-to-br hover:from-white hover:to-[#FFF0F5]",
    iconBg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-md shadow-[#DD2A7B]/30",
    description: "Daily wholesome check-ins, bite-sized psychoeducation reels & mental health reminders.",
    icon: (
      <svg className="w-5 h-5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    handle: "@GenZeePsych",
    href: "https://youtube.com",
    tag: "Watch & Chill 🍿",
    tagColor: "bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/20",
    bgClass: "hover:border-[#FF0000]/40 hover:bg-gradient-to-br hover:from-white hover:to-[#FFF5F5]",
    iconBg: "bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30",
    description: "Chill video essays, guided breathwork sessions, and thoughtful mental health deep-dives.",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    handle: "@genzeepsych",
    href: "https://x.com",
    tag: "Spill the tea 🍵",
    tagColor: "bg-[#24212E]/10 text-[#24212E] border-[#24212E]/20",
    bgClass: "hover:border-[#24212E]/40 hover:bg-gradient-to-br hover:from-white hover:to-[#F5F3FF]",
    iconBg: "bg-[#24212E] text-white shadow-md shadow-[#24212E]/30",
    description: "Relatable late-night thoughts, unhinged therapy memes & threads on emotional boundaries.",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    handle: "/GenZeePsychology",
    href: "https://facebook.com",
    tag: "Community Space 💬",
    tagColor: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20",
    bgClass: "hover:border-[#1877F2]/40 hover:bg-gradient-to-br hover:from-white hover:to-[#F0F7FF]",
    iconBg: "bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/30",
    description: "Support circles, psychoeducation articles, event announcements & community updates.",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F3] py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/20 text-[#6D4EC9] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Say hi or slide into our DMs</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#24212E] tracking-tight mb-4">
            Get in Touch & Connect
          </h1>
          <p className="text-[#24212E]/70 text-lg max-w-xl mx-auto">
            Got questions about consultations, sliding-scale fees, or just want to vibe with us online? We&apos;re here for it.
          </p>
        </div>

        {/* Contact Cards: Direct Email & Emergency Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Direct Email */}
          <div className="p-8 rounded-[2rem] bg-white border border-[#24212E]/10 shadow-sm card-hover flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#A78BFA]/20 flex items-center justify-center text-[#6D4EC9] mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-xl text-[#24212E] mb-2">
                Direct Inquiries & Collabs
              </h2>
              <p className="text-sm text-[#24212E]/70 mb-4 leading-relaxed">
                For questions, press, rescheduling, or collaboration inquiries.
              </p>
              <a
                href="mailto:hello@genzee-psychologist.com"
                className="text-[#6D4EC9] font-semibold text-lg hover:underline block mb-2 break-all"
              >
                hello@genzee-psychologist.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#24212E]/50 pt-4 border-t border-[#24212E]/5">
              <Clock className="w-3.5 h-3.5" />
              <span>Replies within 24–48 hours (we don&apos;t ghost 👻)</span>
            </div>
          </div>

          {/* Card 2: Crisis Notice */}
          <div className="p-8 rounded-[2rem] bg-[#FFD8C5]/30 border border-[#FFD8C5] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFD8C5] flex items-center justify-center text-[#24212E] mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-xl text-[#24212E] mb-2">
                In an Urgent Crisis?
              </h2>
              <p className="text-sm text-[#24212E]/80 mb-4 leading-relaxed">
                We are an appointment-based consultation platform and not an emergency room. If you are in acute distress:
              </p>
              <div className="space-y-1.5 text-xs text-[#24212E]/90 mb-4 font-medium">
                <p>• <strong>National Emergency:</strong> 112</p>
                <p>• <strong>Tele-MANAS (24/7):</strong> 14416</p>
                <p>• <strong>iCall Helpline:</strong> 9152987821</p>
              </div>
            </div>
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D4EC9] underline hover:opacity-80 pt-2"
            >
              <span>View all emergency numbers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Cute Gen Z Socials Section */}
        <div className="rounded-[2.5rem] bg-white border border-[#24212E]/10 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24212E]/5 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8E9D1]/30 text-[#24212E] text-xs font-bold mb-2">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>Soft vibes & wholesome content</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#24212E] tracking-tight">
                Hang Out With Us Online ✨
              </h2>
            </div>
            <p className="text-xs text-[#24212E]/60 max-w-xs">
              No stiff clinical lectures. Just real talk, gentle reminders, and cozy mental health community.
            </p>
          </div>

          {/* Socials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {socialPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-6 rounded-[1.75rem] border border-[#24212E]/10 bg-[#FFF9F3]/40 transition-all duration-300 card-hover flex flex-col justify-between ${platform.bgClass}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${platform.iconBg}`}
                      >
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-[#24212E] group-hover:text-[#6D4EC9] transition-colors">
                          {platform.name}
                        </h3>
                        <span className="text-xs font-semibold text-[#24212E]/50 group-hover:text-[#6D4EC9] transition-colors">
                          {platform.handle}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${platform.tagColor}`}
                    >
                      {platform.tag}
                    </span>
                  </div>

                  <p className="text-xs text-[#24212E]/70 leading-relaxed mb-4">
                    {platform.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#6D4EC9] group-hover:translate-x-1 transition-transform">
                  <span>Follow & Vibe</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Booking CTA */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#6D4EC9] text-white text-center shadow-xl space-y-4">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
            Ready for your confidential session? 💜
          </h2>
          <p className="text-white/80 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Skip the back-and-forth emails. Pick a live date and time on our calendar, contribute what you can, and book your session in 2 minutes.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#6D4EC9] font-bold text-sm shadow-lg hover:bg-[#FFF9F3] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Book an Online Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
