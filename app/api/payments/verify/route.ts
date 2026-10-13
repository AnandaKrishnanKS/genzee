import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { loadDataStore, saveDataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const {
      appointmentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "appointmentId is required" },
        { status: 400 }
      );
    }

    // Verify signature if in real mode, or accept mock verification in dev mode
    let isValid = true;
    if (
      process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live") &&
      razorpayOrderId &&
      razorpayPaymentId &&
      razorpaySignature
    ) {
      isValid = verifyPaymentSignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update appointment and payment status
    const store = loadDataStore();
    const apt = store.appointments.find((a) => a.id === appointmentId);

    if (apt) {
      apt.status = "CONFIRMED";
      if (!apt.payment) {
        apt.payment = {
          id: "pay_" + Date.now(),
          appointmentId,
          amountPaise: 50000,
          currency: "INR",
          status: "CAPTURED",
          isFreeSession: false,
          createdAt: new Date().toISOString(),
        };
      }
      apt.payment.status = "CAPTURED";
      apt.payment.razorpayOrderId = razorpayOrderId || apt.payment.razorpayOrderId;
      apt.payment.razorpayPaymentId = razorpayPaymentId || "pay_mock_" + Date.now();

      saveDataStore(store);
    }

    return NextResponse.json({
      success: true,
      appointmentReference: apt?.reference,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
