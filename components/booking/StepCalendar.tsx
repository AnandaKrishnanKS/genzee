"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isBefore,
  isSameDay,
  parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface StepCalendarProps {
  selectedDate?: string;
  onSelect: (date: string) => void;
}

export default function StepCalendar({ selectedDate, onSelect }: StepCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setLoading(true);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    fetch(`/api/availability/dates?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((data: { availableDates: string[] }) => {
        setAvailableDates(new Set(data.availableDates));
      })
      .catch(() => setAvailableDates(new Set()))
      .finally(() => setLoading(false));
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const prevMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const isDisabled = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const isPast = isBefore(day, today) && !isSameDay(day, today);
    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
    return isPast || !isCurrentMonth || (loading ? false : !availableDates.has(dateStr));
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-[#24212E] mb-2">
        Pick a date
      </h2>
      <p className="text-[#24212E]/55 text-sm mb-7">
        Choose a date that works for you. Times shown in your local timezone.
      </p>

      <div className="bg-white rounded-2xl shadow-[0_2px_16px_0_rgba(36,33,46,0.06)] border border-[#F0E9FF] overflow-hidden">
        {/* Calendar header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F0E9FF]">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            disabled={isBefore(monthStart, today)}
            className="w-9 h-9 rounded-full hover:bg-[#F0E9FF] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-[#24212E]" />
          </button>
          <h3 className="font-display font-bold text-[#24212E]">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="w-9 h-9 rounded-full hover:bg-[#F0E9FF] flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#24212E]" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 px-4 py-3">
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold text-[#24212E]/40 uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 px-4 pb-5">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate === dateStr;
            const isOtherMonth = day.getMonth() !== currentMonth.getMonth();
            const disabled = isDisabled(day);
            const available = availableDates.has(dateStr) && !disabled;

            return (
              <motion.button
                key={dateStr}
                whileTap={disabled ? {} : { scale: 0.9 }}
                onClick={() => !disabled && onSelect(dateStr)}
                disabled={disabled}
                aria-label={format(day, "EEEE, MMMM d, yyyy")}
                aria-selected={isSelected}
                className={cn(
                  "calendar-day relative text-sm font-medium w-full py-2",
                  isOtherMonth && "opacity-0 pointer-events-none",
                  disabled && "calendar-day--disabled",
                  isSelected && "calendar-day--selected",
                  isToday && !isSelected && "calendar-day--today",
                  available && !isSelected && "calendar-day--available",
                  loading && !disabled && "animate-pulse bg-[#F0E9FF]/50"
                )}
              >
                {format(day, "d")}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="px-5 pb-5 flex items-center gap-5 text-xs text-[#24212E]/50">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#B8E9D1]" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#A78BFA]" />
            Selected
          </span>
        </div>
      </div>
    </div>
  );
}
