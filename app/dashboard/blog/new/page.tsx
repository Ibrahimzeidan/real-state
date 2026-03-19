"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Image, Bold, Italic, List, Link2, Quote } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const categories = ["Market Trends", "Buying Guide", "Selling Tips", "Finance", "Technology", "Investment", "Lifestyle"]

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/blog">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
            <p className="text-muted-foreground mt-1">
              Create a new article for your blog
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="mr-2 size-4" />
            Preview
          </Button>
          <Button variant="outline">Save as Draft</Button>
          <Button>
            <Save className="mr-2 size-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>
                Write your blog post content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title..."
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a brief summary of your post..."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  This will appear in post previews and search results
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content</Label>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-8">
                      <Bold className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Italic className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <List className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Link2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Quote className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Image className="size-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here..."
                  rows={20}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase().replace(" ", "-")}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Author</Label>
                <Select defaultValue="admin">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin User</SelectItem>
                    <SelectItem value="sarah">Sarah Miller</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="real estate, market, tips" />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <div className="mx-auto w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <Image className="size-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload featured image
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" placeholder="SEO title (max 60 chars)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDesc">Meta Description</Label>
                <Textarea
                  id="metaDesc"
                  placeholder="SEO description (max 160 chars)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" placeholder="post-url-slug" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
