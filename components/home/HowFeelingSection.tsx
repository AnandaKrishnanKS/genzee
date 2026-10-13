"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const feelings = [
  {
    emoji: "😮‍💨",
    title: "Feeling Overwhelmed",
    desc: "When everything feels like too much and you can't catch your breath.",
    color: "#F0E9FF",
    accent: "#A78BFA",
  },
  {
    emoji: "🔥",
    title: "Stress & Burnout",
    desc: "Exhausted, unmotivated, running on empty — it's more than just being tired.",
    color: "#FFE4EF",
    accent: "#F472B6",
  },
  {
    emoji: "💞",
    title: "Relationship Concerns",
    desc: "Navigating friendships, family dynamics, or romantic relationships.",
    color: "#FFD8C5",
    accent: "#FB923C",
  },
  {
    emoji: "🪞",
    title: "Self-Esteem",
    desc: "How you see yourself matters. Let's explore what's getting in the way.",
    color: "#B8E9D1",
    accent: "#34D399",
  },
  {
    emoji: "🚀",
    title: "Life Transitions",
    desc: "New city, new job, new chapter — change is hard, even when it's good.",
    color: "#FFF3ED",
    accent: "#FBBF24",
  },
  {
    emoji: "🌊",
    title: "Emotional Well-being",
    desc: "Understanding your emotions and building a healthier relationship with them.",
    color: "#EDE9FE",
    accent: "#7C3AED",
  },
];

export default function HowFeelingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-padding bg-[#FFF9F3] relative overflow-hidden"
      aria-labelledby="feelings-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-block bg-[#B8E9D1] text-[#24212E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
            What brings you here?
          </div>
          <h2
            id="feelings-heading"
            className="font-display text-4xl md:text-5xl font-bold text-[#24212E] mb-4"
          >
            How are you feeling{" "}
            <span className="text-gradient-warm">lately?</span>
          </h2>
          <p className="text-[#24212E]/60 text-lg max-w-xl mx-auto">
            No matter what brings you here, you&apos;re welcome. Here are some
            of the things we can explore together.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feelings.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="group p-6 rounded-[1.5rem] border border-transparent hover:border-white card-hover cursor-default h-full"
                style={{ backgroundColor: item.color }}
              >
                <div className="text-4xl mb-4" aria-hidden>{item.emoji}</div>
                <h3
                  className="font-display font-bold text-lg text-[#24212E] mb-2"
                  style={{ color: item.accent === "#A78BFA" ? "#6D4EC9" : item.accent }}
                >
                  {item.title}
                </h3>
                <p className="text-[#24212E]/65 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-[#24212E]/40 text-sm mt-8"
        >
          This is not an exhaustive list. You don&apos;t need a specific reason to reach out.
        </motion.p>
      </div>
    </section>
  );
}
