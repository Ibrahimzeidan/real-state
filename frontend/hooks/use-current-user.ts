"use client";

import { useEffect, useState } from "react";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (!response.ok) {
          if (isMounted) {
            setUser(null);
          }
          return;
        }
        const payload = await response.json();
        if (isMounted) {
          setUser(payload.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading };
}
