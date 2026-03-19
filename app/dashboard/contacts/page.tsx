"use client"

import { useState } from "react"
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Calendar,
  MessageSquare,
  ArrowUpRight
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const contacts = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    subject: "Interested in Harbor View Condos",
    message: "Hi, I saw the Harbor View Condos listing on your website and I'm very interested. Could you please provide more details about the amenities and schedule a viewing?",
    status: "New",
    source: "Contact Form",
    createdAt: "Mar 18, 2024 at 2:30 PM",
    initials: "SJ",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@company.com",
    phone: "+1 (555) 234-5678",
    subject: "Sunset Villa Estates inquiry",
    message: "I'm looking for a luxury property in Malibu for my family. The Sunset Villa Estates looks perfect. What's the current asking price and are there any other similar properties available?",
    status: "Replied",
    source: "Project Form",
    createdAt: "Mar 17, 2024 at 10:15 AM",
    initials: "MC",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@gmail.com",
    phone: "+1 (555) 345-6789",
    subject: "Commercial property consultation",
    message: "Our company is expanding and we need a new office space in the Chicago area. I saw your Downtown Business Hub listing. Can we schedule a consultation to discuss our requirements?",
    status: "New",
    source: "Contact Form",
    createdAt: "Mar 17, 2024 at 8:45 AM",
    initials: "ER",
  },
  {
    id: "4",
    name: "David Kim",
    email: "dkim@business.net",
    phone: "+1 (555) 456-7890",
    subject: "Investment property advice",
    message: "I'm interested in real estate investment and would like to discuss potential properties that would make good rental investments. Do you offer consultation services for investors?",
    status: "In Progress",
    source: "Contact Form",
    createdAt: "Mar 16, 2024 at 4:20 PM",
    initials: "DK",
  },
  {
    id: "5",
    name: "Jennifer Smith",
    email: "j.smith@email.com",
    phone: "+1 (555) 567-8901",
    subject: "First-time homebuyer questions",
    message: "My husband and I are looking to buy our first home. We're not sure where to start. Could you help guide us through the process? We're particularly interested in properties under $500k.",
    status: "Replied",
    source: "Contact Form",
    createdAt: "Mar 15, 2024 at 11:30 AM",
    initials: "JS",
  },
  {
    id: "6",
    name: "Robert Williams",
    email: "rwilliams@corp.com",
    phone: "+1 (555) 678-9012",
    subject: "Mountain Retreat Lodge viewing",
    message: "I'd like to schedule a viewing of the Mountain Retreat Lodge in Aspen. I'll be in the area next week. What times are available?",
    status: "New",
    source: "Project Form",
    createdAt: "Mar 15, 2024 at 9:00 AM",
    initials: "RW",
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

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null)

  const newCount = contacts.filter(c => c.status === "New").length
  const inProgressCount = contacts.filter(c => c.status === "In Progress").length
  const repliedCount = contacts.filter(c => c.status === "Replied").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-muted-foreground mt-1">
          View and respond to inquiries from your website visitors
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <AlertCircle className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newCount}</p>
                <p className="text-sm text-muted-foreground">New Inquiries</p>
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

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>
            Click on any submission to view the full message and respond
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
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
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="contact">Contact Form</SelectItem>
                  <SelectItem value="project">Project Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contacts Grid */}
          <div className="space-y-3">
            {contacts.map((contact) => {
              const StatusIcon = statusIcons[contact.status as keyof typeof statusIcons]
              return (
                <Dialog key={contact.id}>
                  <DialogTrigger asChild>
                    <div 
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <Avatar className="size-10 mt-0.5">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{contact.name}</p>
                              <Badge variant="outline" className={statusColors[contact.status as keyof typeof statusColors]}>
                                <StatusIcon className="size-3 mr-1" />
                                {contact.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-foreground/80 mt-0.5">
                              {contact.subject}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                              {contact.message}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge variant="secondary" className="text-[10px]">
                              {contact.source}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {contact.createdAt.split(" at ")[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Contact Submission</DialogTitle>
                      <DialogDescription>
                        Received on {contact.createdAt}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {/* Contact Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="size-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {contact.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{contact.name}</h3>
                            <Badge variant="outline" className={statusColors[contact.status as keyof typeof statusColors]}>
                              {contact.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="size-4" />
                              {contact.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="size-4" />
                              {contact.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Message */}
                      <div>
                        <h4 className="font-medium mb-2">{contact.subject}</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {contact.message}
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
                        <Select defaultValue={contact.status.toLowerCase().replace(" ", "-")}>
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
        </CardContent>
      </Card>
    </div>
  )
}
