import { NextResponse } from "next/server";
import { loadDataStore, saveDataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = loadDataStore();
    return NextResponse.json({
      settings: store.settings,
      rules: store.availabilityRules,
      exceptions: store.exceptions,
    });
  } catch (error) {
    console.error("Admin availability GET error:", error);
    return NextResponse.json({ error: "Failed to load availability" }, { status: 500 });
  }
}

// Update weekly recurring schedule
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { rules, settings } = body;

    const store = loadDataStore();

    if (Array.isArray(rules)) {
      store.availabilityRules = rules;
    }
    if (settings) {
      store.settings = { ...store.settings, ...settings };
    }

    saveDataStore(store);

    return NextResponse.json({
      success: true,
      rules: store.availabilityRules,
      settings: store.settings,
    });
  } catch (error) {
    console.error("Admin availability PUT error:", error);
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
  }
}

// Add or remove blackout date exception
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, date, reason } = body;

    const store = loadDataStore();

    if (action === "block") {
      if (!date) {
        return NextResponse.json({ error: "Date is required" }, { status: 400 });
      }
      const existing = store.exceptions.find((e) => e.date === date);
      if (existing) {
        existing.isBlocked = true;
        existing.reason = reason ?? "Blocked by admin";
      } else {
        store.exceptions.push({
          id: "exc_" + Date.now(),
          date,
          isBlocked: true,
          reason: reason ?? "Blocked by admin",
        });
      }
    } else if (action === "unblock") {
      store.exceptions = store.exceptions.filter((e) => e.date !== date);
    }

    saveDataStore(store);

    return NextResponse.json({
      success: true,
      exceptions: store.exceptions,
    });
  } catch (error) {
    console.error("Admin availability POST error:", error);
    return NextResponse.json({ error: "Failed to update exception" }, { status: 500 });
  }
}
