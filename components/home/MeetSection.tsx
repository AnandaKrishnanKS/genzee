"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function MeetSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="section-padding bg-white relative overflow-hidden"
      aria-labelledby="meet-heading"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F0E9FF] rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image / Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Background shapes */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#F0E9FF] to-[#FFE4EF] rounded-[3rem] -rotate-2" />
              <div className="relative bg-white rounded-[2.5rem] p-6 shadow-[0_4px_32px_0_rgba(167,139,250,0.18)]">
                {/* Portrait placeholder */}
                <div className="w-full aspect-[3/4] bg-gradient-to-br from-[#F0E9FF] via-[#FFE4EF] to-[#FFD8C5] rounded-[2rem] mb-5 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="text-8xl mb-3">🌸</div>
                    <p className="text-[#6D4EC9] font-semibold text-sm">
                      Psychologist Portrait
                    </p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "M.A., M.Phil.", label: "Psychology" },
                    { value: "Online", label: "Sessions" },
                    { value: "Hindi & English", label: "Languages" },
                    { value: "RCI Reg.", label: "Professional" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-[#F0E9FF]/60 rounded-xl p-3 text-center"
                    >
                      <p className="font-display font-bold text-sm text-[#6D4EC9]">
                        {stat.value}
                      </p>
                      <p className="text-[#24212E]/50 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Label */}
            <div className="inline-block bg-[#FFD8C5] text-[#24212E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Meet your psychologist
            </div>

            <h2
              id="meet-heading"
              className="font-display text-4xl md:text-5xl font-bold text-[#24212E] mb-5 leading-tight"
            >
              Hey, I&apos;m{" "}
              <span className="text-[#A78BFA]">[Psychologist Name]!</span>
            </h2>

            <p className="text-[#24212E]/65 text-lg leading-relaxed mb-5">
              [Psychologist Name] is a registered psychologist with an M.A. and M.Phil.
              in Applied Psychology. She works with young adults navigating stress,
              emotional well-being, self-esteem, relationship concerns, and life transitions.
            </p>
            <p className="text-[#24212E]/65 leading-relaxed mb-7">
              Her approach is warm, collaborative, and rooted in evidence-based
              practices. Sessions are fully online — so you can connect from wherever
              you feel most comfortable. She believes accessible mental health care
              is not a privilege, which is why she operates on a pay-what-you-can model.
            </p>

            {/* Qualities */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "Non-judgmental",
                "Empathetic",
                "Evidence-based",
                "Culturally aware",
                "Bilingual",
              ].map((tag) => (
                <span
                  key={tag}
                  className="bg-[#F0E9FF] text-[#6D4EC9] text-sm font-medium px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-[#6D4EC9] font-bold hover:text-[#A78BFA] transition-colors"
            >
              Get to know me
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
