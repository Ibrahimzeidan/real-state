"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/";
  const registered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error || "Unable to sign in.");
        return;
      }

      const next = encodeURIComponent(redirectTo);
      router.replace(`/login?authed=1&next=${next}`);
    } catch (err) {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          required
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {registered ? (
        <div className="rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-white/80">
          Account created. Please sign in to continue.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Sign in
      </button>

      <p className="text-center text-sm text-white/60">
        New here?{" "}
        <Link className="font-semibold text-accent hover:text-accent/80" href="/register">
          Create an account
        </Link>
      </p>
    </form>
  );
}
