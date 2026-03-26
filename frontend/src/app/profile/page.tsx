"use client";

import { useRouter } from "next/navigation";
import { Loader2, LogOut, UserCircle2 } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/login");
  };

  return (
    <main className="min-h-screen px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent">
              <UserCircle2 className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Profile
              </p>
              <h1 className="font-serif text-3xl text-white">
                {user?.name || "Loading"}
              </h1>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Email
              </p>
              {loading ? (
                <Loader2 className="mt-2 h-4 w-4 animate-spin text-white/60" />
              ) : (
                <p className="mt-2 text-sm text-white/80">{user?.email}</p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Role
              </p>
              {loading ? (
                <Loader2 className="mt-2 h-4 w-4 animate-spin text-white/60" />
              ) : (
                <p className="mt-2 text-sm text-white/80">{user?.role}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              Keep your account secure and updated.
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
