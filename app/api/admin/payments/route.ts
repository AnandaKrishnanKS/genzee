import { NextResponse } from "next/server";
import { loadDataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = loadDataStore();

    const paymentsList = store.appointments
      .filter((a) => a.payment)
      .map((a) => ({
        id: a.payment!.id,
        appointmentId: a.id,
        appointmentReference: a.reference,
        clientName: a.client.name,
        clientEmail: a.client.email,
        amountPaise: a.payment!.amountPaise,
        amountInr: a.payment!.amountPaise / 100,
        currency: a.payment!.currency,
        status: a.payment!.status,
        razorpayOrderId: a.payment!.razorpayOrderId ?? "N/A",
        razorpayPaymentId: a.payment!.razorpayPaymentId ?? "N/A",
        isFreeSession: a.payment!.isFreeSession,
        sessionDate: a.startTime,
        createdAt: a.payment!.createdAt,
      }));

    // Aggregate statistics
    const totalRevenuePaise = paymentsList
      .filter((p) => p.status === "CAPTURED")
      .reduce((acc, curr) => acc + curr.amountPaise, 0);

    const capturedCount = paymentsList.filter((p) => p.status === "CAPTURED").length;
    const avgContribution = capturedCount > 0 ? totalRevenuePaise / capturedCount / 100 : 0;

    return NextResponse.json({
      payments: paymentsList,
      summary: {
        totalRevenueInr: totalRevenuePaise / 100,
        capturedCount,
        avgContributionInr: Math.round(avgContribution),
      },
    });
  } catch (error) {
    console.error("Admin payments fetch error:", error);
    return NextResponse.json({ error: "Failed to load payments" }, { status: 500 });
  }
}
