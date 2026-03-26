"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

type ServiceItem = {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
};

const emptyForm = {
  title: "",
  description: "",
};

const resolveId = (value: unknown) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "$oid" in value) {
    return String((value as { $oid: unknown }).$oid);
  }
  if (typeof (value as { toString?: () => string }).toString === "function") {
    return (value as { toString: () => string }).toString();
  }
  return String(value);
};

const normalizeItem = (item: any): ServiceItem => ({
  ...item,
  _id: resolveId(item._id ?? item.id),
});

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const hasItems = items.length > 0;

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/services?limit=50", {
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok) {
        setItems((payload.data || []).map(normalizeItem));
      } else {
        setMessage(payload?.error || "Unable to load services.");
      }
    } catch {
      setMessage("Unable to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const left = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const right = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return right - left;
      }),
    [items],
  );

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload?.error || "Unable to create service.");
        return;
      }
      setItems((prev) => [normalizeItem(payload.data), ...prev]);
      setForm(emptyForm);
      setMessage("Service created.");
    } catch {
      setMessage("Unable to create service.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (item: ServiceItem) => {
    setEditing(item);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
    });
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/services/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload?.error || "Unable to update service.");
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item._id === editing._id ? normalizeItem(payload.data) : item,
        ),
      );
      setEditing(null);
      setMessage("Service updated.");
    } catch {
      setMessage("Unable to update service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ServiceItem) => {
    if (!confirm(`Delete "${item.title}"?`)) {
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/services/${item._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload?.error || "Unable to delete service.");
        return;
      }
      setItems((prev) => prev.filter((row) => row._id !== item._id));
      setMessage("Service deleted.");
    } catch {
      setMessage("Unable to delete service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="text-sm text-muted-foreground">
          Manage service offerings shown on the website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Service</CardTitle>
          <CardDescription>Add a new service.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={4}
              required
            />
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner className="mr-2" /> : null}
              Create Service
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>Manage existing services.</CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
            <div className="mb-4 rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
              {message}
            </div>
          ) : null}
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasItems ? (
                  sortedItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("en-US")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEdit(item)}
                          >
                            <Pencil className="mr-1 size-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item)}
                            disabled={saving}
                          >
                            <Trash2 className="mr-1 size-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No services yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update the service details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={editForm.title}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <Textarea
              placeholder="Description"
              value={editForm.description}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving ? <Spinner className="mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
