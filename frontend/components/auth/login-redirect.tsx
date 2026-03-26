"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type LoginRedirectProps = {
  next: string;
};

export function LoginRedirect({ next }: LoginRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(next);
    }, 1200);

    return () => clearTimeout(timer);
  }, [next, router]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/70">
        Sign-in confirmed. Taking you to the website now.
      </p>
      <button
        type="button"
        onClick={() => router.replace(next)}
        className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10"
      >
        Continue now
      </button>
    </div>
  );
}
