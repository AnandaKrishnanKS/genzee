"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, Mail, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import type { BookingData } from "./BookingWizard";

interface BookingConfirmationProps {
  data: BookingData;
  onReset: () => void;
}

export default function BookingConfirmation({ data, onReset }: BookingConfirmationProps) {
  const slotDate = data.selectedSlot
    ? format(parseISO(data.selectedSlot.startUtc), "EEEE, MMMM d, yyyy")
    : "";

  const firstName = data.clientDetails?.name.split(" ")[0] ?? "there";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-[#B8E9D1] rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-[#34D399]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#24212E] mb-2">
          You did it! Your session is booked. 💜
        </h2>
        <p className="text-[#24212E]/60 mb-8">
          Hey {firstName}! We&apos;ll send your confirmation to{" "}
          <strong>{data.clientDetails?.email}</strong>. Check your inbox for all the details.
        </p>

        {/* Details card */}
        <div className="bg-white rounded-2xl border border-[#F0E9FF] shadow-[0_2px_16px_0_rgba(36,33,46,0.06)] p-6 mb-6 text-left">
          <h3 className="font-display font-bold text-[#24212E] mb-4">Session Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F0E9FF] rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[#6D4EC9]" />
              </div>
              <div>
                <p className="text-xs text-[#24212E]/40 font-medium">Date</p>
                <p className="font-semibold text-[#24212E]">{slotDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F0E9FF] rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#6D4EC9]" />
              </div>
              <div>
                <p className="text-xs text-[#24212E]/40 font-medium">Time</p>
                <p className="font-semibold text-[#24212E]">
                  {data.selectedSlot?.label} ({data.clientDetails?.timezone})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B8E9D1] rounded-lg flex items-center justify-center shrink-0">
                <span className="text-base">💜</span>
              </div>
              <div>
                <p className="text-xs text-[#24212E]/40 font-medium">Contribution</p>
                <p className="font-semibold text-[#24212E]">
                  {data.paymentStatus === "free"
                    ? "Free session"
                    : data.amountPaise
                    ? formatCurrency(data.amountPaise)
                    : "—"}
                </p>
              </div>
            </div>

            {data.reference && (
              <div className="flex items-center gap-3 pt-3 border-t border-[#F0E9FF]">
                <div>
                  <p className="text-xs text-[#24212E]/40 font-medium">Booking Reference</p>
                  <p className="font-bold text-[#6D4EC9] font-mono">{data.reference}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email notice */}
        <div className="flex items-start gap-3 bg-[#F0E9FF]/60 rounded-xl p-4 text-left mb-6">
          <Mail className="w-4 h-4 text-[#6D4EC9] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#24212E] mb-0.5">Check your inbox</p>
            <p className="text-sm text-[#24212E]/60">
              We&apos;ve sent a confirmation to {data.clientDetails?.email}. You&apos;ll also receive
              a reminder 24 hours before your session and 1 hour before. Your joining link
              will be included when it&apos;s assigned.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border-2 border-[#F0E9FF] text-[#24212E]/60 font-semibold text-sm hover:border-[#A78BFA]/30 transition-all"
          >
            Return Home
          </Link>
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F0E9FF] text-[#6D4EC9] font-semibold text-sm hover:bg-[#A78BFA]/10 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Book Another Session
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
