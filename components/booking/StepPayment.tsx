"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { BookingData } from "./BookingWizard";
import { format, parseISO } from "date-fns";

interface StepPaymentProps {
  bookingData: BookingData;
  onSuccess: (amountPaise: number, paymentStatus: "paid" | "free") => void;
  onBack: () => void;
}

interface ConsultationSettings {
  minPaymentPaise: number;
  maxPaymentPaise: number;
  suggestedAmounts: number[];
  freeSessionsEnabled: boolean;
}

declare global {
  interface Window {
    Razorpay: new (opts: unknown) => { open: () => void };
  }
}

export default function StepPayment({ bookingData, onSuccess, onBack }: StepPaymentProps) {
  const [settings, setSettings] = useState<ConsultationSettings | null>(null);
  const [amountStr, setAmountStr] = useState("500");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load settings
  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() =>
        setSettings({
          minPaymentPaise: 10000,
          maxPaymentPaise: 500000,
          suggestedAmounts: [50000, 100000, 200000],
          freeSessionsEnabled: false,
        })
      );
  }, []);

  const amountPaise = Math.round(parseFloat(amountStr || "0") * 100);
  const minPaise = settings?.minPaymentPaise ?? 10000;
  const maxPaise = settings?.maxPaymentPaise ?? 500000;

  const isValidAmount =
    !isNaN(amountPaise) &&
    amountPaise >= minPaise &&
    amountPaise <= maxPaise;

  const handlePay = async () => {
    if (!isValidAmount || !razorpayLoaded) return;
    setError(null);
    setLoading(true);

    try {
      // Create Razorpay order server-side
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: bookingData.appointmentId,
          amountPaise,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderData.error ?? "Failed to create payment order.");
        setLoading(false);
        return;
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountPaise,
        currency: "INR",
        name: "GenZee Psychologist",
        description: "Online Psychological Consultation",
        order_id: orderData.orderId,
        prefill: {
          name: bookingData.clientDetails?.name,
          email: bookingData.clientDetails?.email,
          contact: bookingData.clientDetails?.phone,
        },
        theme: { color: "#A78BFA" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Verify server-side
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              appointmentId: bookingData.appointmentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.error ?? "Payment verification failed.");
            setLoading(false);
            return;
          }

          onSuccess(amountPaise, "paid");
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment was cancelled. Your booking slot is held for a few minutes.");
          },
        },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleFreeSession = async () => {
    if (!settings?.freeSessionsEnabled) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/payments/free-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: bookingData.appointmentId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to process free session.");
        setLoading(false);
        return;
      }

      onSuccess(0, "free");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const slotDate = bookingData.selectedSlot
    ? format(parseISO(bookingData.selectedSlot.startUtc), "MMM d, yyyy")
    : "";

  return (
    <div>
      <button
        onClick={onBack}
        disabled={loading}
        className="flex items-center gap-1 text-[#6D4EC9] text-sm font-medium mb-5 hover:text-[#A78BFA] transition-colors disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="font-display text-2xl font-bold text-[#24212E] mb-1">
        Choose what feels comfortable.
      </h2>
      <p className="text-[#24212E]/55 text-sm mb-7">
        Every contribution is appreciated. Choose an amount that works for you.
      </p>

      {/* Session summary */}
      <div className="bg-[#F0E9FF]/60 rounded-2xl p-4 mb-6">
        <p className="text-sm text-[#24212E]/70">
          <strong>Session:</strong> {slotDate} at {bookingData.selectedSlot?.label} ·{" "}
          <strong>Ref:</strong> {bookingData.reference}
        </p>
      </div>

      {/* Suggested amounts */}
      {settings && (
        <div className="flex flex-wrap gap-2 mb-5">
          {settings.suggestedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmountStr(String(amt / 100))}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                amountStr === String(amt / 100)
                  ? "bg-[#A78BFA] border-[#A78BFA] text-white"
                  : "border-[#F0E9FF] text-[#24212E]/60 hover:border-[#A78BFA]/50"
              }`}
            >
              {formatCurrency(amt)}
            </button>
          ))}
        </div>
      )}

      {/* Amount input */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-semibold text-[#24212E] mb-2">
          Your contribution (₹)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#24212E]/50 font-semibold">₹</span>
          <input
            id="amount"
            type="number"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            min={settings ? settings.minPaymentPaise / 100 : 100}
            max={settings ? settings.maxPaymentPaise / 100 : 5000}
            placeholder="500"
            className="w-full pl-8 pr-4 py-3.5 rounded-xl border-2 border-[#F0E9FF] bg-white text-[#24212E] focus:outline-none focus:border-[#A78BFA] transition-colors text-lg font-semibold"
          />
        </div>
        {settings && (
          <p className="text-[#24212E]/40 text-xs mt-1">
            Min: {formatCurrency(settings.minPaymentPaise)} · Max:{" "}
            {formatCurrency(settings.maxPaymentPaise)}
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 mb-4" role="alert">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={!isValidAmount || loading || !razorpayLoaded}
        className="w-full bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(167,139,250,0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            Pay {isValidAmount ? formatCurrency(amountPaise) : "…"} Securely
          </>
        )}
      </button>

      {settings?.freeSessionsEnabled && (
        <button
          onClick={handleFreeSession}
          disabled={loading}
          className="w-full mt-3 py-3.5 rounded-xl border-2 border-[#F0E9FF] text-[#24212E]/60 font-semibold text-sm hover:border-[#A78BFA]/30 transition-all disabled:opacity-50"
        >
          Request a free session
        </button>
      )}

      <div className="flex items-center gap-2 justify-center mt-4 text-[#24212E]/40 text-xs">
        <ShieldCheck className="w-3.5 h-3.5" />
        Secured by Razorpay · Your card details are never stored
      </div>
    </div>
  );
}
