"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Home,
  Briefcase,
  FolderKanban,
  FileText,
  KeyRound,
  Mail,
  Users,
  Shield,
  Building2,
  MessageSquare,
  Newspaper,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type DashboardSidebarProps = {
  basePath?: string
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function DashboardSidebar({ basePath, user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const base = basePath || "/admin"

  const overviewNavItems = [
    {
      title: "Overview",
      url: base,
      icon: LayoutDashboard,
    },
    {
      title: "Users & Roles",
      url: `${base}#users`,
      icon: Users,
    },
    {
      title: "Admin Access",
      url: `${base}#admin-access`,
      icon: KeyRound,
    },
    {
      title: "Permissions",
      url: `${base}#permissions`,
      icon: Shield,
    },
    {
      title: "Contacts",
      url: `${base}#contacts`,
      icon: Mail,
    },
    {
      title: "Project Interests",
      url: `${base}#interests`,
      icon: MessageSquare,
    },
    {
      title: "Audit Log",
      url: `${base}#audit`,
      icon: Shield,
    },
  ]

  const contentNavItems = [
    {
      title: "Content Pages",
      url: `${base}#content`,
      icon: Home,
    },
    {
      title: "Blogs",
      url: `${base}/blogs`,
      icon: FileText,
    },
    {
      title: "News",
      url: `${base}/news`,
      icon: Newspaper,
    },
    {
      title: "Projects",
      url: `${base}/projects`,
      icon: FolderKanban,
    },
    {
      title: "Services",
      url: `${base}/services`,
      icon: Briefcase,
    },
  ]

  const profileName = user?.name || "Admin User"
  const profileEmail = user?.email || "admin@example.com"
  const initials =
    profileName
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={base}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ibrahim's Realty</span>
                  <span className="truncate text-xs opacity-70">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{profileName}</span>
                <span className="truncate text-xs opacity-70">{profileEmail}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
