"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Heart } from "lucide-react";

export default function PayWhatYouCanSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-padding relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #6D4EC9 0%, #A78BFA 50%, #FFD8C5 100%)",
      }}
      aria-labelledby="pwyc-heading"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FFD8C5]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5" fill="white" />
            Pay What You Can
          </div>

          <h2
            id="pwyc-heading"
            className="font-display text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Your well-being shouldn&apos;t depend{" "}
            <span className="text-[#FFD8C5]">on your wallet.</span>
          </h2>

          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Choose a contribution amount you&apos;re comfortable with. The same care
            and respect are offered regardless of what you contribute. Mental health
            support should be accessible to everyone.
          </p>

          {/* Example amounts */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["₹100", "₹300", "₹500", "₹1,000+", "You choose"].map(
              (amount, i) => (
                <motion.div
                  key={amount}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="bg-white/20 backdrop-blur-sm text-white font-semibold text-sm px-4 py-2 rounded-full border border-white/30"
                >
                  {amount}
                </motion.div>
              )
            )}
          </div>

          <Link
            href="/book"
            className="group inline-flex items-center gap-2 bg-white text-[#6D4EC9] font-bold text-base px-8 py-4 rounded-2xl hover:bg-[#F0E9FF] transition-all shadow-[0_4px_24px_0_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Find Your Session
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-white/50 text-xs mt-5">
            No judgment. No questions asked about your financial situation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
