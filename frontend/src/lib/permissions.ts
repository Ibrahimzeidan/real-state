export const Roles = {
  ADMIN: "ADMIN",
  BLOG_EDITOR: "BLOG_EDITOR",
  PROJECT_EDITOR: "PROJECT_EDITOR",
  VIEWER: "VIEWER",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const ROLE_OPTIONS = [
  Roles.BLOG_EDITOR,
  Roles.PROJECT_EDITOR,
  Roles.VIEWER,
] as const;

export type DatabaseRole = (typeof ROLE_OPTIONS)[number];

export function normalizePersistedRole(role: unknown): DatabaseRole {
  if (role === Roles.BLOG_EDITOR || role === Roles.PROJECT_EDITOR) {
    return role;
  }
  return Roles.VIEWER;
}

export function checkPermission(
  userRole: Role,
  required: Role | Role[],
) {
  if (userRole === Roles.ADMIN) {
    return true;
  }
  const requiredRoles = Array.isArray(required) ? required : [required];
  return requiredRoles.includes(userRole);
}

export function getDashboardAccess(role: Role) {
  return {
    canManageBlogs: checkPermission(role, [Roles.ADMIN, Roles.BLOG_EDITOR]),
    canManageProjects: checkPermission(role, [
      Roles.ADMIN,
      Roles.PROJECT_EDITOR,
    ]),
    canManageContent: role === Roles.ADMIN,
    canViewSubmissions: role === Roles.ADMIN,
  };
}
