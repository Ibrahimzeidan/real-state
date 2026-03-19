"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  MessageSquare,
  FileText
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const blogPosts = [
  {
    id: "1",
    title: "2024 Real Estate Market Trends You Need to Know",
    excerpt: "Discover the latest trends shaping the real estate market this year and how they might affect your buying or selling decisions.",
    author: "Admin User",
    authorInitials: "AU",
    category: "Market Trends",
    status: "Published",
    views: 1245,
    comments: 23,
    publishedAt: "Mar 15, 2024",
  },
  {
    id: "2",
    title: "5 Tips for First-Time Homebuyers",
    excerpt: "Buying your first home can be overwhelming. Here are five essential tips to help you navigate the process with confidence.",
    author: "Sarah Miller",
    authorInitials: "SM",
    category: "Buying Guide",
    status: "Published",
    views: 892,
    comments: 15,
    publishedAt: "Mar 10, 2024",
  },
  {
    id: "3",
    title: "How to Stage Your Home for a Quick Sale",
    excerpt: "Learn the secrets of professional home staging that can help you sell your property faster and at a better price.",
    author: "Mike Johnson",
    authorInitials: "MJ",
    category: "Selling Tips",
    status: "Published",
    views: 756,
    comments: 8,
    publishedAt: "Mar 5, 2024",
  },
  {
    id: "4",
    title: "Understanding Mortgage Options in 2024",
    excerpt: "Navigate the complex world of mortgage options with our comprehensive guide to finding the best financing for your home.",
    author: "Admin User",
    authorInitials: "AU",
    category: "Finance",
    status: "Draft",
    views: 0,
    comments: 0,
    publishedAt: "Not published",
  },
  {
    id: "5",
    title: "The Rise of Smart Homes: What Buyers Want",
    excerpt: "Smart home technology is no longer a luxury. Discover what features today's buyers are looking for in modern properties.",
    author: "Emily Chen",
    authorInitials: "EC",
    category: "Technology",
    status: "Published",
    views: 1102,
    comments: 31,
    publishedAt: "Feb 28, 2024",
  },
  {
    id: "6",
    title: "Investment Properties: A Beginner's Guide",
    excerpt: "Thinking about investing in real estate? This guide covers everything you need to know to get started.",
    author: "David Kim",
    authorInitials: "DK",
    category: "Investment",
    status: "Draft",
    views: 0,
    comments: 0,
    publishedAt: "Not published",
  },
]

const categories = ["All", "Market Trends", "Buying Guide", "Selling Tips", "Finance", "Technology", "Investment"]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")

  const publishedCount = blogPosts.filter(p => p.status === "Published").length
  const draftCount = blogPosts.filter(p => p.status === "Draft").length
  const totalViews = blogPosts.reduce((acc, p) => acc + p.views, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your blog content
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blog/new">
            <Plus className="mr-2 size-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{publishedCount}</p>
                <p className="text-sm text-muted-foreground">Published Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary p-3">
                <Edit className="size-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{draftCount}</p>
                <p className="text-sm text-muted-foreground">Draft Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <Eye className="size-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Posts</CardTitle>
              <CardDescription>
                Manage your blog posts and track their performance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="All">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                  <Badge 
                    className="absolute top-3 left-3"
                    variant={post.status === "Published" ? "default" : "secondary"}
                  >
                    {post.status}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm"
                  >
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px] bg-muted">
                          {post.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="size-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="size-3 mr-1" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 size-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
