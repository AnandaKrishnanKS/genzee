import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { loadDataStore, saveDataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { appointmentId, amountPaise } = await request.json();

    if (!appointmentId || !amountPaise) {
      return NextResponse.json(
        { error: "appointmentId and amountPaise are required" },
        { status: 400 }
      );
    }

    let orderId = "order_mock_" + Date.now();

    // If Razorpay instance is configured with real key, create real order
    if (razorpay && process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live")) {
      try {
        const order = await razorpay.orders.create({
          amount: amountPaise,
          currency: "INR",
          receipt: appointmentId.slice(0, 40),
          notes: { appointmentId },
        });
        orderId = order.id;
      } catch (err) {
        console.warn("Razorpay API order creation failed, falling back to mock:", err);
      }
    }

    // Record order in data store
    const store = loadDataStore();
    const apt = store.appointments.find((a) => a.id === appointmentId);
    if (apt) {
      apt.payment = {
        id: "pay_" + Date.now(),
        appointmentId,
        razorpayOrderId: orderId,
        amountPaise,
        currency: "INR",
        status: "CREATED",
        isFreeSession: amountPaise === 0,
        createdAt: new Date().toISOString(),
      };
      saveDataStore(store);
    }

    return NextResponse.json({
      orderId,
      amountPaise,
      currency: "INR",
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
