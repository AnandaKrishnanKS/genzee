import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = {
  title: "Psychologist Admin Portal — GenZee",
  description: "Private administration portal for bookings, client intake notes, schedule, and payments.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;

  let isAuthenticated = false;
  let adminUser = { name: "Dr. Sarah Rao", email: "admin@genzeepsych.com" };

  if (sessionCookie) {
    try {
      const decoded = JSON.parse(
        Buffer.from(sessionCookie, "base64").toString("utf-8")
      );
      if (decoded && decoded.exp && decoded.exp > Date.now()) {
        isAuthenticated = true;
        if (decoded.name) adminUser.name = decoded.name;
        if (decoded.email) adminUser.email = decoded.email;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // If not authenticated (e.g. on login page), render clean page without sidebar
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A1824] text-white font-body antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1824] text-white flex flex-col md:flex-row font-body antialiased">
      <AdminSidebar adminUser={adminUser} />
      <main className="flex-1 flex flex-col min-w-0 bg-[#1A1824] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
