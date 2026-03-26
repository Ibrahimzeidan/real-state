"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Roles } from "@/lib/permissions";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string | null;
};

type UserManagementProps = {
  users: UserRow[];
  currentUserId: string;
};

const roleOptions = [
  Roles.ADMIN,
  Roles.BLOG_EDITOR,
  Roles.PROJECT_EDITOR,
  Roles.VIEWER,
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function UserManagement({ users, currentUserId }: UserManagementProps) {
  const [items, setItems] = useState<UserRow[]>(users);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const selfEditDisabled = "Your role is locked to prevent accidental lockout.";

  const handleRoleChange = async (id: string, role: string) => {
    const current = items.find((item) => item.id === id);
    if (!current || current.role === role) {
      return;
    }

    setUpdatingId(id);
    setMessage(null);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload?.error || "Unable to update role.");
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, role: payload.data.role } : item,
        ),
      );
      setMessage("Role updated.");
    } catch {
      setMessage("Unable to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const rows = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        createdLabel: item.createdAt
          ? dateFormatter.format(new Date(item.createdAt))
          : "-",
      })),
    [items],
  );

  return (
    <div className="space-y-4">
      {message ? (
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          {message}
        </div>
      ) : null}
      <div className="text-xs text-muted-foreground">{selfEditDisabled}</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {user.name || "Unnamed"}
                  {user.id === currentUserId ? (
                    <Badge variant="secondary">You</Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={updatingId === user.id || user.id === currentUserId}
                  >
                    <SelectTrigger size="sm" className="min-w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {updatingId === user.id ? <Spinner /> : null}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.createdLabel}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
