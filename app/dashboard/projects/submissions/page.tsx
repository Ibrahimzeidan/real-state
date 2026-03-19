"use client"

import { useState } from "react"
import { 
  Search, 
  Eye, 
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  User,
  MessageSquare
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const submissions = [
  {
    id: "1",
    name: "Michael Chen",
    email: "m.chen@company.com",
    phone: "+1 (555) 234-5678",
    project: "Sunset Villa Estates",
    projectId: "1",
    message: "I'm very interested in this property. I've been looking for a luxury home in Malibu for my family. Could you please provide more details about the amenities, HOA fees, and schedule a private viewing? We're ready to make a decision within the next month.",
    budget: "$2,000,000 - $3,000,000",
    timeline: "Within 1 month",
    status: "New",
    createdAt: "Mar 18, 2024 at 3:45 PM",
    initials: "MC",
  },
  {
    id: "2",
    name: "Sarah Thompson",
    email: "sarah.t@email.com",
    phone: "+1 (555) 345-6789",
    project: "Sunset Villa Estates",
    projectId: "1",
    message: "Beautiful property! I'd love to learn more about the neighborhood and nearby schools. Is there any room for negotiation on the price?",
    budget: "$2,000,000 - $2,500,000",
    timeline: "Within 3 months",
    status: "Replied",
    createdAt: "Mar 17, 2024 at 10:30 AM",
    initials: "ST",
  },
  {
    id: "3",
    name: "Robert Williams",
    email: "rwilliams@corp.com",
    phone: "+1 (555) 678-9012",
    project: "Mountain Retreat Lodge",
    projectId: "3",
    message: "Looking for a vacation property in Aspen. This lodge looks perfect for our needs. Can we schedule a viewing for next week when I'm in the area?",
    budget: "$3,000,000+",
    timeline: "Within 2 months",
    status: "In Progress",
    createdAt: "Mar 16, 2024 at 2:15 PM",
    initials: "RW",
  },
  {
    id: "4",
    name: "Jennifer Adams",
    email: "j.adams@gmail.com",
    phone: "+1 (555) 456-7890",
    project: "Urban Loft Collection",
    projectId: "4",
    message: "I'm an investor interested in purchasing multiple units. What are the rental yield projections for this property? Do you offer any bulk purchase discounts?",
    budget: "$5,000,000+",
    timeline: "Within 6 months",
    status: "New",
    createdAt: "Mar 15, 2024 at 9:00 AM",
    initials: "JA",
  },
  {
    id: "5",
    name: "David Park",
    email: "dpark@business.net",
    phone: "+1 (555) 567-8901",
    project: "Oceanfront Paradise",
    projectId: "5",
    message: "This is exactly what I've been looking for. I'm relocating from New York and need a property by summer. What's the current offer situation?",
    budget: "$4,000,000 - $4,500,000",
    timeline: "Within 2 months",
    status: "New",
    createdAt: "Mar 14, 2024 at 4:30 PM",
    initials: "DP",
  },
]

const statusColors = {
  New: "bg-blue-500/10 text-blue-600 border-blue-200",
  "In Progress": "bg-amber-500/10 text-amber-600 border-amber-200",
  Replied: "bg-primary/10 text-primary border-primary/20",
}

const statusIcons = {
  New: AlertCircle,
  "In Progress": Clock,
  Replied: CheckCircle,
}

export default function ProjectSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const newCount = submissions.filter(s => s.status === "New").length
  const inProgressCount = submissions.filter(s => s.status === "In Progress").length
  const repliedCount = submissions.filter(s => s.status === "Replied").length

  // Group by project
  const projectGroups = submissions.reduce((acc, sub) => {
    if (!acc[sub.project]) {
      acc[sub.project] = []
    }
    acc[sub.project].push(sub)
    return acc
  }, {} as Record<string, typeof submissions>)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Submissions</h1>
        <p className="text-muted-foreground mt-1">
          View interest submissions from your property listings
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-muted p-3">
                <MessageSquare className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <AlertCircle className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newCount}</p>
                <p className="text-sm text-muted-foreground">New</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-500/10 p-3">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <CheckCircle className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{repliedCount}</p>
                <p className="text-sm text-muted-foreground">Replied</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>
            Interest submissions grouped by property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {Object.keys(projectGroups).map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grouped Submissions */}
          <div className="space-y-8">
            {Object.entries(projectGroups).map(([projectName, subs]) => (
              <div key={projectName}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Building className="size-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{projectName}</h3>
                    <p className="text-sm text-muted-foreground">{subs.length} submissions</p>
                  </div>
                </div>
                <div className="space-y-3 pl-11">
                  {subs.map((submission) => {
                    const StatusIcon = statusIcons[submission.status as keyof typeof statusIcons]
                    return (
                      <Dialog key={submission.id}>
                        <DialogTrigger asChild>
                          <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                            <Avatar className="size-10 mt-0.5">
                              <AvatarFallback className="bg-accent/10 text-accent text-sm">
                                {submission.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{submission.name}</p>
                                    <Badge variant="outline" className={statusColors[submission.status as keyof typeof statusColors]}>
                                      <StatusIcon className="size-3 mr-1" />
                                      {submission.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                    {submission.message}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <Badge variant="secondary" className="text-[10px]">
                                    {submission.budget}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {submission.createdAt.split(" at ")[0]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Project Interest Submission</DialogTitle>
                            <DialogDescription>
                              Received on {submission.createdAt}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6 mt-4">
                            {/* Contact Info */}
                            <div className="flex items-start gap-4">
                              <Avatar className="size-12">
                                <AvatarFallback className="bg-accent/10 text-accent">
                                  {submission.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{submission.name}</h3>
                                  <Badge variant="outline" className={statusColors[submission.status as keyof typeof statusColors]}>
                                    {submission.status}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Mail className="size-4" />
                                    {submission.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="size-4" />
                                    {submission.phone}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Property Info */}
                            <div className="p-4 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Building className="size-4 text-primary" />
                                <span className="font-medium">Interested Property</span>
                              </div>
                              <p className="text-lg font-semibold">{submission.project}</p>
                              <div className="flex gap-4 mt-2 text-sm">
                                <span>Budget: <strong>{submission.budget}</strong></span>
                                <span>Timeline: <strong>{submission.timeline}</strong></span>
                              </div>
                            </div>

                            {/* Message */}
                            <div>
                              <h4 className="font-medium mb-2">Message</h4>
                              <p className="text-muted-foreground leading-relaxed">
                                {submission.message}
                              </p>
                            </div>

                            <Separator />

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                              <Button className="flex-1">
                                <Mail className="size-4 mr-2" />
                                Reply via Email
                              </Button>
                              <Button variant="outline">
                                <Phone className="size-4 mr-2" />
                                Call
                              </Button>
                              <Select defaultValue={submission.status.toLowerCase().replace(" ", "-")}>
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="replied">Replied</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
