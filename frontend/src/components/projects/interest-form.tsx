"use client";

import { useState } from "react";

type InterestFormProps = {
  projectId: string;
};

export function ProjectInterestForm({ projectId }: InterestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(payload?.error || "Unable to submit interest.");
        return;
      }
      setStatus("Thank you! We will contact you shortly.");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("Unable to submit interest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Message (Optional)
        </label>
        <textarea
          id="message"
          rows={3}
          value={formData.message}
          onChange={(event) => setFormData({ ...formData, message: event.target.value })}
          className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="I would like to schedule a viewing..."
        />
      </div>

      {status ? (
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {status}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
      >
        {loading ? "Sending..." : "I'm Interested"}
      </button>
    </form>
  );
}
