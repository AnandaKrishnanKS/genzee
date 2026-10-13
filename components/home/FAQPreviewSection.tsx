"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "Do I need a referral to book a session?",
    a: "No referral needed. You can book directly through this website. Just pick a time that works for you.",
  },
  {
    q: "How does the pay-what-you-can model work?",
    a: "You choose the amount you'd like to contribute — there's no fixed price. Whether you can contribute ₹100 or ₹1,000, you'll receive the same quality of care and attention.",
  },
  {
    q: "Are sessions really confidential?",
    a: "Yes. Everything you share in your session is kept strictly private. Exceptions only exist in rare situations where safety is at risk, and these are explained during consent.",
  },
  {
    q: "What happens in the first session?",
    a: "The first session is a gentle conversation — a chance for us to get to know each other. There's no pressure to share everything at once. We'll go at your pace.",
  },
  {
    q: "Can I reschedule or cancel?",
    a: "Yes. You can reschedule or cancel through the link in your booking confirmation email. Please see the cancellation policy for full details.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#F0E9FF] rounded-2xl overflow-hidden bg-white/70">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#F0E9FF]/40 transition-colors"
      >
        <span className="font-display font-semibold text-[#24212E] text-base leading-snug">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-7 h-7 rounded-full bg-[#F0E9FF] flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-[#6D4EC9]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5">
              <p className="text-[#24212E]/65 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPreviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-padding bg-[#FFF9F3]"
      aria-labelledby="faq-preview-heading"
    >
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-[#FFD8C5] text-[#24212E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
            Questions
          </div>
          <h2
            id="faq-preview-heading"
            className="font-display text-4xl md:text-5xl font-bold text-[#24212E] mb-4"
          >
            Got questions?{" "}
            <span className="text-gradient-warm">We&apos;ve got answers.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/faq"
            className="group inline-flex items-center gap-2 text-[#6D4EC9] font-bold hover:text-[#A78BFA] transition-colors"
          >
            View all questions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
