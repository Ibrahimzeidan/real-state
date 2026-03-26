"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

type AdminCredentialsFormProps = {
  currentEmail: string;
};

export function AdminCredentialsForm({
  currentEmail,
}: AdminCredentialsFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/credentials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          email,
          password: newPassword || undefined,
          confirmPassword: confirmPassword || undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error || "Unable to update admin credentials.");
        return;
      }

      setEmail(payload?.data?.email || email);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage(
        payload?.message ||
          "Admin credentials updated. Restart the frontend server if needed.",
      );

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Unable to update admin credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Admin email</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-current-password">Current password</Label>
          <Input
            id="admin-current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Enter current password"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="admin-new-password">New password</Label>
          <Input
            id="admin-new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-confirm-password">Confirm new password</Label>
          <Input
            id="admin-confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat the new password"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Changes are saved to `frontend/.env`. Your current admin session stays active,
        but a frontend restart may be needed before the new credentials work everywhere.
      </div>

      {message ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : null}
        Save Admin Credentials
      </Button>
    </form>
  );
}
