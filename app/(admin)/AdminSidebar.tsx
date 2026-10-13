"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  CreditCard,
  LayoutDashboard,
  User,
  LogOut,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  adminUser: {
    name: string;
    email: string;
  };
}

export default function AdminSidebar({ adminUser }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      router.push("/admin/login");
    }
  };

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      activeColor: "text-[#A78BFA]",
      exact: true,
    },
    {
      href: "/admin/bookings",
      label: "Bookings & Client Notes",
      icon: Calendar,
      activeColor: "text-[#FFD8C5]",
    },
    {
      href: "/admin/availability",
      label: "Update Sessions / Schedule",
      icon: Clock,
      activeColor: "text-[#B8E9D1]",
    },
    {
      href: "/admin/payments",
      label: "Payment Records",
      icon: CreditCard,
      activeColor: "text-[#A78BFA]",
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#24212E] border-r border-white/10 flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#A78BFA] flex items-center justify-center font-bold text-white text-base">
            GZ
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white">
              GenZee<span className="text-[#A78BFA]">.</span>
            </span>
            <span className="block text-[10px] text-[#A78BFA] uppercase tracking-wider font-semibold">
              Clinical Admin
            </span>
          </div>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="text-white/40 hover:text-white transition-colors"
          title="View public website"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${item.activeColor}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Psychologist Profile Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#A78BFA]/20 border border-[#A78BFA]/40 flex items-center justify-center text-[#A78BFA] font-bold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">
              {adminUser.name}
            </p>
            <p className="text-[10px] text-white/50 truncate">
              {adminUser.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 text-xs font-medium transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
