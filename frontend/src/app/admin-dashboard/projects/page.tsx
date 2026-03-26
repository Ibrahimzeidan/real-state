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

type ProjectItem = {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  details?: unknown;
  createdAt?: string;
};

const emptyForm = {
  title: "",
  description: "",
  images: "",
  details: "",
};

const toImageList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

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

const normalizeItem = (item: any): ProjectItem => ({
  ...item,
  _id: resolveId(item._id ?? item.id),
});

export default function AdminProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const hasItems = items.length > 0;

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects?limit=50", {
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok) {
        setItems((payload.data || []).map(normalizeItem));
      } else {
        setMessage(payload?.error || "Unable to load projects.");
      }
    } catch {
      setMessage("Unable to load projects.");
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

  const parseDetails = (value: string) => {
    if (!value.trim()) return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const details = parseDetails(form.details);
    if (details === null) {
      setMessage("Details must be valid JSON.");
      setSaving(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      images: toImageList(form.images),
      details,
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(body?.error || "Unable to create project.");
        return;
      }
      setItems((prev) => [normalizeItem(body.data), ...prev]);
      setForm(emptyForm);
      setMessage("Project created.");
    } catch {
      setMessage("Unable to create project.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (item: ProjectItem) => {
    setEditing(item);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      images: item.images?.join(", ") || "",
      details: item.details ? JSON.stringify(item.details, null, 2) : "",
    });
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage(null);

    const details = parseDetails(editForm.details);
    if (details === null) {
      setMessage("Details must be valid JSON.");
      setSaving(false);
      return;
    }

    const payload = {
      title: editForm.title,
      description: editForm.description,
      images: toImageList(editForm.images),
      details,
    };

    try {
      const response = await fetch(`/api/projects/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(body?.error || "Unable to update project.");
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item._id === editing._id ? normalizeItem(body.data) : item,
        ),
      );
      setEditing(null);
      setMessage("Project updated.");
    } catch {
      setMessage("Unable to update project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ProjectItem) => {
    if (!confirm(`Delete "${item.title}"?`)) {
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/projects/${item._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(body?.error || "Unable to delete project.");
        return;
      }
      setItems((prev) => prev.filter((row) => row._id !== item._id));
      setMessage("Project deleted.");
    } catch {
      setMessage("Unable to delete project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Manage project listings and details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Add a new project listing.</CardDescription>
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
            <Input
              placeholder="Image URLs (comma separated)"
              value={form.images}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, images: event.target.value }))
              }
            />
            <Textarea
              placeholder="Details (optional JSON)"
              value={form.details}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, details: event.target.value }))
              }
              rows={4}
            />
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner className="mr-2" /> : null}
              Create Project
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>Manage existing projects.</CardDescription>
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
                  <TableHead>Images</TableHead>
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
                        {item.images?.length || 0}
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
                      No projects yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details.</DialogDescription>
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
            <Input
              placeholder="Image URLs (comma separated)"
              value={editForm.images}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, images: event.target.value }))
              }
            />
            <Textarea
              placeholder="Details (optional JSON)"
              value={editForm.details}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, details: event.target.value }))
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
