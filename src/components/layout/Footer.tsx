"use client";

import { Guitar } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <Guitar className="h-4 w-4" />
          <span>&copy; {new Date().getFullYear()} GuitarApp. Learn guitar, one chord at a time.</span>
        </div>
        <div className="flex gap-6 text-sm text-neutral-500 dark:text-neutral-400">
          <a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-100">
            About
          </a>
          <a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-100">
            Privacy
          </a>
          <a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-100">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
