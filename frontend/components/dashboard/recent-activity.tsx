"use client"

import { 
  FileText, 
  FolderKanban, 
  Mail, 
  User, 
  Edit,
  Plus,
  MessageSquare,
  ShieldCheck,
  Newspaper
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export type ActivityItem = {
  id: string
  type: "contact" | "project" | "blog" | "news" | "user" | "interest" | "audit"
  title: string
  description: string
  time: string
  user: string
}

const iconMap = {
  contact: Mail,
  project: FolderKanban,
  blog: FileText,
  news: Newspaper,
  user: User,
  interest: MessageSquare,
  audit: ShieldCheck,
  edit: Edit,
  create: Plus,
} as const

const colorMap: Record<ActivityItem["type"], string> = {
  contact: "bg-blue-500/10 text-blue-600",
  project: "bg-primary/10 text-primary",
  blog: "bg-accent/10 text-accent",
  news: "bg-sky-500/10 text-sky-600",
  user: "bg-purple-500/10 text-purple-600",
  interest: "bg-primary/10 text-primary",
  audit: "bg-emerald-500/10 text-emerald-600",
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  if (!activities.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No recent activity yet.
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      
      <div className="space-y-6">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type] ?? FileText
          const color = colorMap[activity.type] ?? "bg-muted text-muted-foreground"
          return (
          <div key={activity.id} className="relative flex gap-4 pl-0">
            {/* Icon */}
            <div className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full ${color}`}>
              <Icon className="size-4" />
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
          )
        })}
      </div>
    </div>
  )
}
