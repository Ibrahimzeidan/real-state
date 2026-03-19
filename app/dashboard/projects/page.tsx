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
  Filter,
  ArrowUpDown,
  Building,
  MapPin,
  DollarSign
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const projects = [
  {
    id: "1",
    title: "Sunset Villa Estates",
    location: "Malibu, California",
    type: "Residential",
    price: "$2,450,000",
    status: "Published",
    inquiries: 12,
    createdAt: "2024-01-15",
    image: "SV",
  },
  {
    id: "2",
    title: "Harbor View Condos",
    location: "Miami, Florida",
    type: "Condo",
    price: "$890,000",
    status: "Draft",
    inquiries: 0,
    createdAt: "2024-02-20",
    image: "HV",
  },
  {
    id: "3",
    title: "Mountain Retreat Lodge",
    location: "Aspen, Colorado",
    type: "Vacation",
    price: "$3,200,000",
    status: "Published",
    inquiries: 8,
    createdAt: "2024-01-28",
    image: "MR",
  },
  {
    id: "4",
    title: "Urban Loft Collection",
    location: "New York, NY",
    type: "Commercial",
    price: "$1,750,000",
    status: "Published",
    inquiries: 15,
    createdAt: "2024-02-05",
    image: "UL",
  },
  {
    id: "5",
    title: "Oceanfront Paradise",
    location: "San Diego, California",
    type: "Residential",
    price: "$4,100,000",
    status: "Published",
    inquiries: 23,
    createdAt: "2024-02-12",
    image: "OP",
  },
  {
    id: "6",
    title: "Downtown Business Hub",
    location: "Chicago, Illinois",
    type: "Commercial",
    price: "$5,500,000",
    status: "Draft",
    inquiries: 0,
    createdAt: "2024-03-01",
    image: "DB",
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your property listings and view inquiries
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 size-4" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Building className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
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
                <p className="text-2xl font-bold">58</p>
                <p className="text-sm text-muted-foreground">Total Inquiries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-chart-3/10 p-3">
                <DollarSign className="size-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold">$17.8M</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>
            View and manage all your property listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
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
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Projects Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Inquiries</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                            {project.image}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-3" />
                            {project.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{project.price}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={project.status === "Published" ? "default" : "secondary"}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="size-3 text-muted-foreground" />
                        {project.inquiries}
                      </span>
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
