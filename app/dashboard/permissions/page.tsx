"use client"

import { useState } from "react"
import { Save, Shield, ShieldCheck, ShieldAlert, Info } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const roles = [
  { id: "admin", name: "Admin", icon: ShieldCheck, description: "Full system access", color: "text-primary" },
  { id: "editor", name: "Editor", icon: Shield, description: "Content management", color: "text-blue-600" },
  { id: "viewer", name: "Viewer", icon: ShieldAlert, description: "View only", color: "text-muted-foreground" },
]

const permissionCategories = [
  {
    name: "Dashboard",
    permissions: [
      { id: "dashboard.view", name: "View Dashboard", description: "Access to main dashboard overview" },
      { id: "dashboard.analytics", name: "View Analytics", description: "Access to detailed analytics" },
    ],
  },
  {
    name: "Projects",
    permissions: [
      { id: "projects.view", name: "View Projects", description: "View property listings" },
      { id: "projects.create", name: "Create Projects", description: "Add new property listings" },
      { id: "projects.edit", name: "Edit Projects", description: "Modify existing listings" },
      { id: "projects.delete", name: "Delete Projects", description: "Remove property listings" },
      { id: "projects.submissions", name: "View Submissions", description: "Access project interest forms" },
    ],
  },
  {
    name: "Blog",
    permissions: [
      { id: "blog.view", name: "View Posts", description: "View blog posts" },
      { id: "blog.create", name: "Create Posts", description: "Write new blog posts" },
      { id: "blog.edit", name: "Edit Posts", description: "Modify existing posts" },
      { id: "blog.delete", name: "Delete Posts", description: "Remove blog posts" },
      { id: "blog.publish", name: "Publish Posts", description: "Publish or unpublish posts" },
    ],
  },
  {
    name: "News",
    permissions: [
      { id: "news.view", name: "View News", description: "View news articles" },
      { id: "news.create", name: "Create News", description: "Write news articles" },
      { id: "news.edit", name: "Edit News", description: "Modify news articles" },
      { id: "news.delete", name: "Delete News", description: "Remove news articles" },
    ],
  },
  {
    name: "Pages",
    permissions: [
      { id: "pages.home", name: "Edit Home Page", description: "Modify homepage content" },
      { id: "pages.about", name: "Edit About Page", description: "Modify about page content" },
      { id: "pages.services", name: "Edit Services Page", description: "Modify services content" },
    ],
  },
  {
    name: "Contacts",
    permissions: [
      { id: "contacts.view", name: "View Contacts", description: "View contact submissions" },
      { id: "contacts.respond", name: "Respond to Contacts", description: "Reply to inquiries" },
      { id: "contacts.delete", name: "Delete Contacts", description: "Remove contact submissions" },
    ],
  },
  {
    name: "Users",
    permissions: [
      { id: "users.view", name: "View Users", description: "View user list" },
      { id: "users.create", name: "Create Users", description: "Add new users" },
      { id: "users.edit", name: "Edit Users", description: "Modify user accounts" },
      { id: "users.delete", name: "Delete Users", description: "Remove user accounts" },
      { id: "users.roles", name: "Manage Roles", description: "Assign roles to users" },
    ],
  },
  {
    name: "Settings",
    permissions: [
      { id: "settings.view", name: "View Settings", description: "Access system settings" },
      { id: "settings.edit", name: "Edit Settings", description: "Modify system settings" },
    ],
  },
]

// Default permissions for each role
const defaultPermissions: Record<string, string[]> = {
  admin: permissionCategories.flatMap(cat => cat.permissions.map(p => p.id)),
  editor: [
    "dashboard.view",
    "projects.view", "projects.create", "projects.edit",
    "blog.view", "blog.create", "blog.edit", "blog.publish",
    "news.view", "news.create", "news.edit",
    "contacts.view", "contacts.respond",
  ],
  viewer: [
    "dashboard.view",
    "projects.view",
    "blog.view",
    "news.view",
    "contacts.view",
  ],
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(defaultPermissions)

  const togglePermission = (roleId: string, permissionId: string) => {
    setPermissions(prev => {
      const rolePermissions = prev[roleId] || []
      if (rolePermissions.includes(permissionId)) {
        return {
          ...prev,
          [roleId]: rolePermissions.filter(p => p !== permissionId)
        }
      } else {
        return {
          ...prev,
          [roleId]: [...rolePermissions, permissionId]
        }
      }
    })
  }

  const hasPermission = (roleId: string, permissionId: string) => {
    return permissions[roleId]?.includes(permissionId) || false
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Configure role-based access control for your dashboard
          </p>
        </div>
        <Button>
          <Save className="mr-2 size-4" />
          Save Changes
        </Button>
      </div>

      {/* Role Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map((role) => {
          const RoleIcon = role.icon
          const permCount = permissions[role.id]?.length || 0
          const totalPerms = permissionCategories.flatMap(c => c.permissions).length
          return (
            <Card key={role.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <RoleIcon className={`size-5 ${role.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{role.name}</p>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Permissions enabled</span>
                    <Badge variant="secondary">
                      {permCount} / {totalPerms}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>
            Configure which permissions are granted to each role. Admin role has all permissions by default.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="rounded-lg border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Permission</TableHead>
                    {roles.map((role) => {
                      const RoleIcon = role.icon
                      return (
                        <TableHead key={role.id} className="text-center w-[120px]">
                          <div className="flex items-center justify-center gap-2">
                            <RoleIcon className={`size-4 ${role.color}`} />
                            {role.name}
                          </div>
                        </TableHead>
                      )
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionCategories.map((category) => (
                    <>
                      <TableRow key={category.name} className="bg-muted/50">
                        <TableCell colSpan={4} className="font-semibold">
                          {category.name}
                        </TableCell>
                      </TableRow>
                      {category.permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{permission.name}</span>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="size-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{permission.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                          {roles.map((role) => (
                            <TableCell key={role.id} className="text-center">
                              <Checkbox
                                checked={hasPermission(role.id, permission.id)}
                                onCheckedChange={() => togglePermission(role.id, permission.id)}
                                disabled={role.id === "admin"}
                                className="mx-auto"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <Info className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">About Role-Based Access Control</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Permissions determine what actions users can perform in the dashboard. Admin users always have 
                full access and cannot have their permissions modified. When you change permissions for a role, 
                all users with that role will be affected immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
