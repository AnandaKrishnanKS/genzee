"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface PaymentRecord {
  id: string;
  appointmentId: string;
  appointmentReference: string;
  clientName: string;
  clientEmail: string;
  amountPaise: number;
  amountInr: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  isFreeSession: boolean;
  sessionDate: string;
  createdAt: string;
}

interface SummaryStats {
  totalRevenueInr: number;
  capturedCount: number;
  avgContributionInr: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState<SummaryStats>({
    totalRevenueInr: 0,
    capturedCount: 0,
    avgContributionInr: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.payments) setPayments(data.payments);
        if (data.summary) setSummary(data.summary);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.clientName.toLowerCase().includes(term) ||
      p.clientEmail.toLowerCase().includes(term) ||
      p.appointmentReference.toLowerCase().includes(term) ||
      p.razorpayPaymentId.toLowerCase().includes(term) ||
      p.razorpayOrderId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Consultation Payment Records & Ledger
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Track Pay-What-You-Can sliding scale contributions, Razorpay transaction IDs, and revenue summaries.
          </p>
        </div>

        <button
          onClick={() => {
            // Simple CSV export
            const headers = "Reference,Client,Email,Amount (INR),Status,Razorpay Order ID,Razorpay Payment ID,Date\n";
            const rows = filtered
              .map(
                (p) =>
                  `"${p.appointmentReference}","${p.clientName}","${p.clientEmail}",${p.amountInr},"${p.status}","${p.razorpayOrderId}","${p.razorpayPaymentId}","${p.createdAt}"`
              )
              .join("\n");
            const blob = new Blob([headers + rows], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `genzee-payments-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-[1.75rem] bg-[#24212E] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            ₹{summary.totalRevenueInr.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-white/40 mt-1">Total successfully captured</p>
        </div>

        <div className="p-6 rounded-[1.75rem] bg-[#24212E] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Paid Consultations
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/20 text-[#A78BFA] flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            {summary.capturedCount}
          </div>
          <p className="text-xs text-white/40 mt-1">Sessions with completed checkout</p>
        </div>

        <div className="p-6 rounded-[1.75rem] bg-[#24212E] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Avg Contribution
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FFD8C5]/20 text-[#FFD8C5] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            ₹{summary.avgContributionInr.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-white/40 mt-1">Average per sliding-scale booking</p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="rounded-[1.75rem] bg-[#24212E] border border-white/10 shadow-xl overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display font-bold text-lg text-white">
            Payment Transactions & Gateway IDs
          </h2>

          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client, order ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1A1824] border border-white/20 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#A78BFA]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-white/40 text-sm">
            Loading payment ledger...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-white/50 text-sm">
            No payments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-[11px] uppercase tracking-wider text-white/40 border-b border-white/10 bg-white/5">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Razorpay Order ID</th>
                  <th className="py-3 px-4">Razorpay Payment ID</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div>{p.clientName}</div>
                      <div className="text-xs text-white/40">{p.clientEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-[#A78BFA] font-bold">
                      {p.appointmentReference}
                    </td>

                    <td className="py-3.5 px-4 text-sm font-bold text-emerald-400">
                      ₹{p.amountInr.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          p.status === "CAPTURED"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-white/70">
                      {p.razorpayOrderId}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-white/70">
                      {p.razorpayPaymentId}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-white/50">
                      {format(parseISO(p.createdAt), "MMM d, yyyy • hh:mm a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
