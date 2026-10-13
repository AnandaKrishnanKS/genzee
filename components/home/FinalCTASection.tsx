"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-padding bg-white relative overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-gradient-to-b from-[#F0E9FF] to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-5xl mb-6" aria-hidden>💜</div>
          <h2
            id="final-cta-heading"
            className="font-display text-4xl md:text-5xl xl:text-6xl font-bold text-[#24212E] mb-5 leading-tight"
          >
            Your story matters.{" "}
            <span className="text-gradient">Ready to talk?</span>
          </h2>
          <p className="text-[#24212E]/60 text-lg leading-relaxed mb-10 max-w-md mx-auto">
            Taking the first step is often the hardest part. We&apos;re here whenever
            you&apos;re ready — no rush, no pressure.
          </p>
          <Link
            href="/book"
            className="group inline-flex items-center justify-center gap-3 bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-200 shadow-[0_6px_28px_0_rgba(167,139,250,0.45)] hover:shadow-[0_8px_36px_0_rgba(167,139,250,0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Book Your Session
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-[#24212E]/35 text-sm mt-5">
            Free to browse. No account required. Pay what you can.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
