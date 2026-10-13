import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    minPaymentPaise: 10000, // ₹100 min
    maxPaymentPaise: 500000, // ₹5,000 max
    suggestedAmounts: [50000, 100000, 200000], // ₹500, ₹1000, ₹2000
    freeSessionsEnabled: false,
    sessionDurationMinutes: 50,
  });
}
