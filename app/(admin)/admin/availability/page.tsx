"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldAlert,
  Sliders,
} from "lucide-react";

interface AvailabilityRule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface AvailabilityException {
  id: string;
  date: string;
  isBlocked: boolean;
  reason?: string;
}

interface Settings {
  professionalTimezone: string;
  sessionDurationMinutes: number;
  bufferMinutes: number;
  bookingLeadMinutes: number;
  maxAdvanceDays: number;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AdminAvailabilityPage() {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [settings, setSettings] = useState<Settings>({
    professionalTimezone: "Asia/Kolkata",
    sessionDurationMinutes: 50,
    bufferMinutes: 10,
    bookingLeadMinutes: 120,
    maxAdvanceDays: 60,
  });

  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");

  const loadData = () => {
    setLoading(true);
    fetch("/api/admin/availability")
      .then((res) => res.json())
      .then((data) => {
        if (data.rules) setRules(data.rules);
        if (data.exceptions) setExceptions(data.exceptions);
        if (data.settings) setSettings(data.settings);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRuleToggle = (dayOfWeek: number) => {
    setRules((prev) =>
      prev.map((r) =>
        r.dayOfWeek === dayOfWeek ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    val: string
  ) => {
    setRules((prev) =>
      prev.map((r) =>
        r.dayOfWeek === dayOfWeek ? { ...r, [field]: val } : r
      )
    );
  };

  const handleSaveSchedule = async () => {
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules, settings }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      console.error("Save schedule error:", err);
    }
  };

  const handleAddBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate) return;

    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "block",
          date: newBlockDate,
          reason: newBlockReason || "Leave / Vacation",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exceptions) setExceptions(data.exceptions);
        setNewBlockDate("");
        setNewBlockReason("");
      }
    } catch (err) {
      console.error("Block date error:", err);
    }
  };

  const handleUnblockDate = async (date: string) => {
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unblock", date }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exceptions) setExceptions(data.exceptions);
      }
    } catch (err) {
      console.error("Unblock date error:", err);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Update Available Sessions & Working Hours
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Configure your recurring weekly consultation schedule, session durations, and blackout vacation dates. Changes reflect immediately on the client booking calendar.
          </p>
        </div>

        <button
          onClick={handleSaveSchedule}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6D4EC9] hover:bg-[#583CA8] text-white text-sm font-semibold shadow-lg shadow-[#6D4EC9]/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Schedule updated successfully!</strong> The client booking wizard on <code>/book</code> has been refreshed with your new available sessions.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Recurring Working Hours */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#B8E9D1]" />
              <span>Weekly Recurring Consultation Hours</span>
            </h2>
            <span className="text-xs text-white/40">50 min session + 10 min buffer</span>
          </div>

          <div className="bg-[#24212E] border border-white/10 rounded-[1.75rem] p-6 space-y-4 shadow-xl">
            {rules.map((rule) => (
              <div
                key={rule.dayOfWeek}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                  rule.isActive
                    ? "bg-[#1A1824] border-white/10"
                    : "bg-white/[0.02] border-transparent opacity-60"
                }`}
              >
                {/* Day toggle */}
                <div className="flex items-center gap-3 min-w-[150px] mb-3 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={() => handleRuleToggle(rule.dayOfWeek)}
                    id={`day-${rule.dayOfWeek}`}
                    className="w-4 h-4 rounded text-[#6D4EC9] bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor={`day-${rule.dayOfWeek}`}
                    className="font-bold text-sm text-white cursor-pointer select-none"
                  >
                    {DAY_NAMES[rule.dayOfWeek]}
                  </label>
                  {rule.isActive ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/40 font-semibold">
                      Off
                    </span>
                  )}
                </div>

                {/* Hours inputs */}
                {rule.isActive ? (
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40">From:</span>
                      <input
                        type="time"
                        value={rule.startTime}
                        onChange={(e) =>
                          handleTimeChange(rule.dayOfWeek, "startTime", e.target.value)
                        }
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#A78BFA]"
                      />
                    </div>
                    <span className="text-white/30">to</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40">To:</span>
                      <input
                        type="time"
                        value={rule.endTime}
                        onChange={(e) =>
                          handleTimeChange(rule.dayOfWeek, "endTime", e.target.value)
                        }
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#A78BFA]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-white/30 italic">No sessions offered</div>
                )}
              </div>
            ))}
          </div>

          {/* Session Timing Parameters */}
          <div className="bg-[#24212E] border border-white/10 rounded-[1.75rem] p-6 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#A78BFA]" />
              <span>Session Duration & Lead Time Controls</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-white/60 mb-1.5 font-semibold">
                  Session Length (Minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionDurationMinutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sessionDurationMinutes: parseInt(e.target.value) || 50,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1824] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1.5 font-semibold">
                  Buffer Break (Minutes)
                </label>
                <input
                  type="number"
                  value={settings.bufferMinutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bufferMinutes: parseInt(e.target.value) || 10,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1824] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1.5 font-semibold">
                  Booking Notice (Minutes)
                </label>
                <input
                  type="number"
                  value={settings.bookingLeadMinutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bookingLeadMinutes: parseInt(e.target.value) || 120,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1824] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#A78BFA]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blackout Dates / Exceptions */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FFD8C5]" />
            <span>Blackout Dates & Leave</span>
          </h2>

          <div className="bg-[#24212E] border border-white/10 rounded-[1.75rem] p-6 shadow-xl space-y-6">
            <p className="text-xs text-white/60 leading-relaxed">
              Block specific calendar dates when you will be away on leave, vacation, or clinical conferences. Clients cannot book on these days.
            </p>

            {/* Add Date Form */}
            <form onSubmit={handleAddBlockDate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Select Date to Block
                </label>
                <input
                  type="date"
                  value={newBlockDate}
                  onChange={(e) => setNewBlockDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1824] border border-white/20 text-white text-xs focus:outline-none focus:border-[#FFD8C5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  placeholder="e.g. Travel, Personal Leave"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1824] border border-white/20 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#FFD8C5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FFD8C5] hover:bg-[#ffcbb3] text-[#24212E] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Blackout Date</span>
              </button>
            </form>

            {/* List of currently blocked dates */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                Currently Blocked Dates ({exceptions.length})
              </h4>

              {exceptions.length === 0 ? (
                <p className="text-xs text-white/40 italic">
                  No dates are currently blocked.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {exceptions.map((exc) => (
                    <div
                      key={exc.id}
                      className="p-3 rounded-xl bg-[#1A1824] border border-white/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white font-mono">{exc.date}</div>
                        <div className="text-[11px] text-white/50">{exc.reason}</div>
                      </div>
                      <button
                        onClick={() => handleUnblockDate(exc.date)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
                        title="Unblock this date"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
