import type { Role } from "@/lib/permissions";
import { Roles } from "@/lib/permissions";

export const ADMIN_ID = "admin";
export const ADMIN_NAME = "Admin";

type AuthLikeUser = {
  id: string;
  email: string;
  role: Role | string;
};

function requireAnyEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }
  throw new Error(`Missing one of these environment variables: ${names.join(", ")}.`);
}

export function normalizeAuthEmail(value: string) {
  return value.replace(/\0/g, "").trim().toLowerCase();
}

export function getAdminEmail() {
  return normalizeAuthEmail(requireAnyEnv(["ADMIN_EMAIL", "STATIC_ADMIN_EMAIL"]));
}

export function getAdminPassword() {
  return requireAnyEnv(["ADMIN_PASSWORD", "STATIC_ADMIN_PASSWORD"]);
}

export function getAdminAuthUser() {
  return {
    id: ADMIN_ID,
    name: ADMIN_NAME,
    email: getAdminEmail(),
    role: Roles.ADMIN,
  } as const;
}

export function isAdminEmail(email: string) {
  return normalizeAuthEmail(email) === getAdminEmail();
}

export function isAdminUser(user: AuthLikeUser | null | undefined) {
  return Boolean(
    user &&
      user.id === ADMIN_ID &&
      user.role === Roles.ADMIN,
  );
}

export function isAdminId(id: string) {
  return id === ADMIN_ID;
}
