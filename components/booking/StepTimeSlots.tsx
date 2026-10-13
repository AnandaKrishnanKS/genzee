"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface Slot {
  startUtc: string;
  endUtc: string;
  label: string;
}

interface StepTimeSlotsProps {
  date: string;
  clientTimezone?: string;
  selectedSlot?: Slot;
  onSelect: (slot: Slot) => void;
  onBack: () => void;
}

function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export default function StepTimeSlots({
  date,
  clientTimezone,
  selectedSlot,
  onSelect,
  onBack,
}: StepTimeSlotsProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tz = clientTimezone ?? getUserTimezone();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/availability/slots?date=${date}&timezone=${encodeURIComponent(tz)}`)
      .then((r) => r.json())
      .then((data: { slots: Slot[] }) => setSlots(data.slots))
      .catch(() => setError("Failed to load time slots. Please try again."))
      .finally(() => setLoading(false));
  }, [date, tz]);

  const displayDate = format(parseISO(date), "EEEE, MMMM d, yyyy");

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#6D4EC9] text-sm font-medium mb-5 hover:text-[#A78BFA] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Change date
      </button>

      <h2 className="font-display text-2xl font-bold text-[#24212E] mb-1">
        Pick a time
      </h2>
      <p className="text-[#24212E]/55 text-sm mb-2">
        {displayDate}
      </p>
      <p className="flex items-center gap-1.5 text-[#24212E]/40 text-xs mb-7">
        <Clock className="w-3.5 h-3.5" />
        Times shown in {tz}
      </p>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-[#F0E9FF]/60 animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-[#24212E]/50">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
            className="mt-3 text-[#6D4EC9] font-semibold text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && slots.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#F0E9FF]">
          <div className="text-4xl mb-3">😔</div>
          <p className="font-semibold text-[#24212E] mb-2">
            No slots available on this date
          </p>
          <p className="text-[#24212E]/50 text-sm mb-5">
            Please go back and pick another date.
          </p>
          <button
            onClick={onBack}
            className="text-[#6D4EC9] font-semibold text-sm"
          >
            ← Choose a different date
          </button>
        </div>
      )}

      {!loading && !error && slots.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {slots.map((slot, i) => {
            const isSelected = selectedSlot?.startUtc === slot.startUtc;
            return (
              <motion.button
                key={slot.startUtc}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onSelect(slot)}
                aria-selected={isSelected}
                className={cn(
                  "py-3.5 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150 text-center",
                  isSelected
                    ? "bg-[#A78BFA] border-[#A78BFA] text-white shadow-[0_4px_14px_0_rgba(167,139,250,0.4)]"
                    : "bg-white border-[#F0E9FF] text-[#24212E] hover:border-[#A78BFA] hover:bg-[#F0E9FF]/50"
                )}
              >
                {slot.label}
              </motion.button>
            );
          })}
        </div>
      )}

      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex justify-end"
        >
          <button
            onClick={() => onSelect(selectedSlot)}
            className="bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(167,139,250,0.35)]"
          >
            Continue →
          </button>
        </motion.div>
      )}
    </div>
  );
}
