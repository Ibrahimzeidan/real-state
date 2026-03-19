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
  Clock,
  Newspaper
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const newsArticles = [
  {
    id: "1",
    title: "Horizon Realty Expands to Miami Market",
    excerpt: "We're excited to announce our expansion into the vibrant Miami real estate market.",
    category: "Company News",
    status: "Published",
    publishedAt: "Mar 18, 2024",
    author: "Admin User",
  },
  {
    id: "2",
    title: "Q1 2024 Market Report Released",
    excerpt: "Our comprehensive Q1 2024 market analysis reveals interesting trends in luxury real estate.",
    category: "Market Report",
    status: "Published",
    publishedAt: "Mar 15, 2024",
    author: "Sarah Miller",
  },
  {
    id: "3",
    title: "New Partnership with Local Banks",
    excerpt: "We've partnered with leading local banks to offer exclusive mortgage rates to our clients.",
    category: "Company News",
    status: "Published",
    publishedAt: "Mar 10, 2024",
    author: "Admin User",
  },
  {
    id: "4",
    title: "Award Recognition: Best Luxury Agency 2024",
    excerpt: "Horizon Realty has been named Best Luxury Real Estate Agency for the third consecutive year.",
    category: "Awards",
    status: "Published",
    publishedAt: "Mar 5, 2024",
    author: "Mike Johnson",
  },
  {
    id: "5",
    title: "Upcoming: Spring Property Showcase Event",
    excerpt: "Join us for our exclusive spring property showcase featuring our finest luxury listings.",
    category: "Events",
    status: "Draft",
    publishedAt: "Not published",
    author: "Emily Chen",
  },
  {
    id: "6",
    title: "New Technology Platform Launch",
    excerpt: "We're launching a new digital platform to enhance your property search experience.",
    category: "Company News",
    status: "Draft",
    publishedAt: "Not published",
    author: "Admin User",
  },
]

const categories = ["All", "Company News", "Market Report", "Awards", "Events"]

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const publishedCount = newsArticles.filter(n => n.status === "Published").length
  const draftCount = newsArticles.filter(n => n.status === "Draft").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News</h1>
          <p className="text-muted-foreground mt-1">
            Manage company news and announcements
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/news/new">
            <Plus className="mr-2 size-4" />
            Add News
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Newspaper className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newsArticles.length}</p>
                <p className="text-sm text-muted-foreground">Total Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-chart-1/10 p-3">
                <Eye className="size-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">{publishedCount}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <Clock className="size-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{draftCount}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>All News Articles</CardTitle>
          <CardDescription>
            View and manage all news articles and announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search news..."
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

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {article.excerpt}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {article.author}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={article.status === "Published" ? "default" : "secondary"}
                      >
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {article.publishedAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
