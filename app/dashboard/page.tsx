import { 
  FolderKanban, 
  FileText, 
  Mail, 
  Users,
  TrendingUp,
  Eye,
  DollarSign,
  Home
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatsChart } from "@/components/dashboard/stats-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"

const stats = [
  {
    title: "Total Projects",
    value: "24",
    change: "+3 this month",
    icon: FolderKanban,
    trend: "up",
  },
  {
    title: "Blog Posts",
    value: "48",
    change: "+12 this month",
    icon: FileText,
    trend: "up",
  },
  {
    title: "Contact Inquiries",
    value: "156",
    change: "+28 this week",
    icon: Mail,
    trend: "up",
  },
  {
    title: "Active Users",
    value: "8",
    change: "2 admins, 6 editors",
    icon: Users,
    trend: "neutral",
  },
]

const recentProjects = [
  { 
    name: "Sunset Villa Estates", 
    status: "Published", 
    inquiries: 12,
    image: "SV"
  },
  { 
    name: "Harbor View Condos", 
    status: "Draft", 
    inquiries: 0,
    image: "HV"
  },
  { 
    name: "Mountain Retreat Lodge", 
    status: "Published", 
    inquiries: 8,
    image: "MR"
  },
  { 
    name: "Urban Loft Collection", 
    status: "Published", 
    inquiries: 15,
    image: "UL"
  },
]

const quickActions = [
  { title: "Add Project", icon: FolderKanban, href: "/dashboard/projects/new" },
  { title: "Write Blog Post", icon: FileText, href: "/dashboard/blog/new" },
  { title: "View Contacts", icon: Mail, href: "/dashboard/contacts" },
  { title: "Edit Home Page", icon: Home, href: "/dashboard/contents/home" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back, Admin</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your real estate business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <stat.icon className="size-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.trend === "up" && <TrendingUp className="size-3 text-primary" />}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can do right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto flex-col gap-2 py-4 justify-start"
                asChild
              >
                <a href={action.href}>
                  <action.icon className="size-5 text-primary" />
                  <span>{action.title}</span>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart Section */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>Page views over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart />
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest property listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.name} className="flex items-center gap-4">
                <Avatar className="size-10 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                    {project.image}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge 
                      variant={project.status === "Published" ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {project.status}
                    </Badge>
                    {project.inquiries > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="size-3" />
                        {project.inquiries} inquiries
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across your website</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  )
}
