"use client";

import { useState, useEffect } from "react";

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

// Simple event bus for toasts
type ToastListener = (toast: ToastProps) => void;
const listeners = new Set<ToastListener>();

export function toast({
  title,
  description,
  variant = "default",
}: Omit<ToastProps, "id">) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastProps = { id, title, description, variant };
  listeners.forEach((listener) => listener(newToast));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handleToast: ToastListener = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== t.id));
      }, 5000);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            t.variant === "destructive"
              ? "bg-rose-50/95 border-rose-200 text-rose-900"
              : t.variant === "success"
              ? "bg-emerald-50/95 border-emerald-200 text-emerald-900"
              : "bg-white/95 border-[#24212E]/10 text-[#24212E]"
          }`}
        >
          {t.title && (
            <h4 className="font-semibold text-sm tracking-tight mb-1">
              {t.title}
            </h4>
          )}
          {t.description && (
            <p className="text-xs opacity-80 leading-relaxed">
              {t.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
