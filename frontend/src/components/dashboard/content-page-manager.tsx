"use client";

import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type PageSummary = {
  pageName: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type PagePayload = PageSummary & {
  id?: string | null;
  content?: unknown;
};

type ContentPageManagerProps = {
  initialPages: PageSummary[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return dateFormatter.format(new Date(value));
}

function toEditorValue(content: unknown) {
  return JSON.stringify(content ?? {}, null, 2);
}

function sortPages(items: PageSummary[]) {
  return [...items].sort((left, right) => {
    const leftValue = new Date(left.updatedAt || left.createdAt || 0).getTime();
    const rightValue = new Date(right.updatedAt || right.createdAt || 0).getTime();
    return rightValue - leftValue;
  });
}

function upsertPage(items: PageSummary[], page: PagePayload) {
  const next = items.filter((item) => item.pageName !== page.pageName);
  next.unshift({
    pageName: page.pageName,
    createdAt: page.createdAt ?? null,
    updatedAt: page.updatedAt ?? null,
  });
  return sortPages(next);
}

function parseJsonContent(value: string) {
  return JSON.parse(value);
}

function normalizePageName(value: string) {
  return value.trim().toLowerCase();
}

function isValidPageName(value: string) {
  return /^[a-z0-9-]+$/.test(value);
}

export function ContentPageManager({
  initialPages,
}: ContentPageManagerProps) {
  const [pages, setPages] = useState<PageSummary[]>(sortPages(initialPages));
  const [selectedPage, setSelectedPage] = useState<string>(initialPages[0]?.pageName ?? "");
  const [editorValue, setEditorValue] = useState<string>('{\n  \n}');
  const [newPageName, setNewPageName] = useState("");
  const [newPageContent, setNewPageContent] = useState('{\n  \n}');
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPage) {
      setEditorValue('{\n  \n}');
      return;
    }

    let isMounted = true;
    setIsLoadingPage(true);
    setError(null);

    const loadPage = async () => {
      try {
        const response = await fetch(`/api/content/${encodeURIComponent(selectedPage)}`, {
          credentials: "include",
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (isMounted) {
            setError(payload?.error || "Unable to load page content.");
          }
          return;
        }

        if (isMounted) {
          setEditorValue(toEditorValue(payload?.data?.content));
        }
      } catch {
        if (isMounted) {
          setError("Unable to load page content.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPage(false);
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [selectedPage]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const normalizedPageName = normalizePageName(newPageName);
    if (!normalizedPageName) {
      setError("Page name is required.");
      return;
    }

    if (!isValidPageName(normalizedPageName)) {
      setError("Page name can only use letters, numbers, and hyphens.");
      return;
    }

    if (pages.some((page) => page.pageName === normalizedPageName)) {
      setError("That page already exists. Select it from the list to edit it.");
      return;
    }

    let parsedContent: unknown;
    try {
      parsedContent = parseJsonContent(newPageContent);
    } catch {
      setError("New page content must be valid JSON.");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(`/api/content/${encodeURIComponent(normalizedPageName)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: parsedContent }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload?.error || "Unable to create page content.");
        return;
      }

      setPages((current) => upsertPage(current, payload.data));
      setSelectedPage(payload.data.pageName);
      setEditorValue(toEditorValue(payload.data.content));
      setNewPageName("");
      setNewPageContent('{\n  \n}');
      setMessage(`Created "${payload.data.pageName}" successfully.`);
    } catch {
      setError("Unable to create page content.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPage) {
      setError("Select a page first.");
      return;
    }

    setMessage(null);
    setError(null);

    let parsedContent: unknown;
    try {
      parsedContent = parseJsonContent(editorValue);
    } catch {
      setError("Page content must be valid JSON.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/content/${encodeURIComponent(selectedPage)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: parsedContent }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload?.error || "Unable to save page content.");
        return;
      }

      setPages((current) => upsertPage(current, payload.data));
      setEditorValue(toEditorValue(payload.data.content));
      setMessage(`Saved changes to "${payload.data.pageName}".`);
    } catch {
      setError("Unable to save page content.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPage) {
      setError("Select a page first.");
      return;
    }

    setMessage(null);
    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/content/${encodeURIComponent(selectedPage)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload?.error || "Unable to delete page content.");
        return;
      }

      const remaining = pages.filter((page) => page.pageName !== selectedPage);
      const sortedRemaining = sortPages(remaining);
      setPages(sortedRemaining);
      setSelectedPage(sortedRemaining[0]?.pageName ?? "");
      setEditorValue('{\n  \n}');
      setMessage(`Deleted "${payload?.data?.pageName || selectedPage}".`);
    } catch {
      setError("Unable to delete page content.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Create Content Page</CardTitle>
          <CardDescription>
            Add a new page entry using a route-friendly page name like `about`, `home`, or `contact`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label htmlFor="new-page-name">Page name</Label>
              <Input
                id="new-page-name"
                value={newPageName}
                onChange={(event) => setNewPageName(event.target.value)}
                placeholder="about"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-page-content">Initial content JSON</Label>
              <Textarea
                id="new-page-content"
                value={newPageContent}
                onChange={(event) => setNewPageContent(event.target.value)}
                className="min-h-[220px] font-mono text-xs"
                spellCheck={false}
              />
            </div>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? <Spinner /> : null}
              Create Page
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Existing Pages</CardTitle>
            <CardDescription>Select a page to edit or delete it.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.length ? (
                  pages.map((page) => (
                    <TableRow
                      key={page.pageName}
                      data-state={selectedPage === page.pageName ? "selected" : undefined}
                    >
                      <TableCell className="font-medium">{page.pageName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(page.updatedAt || page.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant={selectedPage === page.pageName ? "secondary" : "outline"}
                          onClick={() => {
                            setSelectedPage(page.pageName);
                            setMessage(null);
                            setError(null);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      No content pages yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedPage ? `Edit "${selectedPage}"` : "Edit Content Page"}</CardTitle>
            <CardDescription>
              Update the saved JSON content for this page or remove it entirely.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPage ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="selected-page-name">Selected page</Label>
                  <Input id="selected-page-name" value={selectedPage} readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-content-json">Content JSON</Label>
                  <Textarea
                    id="page-content-json"
                    value={editorValue}
                    onChange={(event) => setEditorValue(event.target.value)}
                    className="min-h-[360px] font-mono text-xs"
                    spellCheck={false}
                    disabled={isLoadingPage}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" onClick={handleSave} disabled={isSaving || isLoadingPage}>
                    {isSaving ? <Spinner /> : null}
                    Save Changes
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={isDeleting || isLoadingPage}
                      >
                        {isDeleting ? <Spinner /> : null}
                        Delete Page
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete content page?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove the stored content for `{selectedPage}`.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {isLoadingPage ? (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Spinner />
                      Loading page content...
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                Create a page or select an existing one to start editing its content.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
