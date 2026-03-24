"use client";

import Link from "next/link";
import { Guitar } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign-in failed. Please try logging in.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-amber-600 dark:text-amber-400"
          >
            <Guitar className="h-8 w-8" />
            GuitarApp
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">
            Start your guitar journey
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Create a free account to track your progress
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-900">
                or sign up with email
              </span>
            </div>
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                placeholder="Your name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Free Account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
