import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0F14] text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(226,199,127,0.2),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(199,163,106,0.18),transparent_40%),linear-gradient(180deg,rgba(7,10,14,0.9),rgba(7,10,14,0.6))]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-center gap-6 lg:flex">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
              PrimeNest CMS
            </div>
            <h1 className="font-serif text-4xl font-semibold text-white md:text-5xl">
              Manage content with clarity, speed, and control.
            </h1>
            <p className="text-base text-white/70">
              A secure workspace for blogs, projects, and pages. Built for teams
              that move fast without sacrificing governance.
            </p>
            <div className="grid gap-3 text-sm text-white/60">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Role-based access for admins and editors.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Audit logs keep every change accountable.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Search + pagination built in for scale.
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Secure Access
              </p>
              <h2 className="font-serif text-3xl text-white">{title}</h2>
              <p className="text-sm text-white/70">{subtitle}</p>
            </div>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-sm text-white/70">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
