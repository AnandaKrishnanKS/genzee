"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  FileText,
  Video,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  ShieldCheck,
  Save,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface Appointment {
  id: string;
  reference: string;
  client: {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    timezone: string;
    language?: string;
  };
  startTime: string;
  endTime: string;
  status: string;
  sessionType: string;
  intakeDescription: string;
  meetingLink?: string;
  meetingInstructions?: string;
  payment?: {
    amountPaise: number;
    status: string;
    razorpayPaymentId?: string;
  };
}

export default function AdminBookingsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Editing state for meeting link
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [newMeetingLink, setNewMeetingLink] = useState("");

  const loadAppointments = () => {
    setLoading(true);
    const url = `/api/admin/bookings?status=${statusFilter}${
      searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ""
    }`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.appointments) setAppointments(data.appointments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAppointments();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const saveMeetingLink = async (id: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, meetingLink: newMeetingLink }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, meetingLink: newMeetingLink } : a))
        );
        setEditingMeetingId(null);
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment((prev) =>
            prev ? { ...prev, meetingLink: newMeetingLink } : null
          );
        }
      }
    } catch (err) {
      console.error("Failed to save meeting link:", err);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          Bookings & Client Intake Notes
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Review client session requests, read confidential 300-word intake reflections, update meeting links, and manage consultation statuses.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#24212E] border border-white/10 overflow-x-auto">
          {[
            { id: "ALL", label: "All Sessions" },
            { id: "CONFIRMED", label: "Confirmed" },
            { id: "PENDING_PAYMENT", label: "Pending Payment" },
            { id: "COMPLETED", label: "Completed" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#6D4EC9] text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, ref..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#24212E] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#A78BFA]"
          />
        </form>
      </div>

      {/* Bookings List */}
      <div className="rounded-[1.75rem] bg-[#24212E] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-white/40 text-sm">
            Loading consultation bookings...
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-16 text-center text-white/50 text-sm">
            No bookings found matching the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-[11px] uppercase tracking-wider text-white/40 border-b border-white/10 bg-white/5">
                <tr>
                  <th className="py-3 px-4">Ref & Client</th>
                  <th className="py-3 px-4">Session Time</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Intake Notes (300 Words)</th>
                  <th className="py-3 px-4">Meeting URL</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-medium text-white">
                      <div className="text-[11px] font-mono text-[#A78BFA] font-bold">
                        {apt.reference}
                      </div>
                      <div className="font-semibold text-white mt-0.5">{apt.client.name}</div>
                      <div className="text-xs text-white/50">{apt.client.email}</div>
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <div className="font-bold text-white/90">
                        {format(parseISO(apt.startTime), "MMM d, yyyy")}
                      </div>
                      <div className="text-white/60">
                        {format(parseISO(apt.startTime), "hh:mm a")} –{" "}
                        {format(parseISO(apt.endTime), "hh:mm a")}
                      </div>
                      <div className="text-[10px] text-white/40">{apt.client.timezone}</div>
                    </td>

                    <td className="py-4 px-4 text-xs">
                      {apt.payment ? (
                        <div>
                          <div className="font-bold text-white">
                            ₹{(apt.payment.amountPaise / 100).toLocaleString("en-IN")}
                          </div>
                          <div
                            className={`text-[10px] uppercase font-semibold ${
                              apt.payment.status === "CAPTURED"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            {apt.payment.status}
                          </div>
                        </div>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1A1824] border border-white/20 focus:outline-none cursor-pointer ${
                          apt.status === "CONFIRMED"
                            ? "text-emerald-300 border-emerald-500/30"
                            : apt.status === "COMPLETED"
                            ? "text-sky-300 border-sky-500/30"
                            : apt.status === "CANCELLED"
                            ? "text-rose-300 border-rose-500/30"
                            : "text-amber-300 border-amber-500/30"
                        }`}
                      >
                        <option value="PENDING_PAYMENT">Pending Payment</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="NO_SHOW">No-Show</option>
                      </select>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20 text-[#A78BFA] text-xs font-semibold transition-all cursor-pointer border border-[#A78BFA]/20"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Read Intake Notes</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 text-xs">
                      {editingMeetingId === apt.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={newMeetingLink}
                            onChange={(e) => setNewMeetingLink(e.target.value)}
                            placeholder="https://meet.google.com/..."
                            className="px-2 py-1 rounded bg-[#1A1824] border border-white/20 text-xs text-white w-40 focus:outline-none"
                          />
                          <button
                            onClick={() => saveMeetingLink(apt.id)}
                            className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingMeetingId(null)}
                            className="p-1 rounded bg-white/10 text-white/50 hover:bg-white/20"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : apt.meetingLink ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={apt.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline font-mono text-xs flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join</span>
                          </a>
                          <button
                            onClick={() => {
                              setEditingMeetingId(apt.id);
                              setNewMeetingLink(apt.meetingLink ?? "");
                            }}
                            className="text-white/40 hover:text-white p-1"
                            title="Edit Link"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingMeetingId(apt.id);
                            setNewMeetingLink("");
                          }}
                          className="text-xs text-[#A78BFA] hover:underline"
                        >
                          + Add Meet Link
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="text-xs text-white/60 hover:text-white underline cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Comprehensive 300-Word Client Intake Notes Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#24212E] border border-white/20 rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Confidential Intake Dossier</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white">
                  {selectedAppointment.client.name}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Ref: <span className="text-[#A78BFA] font-mono">{selectedAppointment.reference}</span> •{" "}
                  {selectedAppointment.client.email} • Phone: {selectedAppointment.client.phone || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Client Context Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="block text-white/40 text-[10px] uppercase font-semibold">
                  Scheduled Time
                </span>
                <span className="font-bold text-white mt-1 block">
                  {format(parseISO(selectedAppointment.startTime), "MMM d, hh:mm a")}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="block text-white/40 text-[10px] uppercase font-semibold">
                  Client Timezone
                </span>
                <span className="font-bold text-white mt-1 block truncate">
                  {selectedAppointment.client.timezone}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="block text-white/40 text-[10px] uppercase font-semibold">
                  Country
                </span>
                <span className="font-bold text-white mt-1 block">
                  {selectedAppointment.client.country || "India"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="block text-white/40 text-[10px] uppercase font-semibold">
                  Contribution
                </span>
                <span className="font-bold text-emerald-400 mt-1 block">
                  {selectedAppointment.payment
                    ? `₹${(selectedAppointment.payment.amountPaise / 100).toLocaleString("en-IN")}`
                    : "Unpaid"}
                </span>
              </div>
            </div>

            {/* 300-Word Client Description Box */}
            <div className="bg-[#1A1824] rounded-2xl p-5 border border-white/10 mb-5">
              <div className="flex items-center justify-between text-xs text-white/50 mb-3 border-b border-white/10 pb-2">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>Client&apos;s Description Notes (300 Words)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] font-mono text-[11px] font-bold">
                  {selectedAppointment.intakeDescription
                    ? selectedAppointment.intakeDescription.trim().split(/\s+/).length
                    : 0}{" "}
                  / 300 words
                </span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {selectedAppointment.intakeDescription || "No intake description was submitted."}
              </p>
            </div>

            {/* Meeting Link Manager in Modal */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Google Meet / Consultation Video URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={selectedAppointment.meetingLink || ""}
                  placeholder="https://meet.google.com/abc-wxyz-qrs"
                  id="modal-meet-link"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#1A1824] border border-white/20 text-xs text-white focus:outline-none focus:border-[#A78BFA]"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById("modal-meet-link") as HTMLInputElement;
                    if (input) saveMeetingLink(selectedAppointment.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6D4EC9] hover:bg-[#583CA8] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save Link
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Change Status:</span>
                <button
                  onClick={() => updateStatus(selectedAppointment.id, "CONFIRMED")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(selectedAppointment.id, "COMPLETED")}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs font-semibold cursor-pointer"
                >
                  Complete
                </button>
                <button
                  onClick={() => updateStatus(selectedAppointment.id, "CANCELLED")}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
