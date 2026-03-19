"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Calendar,
  Key,
  UserCog
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@horizon.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Today at 2:30 PM",
    createdAt: "Jan 1, 2024",
    permissions: ["all"],
    initials: "AU",
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah@horizon.com",
    role: "Editor",
    status: "Active",
    lastLogin: "Today at 11:45 AM",
    createdAt: "Feb 15, 2024",
    permissions: ["blog", "news"],
    initials: "SM",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@horizon.com",
    role: "Editor",
    status: "Active",
    lastLogin: "Yesterday at 4:20 PM",
    createdAt: "Feb 20, 2024",
    permissions: ["projects", "blog"],
    initials: "MJ",
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily@horizon.com",
    role: "Editor",
    status: "Active",
    lastLogin: "Mar 15, 2024",
    createdAt: "Mar 1, 2024",
    permissions: ["blog"],
    initials: "EC",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@horizon.com",
    role: "Viewer",
    status: "Inactive",
    lastLogin: "Feb 28, 2024",
    createdAt: "Mar 5, 2024",
    permissions: ["view_only"],
    initials: "DK",
  },
  {
    id: "6",
    name: "Jennifer Adams",
    email: "jennifer@horizon.com",
    role: "Editor",
    status: "Active",
    lastLogin: "Today at 9:00 AM",
    createdAt: "Mar 10, 2024",
    permissions: ["projects", "news", "contacts"],
    initials: "JA",
  },
]

const roles = [
  {
    name: "Admin",
    description: "Full access to all features",
    icon: ShieldCheck,
    color: "text-primary",
  },
  {
    name: "Editor",
    description: "Can create and edit assigned content",
    icon: Shield,
    color: "text-blue-600",
  },
  {
    name: "Viewer",
    description: "View-only access to dashboard",
    icon: ShieldAlert,
    color: "text-muted-foreground",
  },
]

const permissionOptions = [
  { id: "projects", label: "Projects", description: "Create and edit property listings" },
  { id: "blog", label: "Blog", description: "Write and publish blog posts" },
  { id: "news", label: "News", description: "Manage news articles" },
  { id: "contacts", label: "Contacts", description: "View and respond to inquiries" },
  { id: "pages", label: "Pages", description: "Edit Home, About, Services pages" },
  { id: "users", label: "Users", description: "Manage user accounts" },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const adminCount = users.filter(u => u.role === "Admin").length
  const editorCount = users.filter(u => u.role === "Editor").length
  const viewerCount = users.filter(u => u.role === "Viewer").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and assign permissions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign their role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.name} value={role.name.toLowerCase()}>
                        <div className="flex items-center gap-2">
                          <role.icon className={`size-4 ${role.color}`} />
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="space-y-3">
                  {permissionOptions.map((permission) => (
                    <div key={permission.id} className="flex items-start gap-3">
                      <Checkbox id={permission.id} className="mt-0.5" />
                      <div>
                        <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                          {permission.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map((role) => {
          const count = role.name === "Admin" ? adminCount : role.name === "Editor" ? editorCount : viewerCount
          return (
            <Card key={role.name}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <role.icon className={`size-5 ${role.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">{role.name}s</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{role.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === "Admin" ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {user.role === "Admin" ? (
                          <ShieldCheck className="size-3" />
                        ) : user.role === "Editor" ? (
                          <Shield className="size-3" />
                        ) : (
                          <ShieldAlert className="size-3" />
                        )}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.includes("all") ? (
                          <Badge variant="outline" className="text-[10px] px-1.5">
                            Full Access
                          </Badge>
                        ) : user.permissions.includes("view_only") ? (
                          <Badge variant="outline" className="text-[10px] px-1.5">
                            View Only
                          </Badge>
                        ) : (
                          user.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-[10px] px-1.5 capitalize">
                              {perm}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "Active" ? "default" : "secondary"}
                        className={user.status === "Active" ? "bg-primary/10 text-primary border-primary/20" : ""}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
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
                            <UserCog className="mr-2 size-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="mr-2 size-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 size-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 size-4" />
                            Delete User
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
