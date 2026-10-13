import { NextResponse } from "next/server";
import { loadDataStore, saveDataStore, StoredAppointment } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const store = loadDataStore();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q")?.toLowerCase();

    let list = [...store.appointments];

    if (status && status !== "ALL") {
      list = list.filter((a) => a.status === status);
    }

    if (query) {
      list = list.filter(
        (a) =>
          a.client.name.toLowerCase().includes(query) ||
          a.client.email.toLowerCase().includes(query) ||
          a.reference.toLowerCase().includes(query)
      );
    }

    // Sort newest / upcoming first
    list.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return NextResponse.json({ appointments: list });
  } catch (error) {
    console.error("Admin appointments fetch error:", error);
    return NextResponse.json({ error: "Failed to load appointments" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, meetingLink, meetingInstructions } = body;

    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    const store = loadDataStore();
    const index = store.appointments.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (status) {
      store.appointments[index].status = status;
    }
    if (meetingLink !== undefined) {
      store.appointments[index].meetingLink = meetingLink;
    }
    if (meetingInstructions !== undefined) {
      store.appointments[index].meetingInstructions = meetingInstructions;
    }

    saveDataStore(store);

    return NextResponse.json({
      success: true,
      appointment: store.appointments[index],
    });
  } catch (error) {
    console.error("Admin appointment update error:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
