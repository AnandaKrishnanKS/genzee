"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  FileText,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface Appointment {
  id: string;
  reference: string;
  client: {
    name: string;
    email: string;
    phone?: string;
    timezone: string;
  };
  startTime: string;
  endTime: string;
  status: string;
  intakeDescription: string;
  meetingLink?: string;
  payment?: {
    amountPaise: number;
    status: string;
  };
}

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Appointment | null>(null);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalBookings = appointments.length;
  const confirmedBookings = appointments.filter((a) => a.status === "CONFIRMED").length;
  const pendingBookings = appointments.filter((a) => a.status === "PENDING_PAYMENT").length;
  const totalRevenue = appointments
    .filter((a) => a.payment && a.payment.status === "CAPTURED")
    .reduce((sum, a) => sum + (a.payment?.amountPaise ?? 0) / 100, 0);

  const upcomingSessions = appointments.filter(
    (a) => a.status === "CONFIRMED" || a.status === "PENDING_PAYMENT"
  );

  return (
    <div className="p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Psychologist Clinical Dashboard
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Overview of upcoming therapy consultations, client intake notes, and earnings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/availability"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6D4EC9] hover:bg-[#583CA8] text-white text-xs font-semibold shadow-md transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>Update Available Sessions</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>All Bookings</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#24212E] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Total Sessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/20 text-[#A78BFA] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">{totalBookings}</div>
          <p className="text-[11px] text-white/50 mt-1">All appointments booked</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#24212E] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Confirmed
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#B8E9D1]/20 text-[#B8E9D1] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-emerald-400">
            {confirmedBookings}
          </div>
          <p className="text-[11px] text-white/50 mt-1">Active upcoming sessions</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#24212E] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Pending Payment
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFD8C5]/20 text-[#FFD8C5] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-amber-300">
            {pendingBookings}
          </div>
          <p className="text-[11px] text-white/50 mt-1">Awaiting checkout completion</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#24212E] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Total Contributions
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-white/50 mt-1">Sliding scale collected</p>
        </div>
      </div>

      {/* Upcoming Consultations Table */}
      <div className="rounded-[1.75rem] bg-[#24212E] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-lg text-white">
              Upcoming Consultation Sessions
            </h2>
            <p className="text-xs text-white/60">
              Direct access to client intake reflections (300 words), meeting links, and session details.
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-[#A78BFA] hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-white/40 text-sm">
            Loading consultations...
          </div>
        ) : upcomingSessions.length === 0 ? (
          <div className="py-12 text-center text-white/50 text-sm">
            No upcoming sessions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-[11px] uppercase tracking-wider text-white/40 border-b border-white/10 bg-white/5">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Contribution</th>
                  <th className="py-3 px-4">Intake Notes</th>
                  <th className="py-3 px-4">Meeting Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {upcomingSessions.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div>{apt.client.name}</div>
                      <div className="text-xs text-white/40">{apt.client.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-semibold text-white/90">
                        {format(parseISO(apt.startTime), "MMM d, yyyy")}
                      </div>
                      <div className="text-white/50">
                        {format(parseISO(apt.startTime), "hh:mm a")} –{" "}
                        {format(parseISO(apt.endTime), "hh:mm a")}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {apt.status === "CONFIRMED" ? "Confirmed" : "Pending Payment"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-white">
                      {apt.payment
                        ? `₹${(apt.payment.amountPaise / 100).toLocaleString("en-IN")}`
                        : "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedNote(apt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20 text-[#A78BFA] text-xs font-medium transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View (300 Words)</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      {apt.meetingLink ? (
                        <a
                          href={apt.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-all"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Meet</span>
                        </a>
                      ) : (
                        <span className="text-xs text-white/30 italic">No link added</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 300-Word Client Notes Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#24212E] border border-white/20 rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] text-xs font-bold mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Confidential Client Intake Notes</span>
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  {selectedNote.client.name}
                </h3>
                <p className="text-xs text-white/50">
                  {selectedNote.client.email} • Timezone: {selectedNote.client.timezone}
                </p>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#1A1824] rounded-2xl p-5 border border-white/10 mb-6">
              <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                <span className="font-semibold uppercase tracking-wider">
                  Client&apos;s Description of What&apos;s on Their Mind
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono">
                  {selectedNote.intakeDescription
                    ? selectedNote.intakeDescription.trim().split(/\s+/).length
                    : 0}{" "}
                  / 300 words
                </span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedNote.intakeDescription || "No intake description provided."}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedNote(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Close Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
