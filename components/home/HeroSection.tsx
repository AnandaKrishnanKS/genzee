"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const floatingShapes = [
  { color: "#A78BFA", size: 200, x: "75%", y: "15%", blur: 80, opacity: 0.25 },
  { color: "#FFD8C5", size: 260, x: "85%", y: "50%", blur: 100, opacity: 0.3 },
  { color: "#B8E9D1", size: 180, x: "5%", y: "70%", blur: 80, opacity: 0.25 },
  { color: "#FFE4EF", size: 150, x: "60%", y: "80%", blur: 60, opacity: 0.2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background blobs */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            backgroundColor: shape.color,
            filter: `blur(${shape.blur}px)`,
            opacity: shape.opacity,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Decorative sticker — top right */}
      <motion.div
        className="absolute top-32 right-8 md:right-24 text-4xl select-none pointer-events-none"
        animate={{ rotate: [0, 10, 0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        🌸
      </motion.div>
      <motion.div
        className="absolute bottom-24 left-8 text-3xl select-none pointer-events-none"
        animate={{ rotate: [0, -8, 0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden
      >
        ✨
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Label */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-[#F0E9FF] text-[#6D4EC9] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Online Psychological Consultations
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl xl:text-7xl font-bold text-[#24212E] leading-[1.1] mb-6"
            >
              Big feelings?{" "}
              <span className="relative inline-block">
                <span className="text-gradient">Let&apos;s talk</span>
                {/* Underline decoration */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 220 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M3 9C40 3 80 1 110 4C140 7 180 9 218 5"
                    stroke="#A78BFA"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {" "}about them.
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={itemVariants}
              className="text-[#24212E]/65 text-lg md:text-xl leading-relaxed mb-8 max-w-lg"
            >
              A welcoming space for honest conversations, personal growth, and
              psychological support — at your own pace.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/book"
                className="group inline-flex items-center justify-center gap-2 bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold text-base px-7 py-4 rounded-2xl transition-all duration-200 shadow-[0_4px_20px_0_rgba(167,139,250,0.45)] hover:shadow-[0_6px_28px_0_rgba(167,139,250,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Let&apos;s Talk
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#A78BFA]/30 text-[#6D4EC9] font-semibold text-base px-7 py-4 rounded-2xl hover:border-[#A78BFA] hover:bg-[#F0E9FF] transition-all duration-200"
              >
                Meet Your Psychologist
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center gap-5 text-sm text-[#24212E]/50"
            >
              {["100% Online", "Pay What You Can", "Private & Confidential"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                    {item}
                  </span>
                )
              )}
            </motion.div>
          </motion.div>

          {/* Right — Portrait card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            {/* Main card */}
            <div className="relative">
              {/* Background card (offset) */}
              <div className="absolute inset-0 bg-[#FFD8C5] rounded-[2.5rem] rotate-3 scale-[0.97]" />
              <div className="absolute inset-0 bg-[#A78BFA]/20 rounded-[2.5rem] -rotate-2 scale-[0.99]" />

              {/* Portrait */}
              <div className="relative w-80 md:w-96 aspect-[4/5] bg-[#F0E9FF] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-[0_8px_48px_0_rgba(167,139,250,0.25)]">
                {/* Placeholder gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F0E9FF] via-[#FFE4EF] to-[#FFD8C5] flex flex-col items-center justify-end pb-8">
                  {/* Silhouette */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-[#A78BFA]/15 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-[#A78BFA]/20 flex items-center justify-center">
                        <span className="text-7xl">🧠</span>
                      </div>
                    </div>
                  </div>

                  {/* Name tag */}
                  <div className="relative z-10 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-[#A78BFA]/20 text-center">
                    <p className="font-display font-bold text-[#24212E] text-lg">
                      [Psychologist Name]
                    </p>
                    <p className="text-[#6D4EC9] text-sm font-medium">
                      Psychologist · M.A., M.Phil.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badge — "Available" */}
              <motion.div
                className="absolute -top-4 -right-4 bg-[#B8E9D1] text-[#24212E] font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Taking new clients
              </motion.div>

              {/* Floating badge — sessions */}
              <motion.div
                className="absolute -bottom-4 -left-6 bg-white shadow-[0_4px_16px_0_rgba(36,33,46,0.1)] text-[#24212E] font-semibold text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <span className="text-xl">💜</span>
                Pay what you can
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
