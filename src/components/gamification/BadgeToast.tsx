"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, X } from "lucide-react";

interface ToastItem {
  id: string;
  type: "badge" | "levelup" | "xp";
  title: string;
  description?: string;
  icon?: string;
}

let toastCallback: ((toast: ToastItem) => void) | null = null;

// Global function to trigger toasts from anywhere
export function showGamificationToast(toast: Omit<ToastItem, "id">) {
  if (toastCallback) {
    toastCallback({ ...toast, id: Date.now().toString() });
  }
}

export function BadgeToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastCallback = (toast) => {
      setToasts((prev) => [...prev, toast]);
    };
    return () => {
      toastCallback = null;
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-5",
            toast.type === "badge"
              ? "border-amber-200 bg-amber-50/95 dark:border-amber-800 dark:bg-amber-950/95"
              : toast.type === "levelup"
                ? "border-blue-200 bg-blue-50/95 dark:border-blue-800 dark:bg-blue-950/95"
                : "border-emerald-200 bg-emerald-50/95 dark:border-emerald-800 dark:bg-emerald-950/95"
          )}
        >
          <div className="text-2xl">
            {toast.type === "badge" ? (
              toast.icon || "🏅"
            ) : toast.type === "levelup" ? (
              <TrendingUp className="h-7 w-7 text-blue-500" />
            ) : (
              <Trophy className="h-7 w-7 text-emerald-500" />
            )}
          </div>
          <div className="flex-1">
            <p
              className={cn(
                "text-sm font-semibold",
                toast.type === "badge"
                  ? "text-amber-800 dark:text-amber-200"
                  : toast.type === "levelup"
                    ? "text-blue-800 dark:text-blue-200"
                    : "text-emerald-800 dark:text-emerald-200"
              )}
            >
              {toast.title}
            </p>
            {toast.description && (
              <p className="text-xs text-neutral-500">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="shrink-0 text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
