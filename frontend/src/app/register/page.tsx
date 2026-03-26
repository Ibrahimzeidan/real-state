import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) {
    redirect("/");
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Set up your CMS access in minutes."
      footer={
        <span>
          Accounts start as VIEWER. The admin account is managed separately.
        </span>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
