"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, FileText, CreditCard, Video } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Calendar,
    title: "Pick a time that works for you",
    desc: "Browse real-time availability and choose a date and slot that fits your schedule — no phone calls needed.",
    color: "#F0E9FF",
    iconColor: "#A78BFA",
  },
  {
    number: "02",
    icon: FileText,
    title: "Tell me a little about yourself",
    desc: "Share what's been on your mind in a private, secure form. No pressure to find the perfect words.",
    color: "#FFE4EF",
    iconColor: "#F472B6",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Pay what you comfortably can",
    desc: "Choose a contribution you're comfortable with. The same care and respect are offered regardless.",
    color: "#B8E9D1",
    iconColor: "#34D399",
  },
  {
    number: "04",
    icon: Video,
    title: "Receive your confirmation & join online",
    desc: "Get instant email confirmation with your session details and a secure link to join.",
    color: "#FFD8C5",
    iconColor: "#FB923C",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-padding bg-white relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Decorative blob */}
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#F0E9FF] rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-[#F0E9FF] text-[#6D4EC9] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
            Simple process
          </div>
          <h2
            id="how-it-works-heading"
            className="font-display text-4xl md:text-5xl font-bold text-[#24212E] mb-4"
          >
            How it{" "}
            <span className="text-gradient">works</span>
          </h2>
          <p className="text-[#24212E]/60 text-lg max-w-lg mx-auto">
            Booking your first session takes less than 5 minutes. Here&apos;s what to expect.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop only) */}
          <div className="absolute top-[3.5rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#A78BFA]/30 to-transparent hidden lg:block pointer-events-none" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                {/* Number chip */}
                <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: step.color }}>
                  <Icon className="w-6 h-6" style={{ color: step.iconColor }} />
                </div>
                <p className="text-[#A78BFA]/40 font-display font-bold text-xs mb-2 tracking-widest">
                  {step.number}
                </p>
                <h3 className="font-display font-bold text-lg text-[#24212E] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[#24212E]/55 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
