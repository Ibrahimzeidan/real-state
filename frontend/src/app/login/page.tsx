import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { LoginRedirect } from "@/components/auth/login-redirect";

type SearchParams = {
  from?: string | string[];
  authed?: string | string[];
  next?: string | string[];
};

type LoginPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const resolvedParams = searchParams ? await searchParams : {};
  const authedValue = Array.isArray(resolvedParams.authed)
    ? resolvedParams.authed[0]
    : resolvedParams.authed;
  const nextValue = Array.isArray(resolvedParams.next)
    ? resolvedParams.next[0]
    : resolvedParams.next;
  const fromValue = Array.isArray(resolvedParams.from)
    ? resolvedParams.from[0]
    : resolvedParams.from;
  const authed = authedValue === "1";
  const next = nextValue || fromValue || "/";
  const showAuthed = Boolean(token && authed);

  if (token && !authed) {
    redirect("/");
  }

  return (
    <AuthShell
      title={showAuthed ? "Signed in" : "Sign in"}
      subtitle={
        showAuthed
          ? "You are verified. Redirecting you to the website."
          : "Enter your email and password to access the CMS."
      }
      footer={
        <span>
          Need access? Contact an administrator to get elevated roles.
        </span>
      }
    >
      {showAuthed ? <LoginRedirect next={next} /> : <LoginForm />}
    </AuthShell>
  );
}
