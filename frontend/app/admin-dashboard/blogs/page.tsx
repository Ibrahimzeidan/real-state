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

type BlogItem = {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt?: string;
};

const emptyForm = {
  title: "",
  content: "",
  image: "",
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

const normalizeItem = (item: any): BlogItem => ({
  ...item,
  _id: resolveId(item._id ?? item.id),
});

export default function AdminBlogsPage() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<BlogItem | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const hasItems = items.length > 0;

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs?limit=50", {
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok) {
        setItems((payload.data || []).map(normalizeItem));
      } else {
        setMessage(payload?.error || "Unable to load blogs.");
      }
    } catch {
      setMessage("Unable to load blogs.");
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
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload?.error || "Unable to create blog.");
        return;
      }
      setItems((prev) => [normalizeItem(payload.data), ...prev]);
      setForm(emptyForm);
      setMessage("Blog created.");
    } catch {
      setMessage("Unable to create blog.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (item: BlogItem) => {
    setEditing(item);
    setEditForm({
      title: item.title || "",
      content: item.content || "",
      image: item.image || "",
    });
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/blogs/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload?.error || "Unable to update blog.");
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item._id === editing._id ? normalizeItem(payload.data) : item,
        ),
      );
      setEditing(null);
      setMessage("Blog updated.");
    } catch {
      setMessage("Unable to update blog.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: BlogItem) => {
    if (!confirm(`Delete "${item.title}"?`)) {
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/blogs/${item._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload?.error || "Unable to delete blog.");
        return;
      }
      setItems((prev) => prev.filter((row) => row._id !== item._id));
      setMessage("Blog deleted.");
    } catch {
      setMessage("Unable to delete blog.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Blogs</h1>
        <p className="text-sm text-muted-foreground">
          Create, edit, and delete blog posts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Blog</CardTitle>
          <CardDescription>Add a new blog post.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                required
              />
              <Input
                placeholder="Image URL (optional)"
                value={form.image}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, image: event.target.value }))
                }
              />
            </div>
            <Textarea
              placeholder="Content"
              value={form.content}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, content: event.target.value }))
              }
              rows={6}
              required
            />
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner className="mr-2" /> : null}
              Create Blog
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
          <CardDescription>Manage existing blog posts.</CardDescription>
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
                  <TableHead>Image</TableHead>
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
                        {item.image ? "Yes" : "No"}
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
                      No blogs yet.
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
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>Update the blog post content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={editForm.title}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <Input
              placeholder="Image URL (optional)"
              value={editForm.image}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, image: event.target.value }))
              }
            />
            <Textarea
              placeholder="Content"
              value={editForm.content}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, content: event.target.value }))
              }
              rows={6}
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
