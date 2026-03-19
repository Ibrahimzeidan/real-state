"use client"

import { 
  FileText, 
  FolderKanban, 
  Mail, 
  User, 
  Edit,
  Plus,
  MessageSquare
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    type: "contact",
    icon: Mail,
    title: "New contact submission",
    description: "Sarah Johnson inquired about Harbor View Condos",
    time: "5 minutes ago",
    user: "SJ",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: 2,
    type: "project",
    icon: Plus,
    title: "New project created",
    description: "Mountain Retreat Lodge was added to listings",
    time: "2 hours ago",
    user: "AD",
    color: "bg-primary/10 text-primary",
  },
  {
    id: 3,
    type: "blog",
    icon: Edit,
    title: "Blog post updated",
    description: '"2024 Real Estate Market Trends" was edited',
    time: "4 hours ago",
    user: "MK",
    color: "bg-accent/10 text-accent",
  },
  {
    id: 4,
    type: "user",
    icon: User,
    title: "New user registered",
    description: "Editor role assigned to david@company.com",
    time: "6 hours ago",
    user: "AD",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    id: 5,
    type: "project",
    icon: MessageSquare,
    title: "Project interest received",
    description: "Mike Chen is interested in Sunset Villa Estates",
    time: "8 hours ago",
    user: "MC",
    color: "bg-primary/10 text-primary",
  },
  {
    id: 6,
    type: "blog",
    icon: FileText,
    title: "Blog post published",
    description: '"5 Tips for First-Time Homebuyers" is now live',
    time: "1 day ago",
    user: "JD",
    color: "bg-accent/10 text-accent",
  },
]

export function RecentActivity() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex gap-4 pl-0">
            {/* Icon */}
            <div className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full ${activity.color}`}>
              <activity.icon className="size-4" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px] bg-muted">
                      {activity.user}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
