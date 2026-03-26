import Link from "next/link";
import type { ComponentType } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Briefcase,
  FileText,
  FolderKanban,
  Mail,
  MessageSquare,
  Newspaper,
  Shield,
  Users,
} from "lucide-react";

import { connectToDatabase } from "@/lib/db";
import { getAuthUserFromToken } from "@/lib/auth";
import { Roles } from "@/lib/permissions";
import { AuditLog } from "@/models/auditLog";
import { Blog } from "@/models/blog";
import { ContactSubmission } from "@/models/contactSubmission";
import { News } from "@/models/news";
import { PageContent } from "@/models/pageContent";
import { Project } from "@/models/project";
import { ProjectInterest } from "@/models/projectInterest";
import { Service } from "@/models/service";
import { User } from "@/models/user";
import { StatsChart } from "@/components/dashboard/stats-chart";
import { RecentActivity, type ActivityItem } from "@/components/dashboard/recent-activity";
import { UserManagement } from "@/components/dashboard/user-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
}

function formatDateTime(value?: Date | string | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return dateTimeFormatter.format(date);
}

function getInitials(name?: string | null) {
  if (!name) return "NA";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || "NA";
}

function truncateText(text: string, length = 80) {
  if (text.length <= length) return text;
  return `${text.slice(0, length - 3)}...`;
}

type StatCardProps = {
  title: string;
  value: number;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
};

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {description ? (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const authUser = await getAuthUserFromToken(token);
  if (!authUser) {
    redirect("/login");
  }

  if (authUser.role !== Roles.ADMIN) {
    redirect("/");
  }

  await connectToDatabase();

  const [
    usersCount,
    blogsCount,
    newsCount,
    projectsCount,
    contactsCount,
    interestsCount,
    servicesCount,
    pagesCount,
    auditCount,
    adminCount,
    blogEditorCount,
    projectEditorCount,
    viewerCount,
  ] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    News.countDocuments(),
    Project.countDocuments(),
    ContactSubmission.countDocuments(),
    ProjectInterest.countDocuments(),
    Service.countDocuments(),
    PageContent.countDocuments(),
    AuditLog.countDocuments(),
    User.countDocuments({ role: Roles.ADMIN }),
    User.countDocuments({ role: Roles.BLOG_EDITOR }),
    User.countDocuments({ role: Roles.PROJECT_EDITOR }),
    User.countDocuments({ role: Roles.VIEWER }),
  ]);

  const [
    userRows,
    contactRows,
    interestRows,
    blogRows,
    newsRows,
    projectRows,
    pageRows,
    serviceRows,
    auditRows,
  ] = await Promise.all([
    User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    ContactSubmission.find().sort({ createdAt: -1 }).limit(6).lean(),
    ProjectInterest.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("projectId", "title")
      .lean(),
    Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("authorId", "name email")
      .lean(),
    News.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("authorId", "name email")
      .lean(),
    Project.find().sort({ createdAt: -1 }).limit(5).lean(),
    PageContent.find().sort({ updatedAt: -1 }).limit(5).lean(),
    Service.find().sort({ createdAt: -1 }).limit(5).lean(),
    AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("actorId", "name email")
      .lean(),
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    blogDates,
    newsDates,
    projectDates,
    pageDates,
    contactDates,
    interestDates,
  ] = await Promise.all([
    Blog.find({ createdAt: { $gte: sevenDaysAgo } })
      .select("createdAt")
      .lean(),
    News.find({ createdAt: { $gte: sevenDaysAgo } })
      .select("createdAt")
      .lean(),
    Project.find({ createdAt: { $gte: sevenDaysAgo } })
      .select("createdAt")
      .lean(),
    PageContent.find({ updatedAt: { $gte: sevenDaysAgo } })
      .select("updatedAt")
      .lean(),
    ContactSubmission.find({ createdAt: { $gte: sevenDaysAgo } })
      .select("createdAt")
      .lean(),
    ProjectInterest.find({ createdAt: { $gte: sevenDaysAgo } })
      .select("createdAt")
      .lean(),
  ]);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + index);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });

  const bucketMap = new Map(
    days.map((day) => [
      day.key,
      { day: day.label, content: 0, inquiries: 0 },
    ]),
  );

  const bump = (value: Date | string | null | undefined, field: "content" | "inquiries") => {
    if (!value) return;
    const date = value instanceof Date ? value : new Date(value);
    const key = date.toISOString().slice(0, 10);
    const bucket = bucketMap.get(key);
    if (bucket) {
      bucket[field] += 1;
    }
  };

  blogDates.forEach((item: { createdAt: Date }) => bump(item.createdAt, "content"));
  newsDates.forEach((item: { createdAt: Date }) => bump(item.createdAt, "content"));
  projectDates.forEach((item: { createdAt: Date }) => bump(item.createdAt, "content"));
  pageDates.forEach((item: { updatedAt?: Date }) => bump(item.updatedAt, "content"));
  contactDates.forEach((item: { createdAt: Date }) => bump(item.createdAt, "inquiries"));
  interestDates.forEach((item: { createdAt: Date }) => bump(item.createdAt, "inquiries"));

  const chartData = days.map((day) => bucketMap.get(day.key)!);

  const activities: Array<
    ActivityItem & { createdAt: Date }
  > = [];

  auditRows.forEach((row: any) => {
    activities.push({
      id: row._id.toString(),
      type: "audit",
      title: `${String(row.action).toUpperCase()} ${row.entityType}`,
      description: row.changes
        ? `Changes: ${Object.keys(row.changes).join(", ")}`
        : `Entity ${row.entityId}`,
      time: formatDateTime(row.createdAt),
      user: getInitials(row.actorId?.name),
      createdAt: row.createdAt,
    });
  });

  contactRows.forEach((row: any) => {
    activities.push({
      id: row._id.toString(),
      type: "contact",
      title: "New contact submission",
      description: `${row.name} - ${row.email}`,
      time: formatDateTime(row.createdAt),
      user: getInitials(row.name),
      createdAt: row.createdAt,
    });
  });

  interestRows.forEach((row: any) => {
    const projectTitle =
      typeof row.projectId === "object" && row.projectId?.title
        ? row.projectId.title
        : "Project";
    activities.push({
      id: row._id.toString(),
      type: "interest",
      title: "Project interest",
      description: `${row.name} - ${projectTitle}`,
      time: formatDateTime(row.createdAt),
      user: getInitials(row.name),
      createdAt: row.createdAt,
    });
  });

  blogRows.forEach((row: any) => {
    activities.push({
      id: row._id.toString(),
      type: "blog",
      title: "New blog post",
      description: row.title,
      time: formatDateTime(row.createdAt),
      user: getInitials(row.authorId?.name),
      createdAt: row.createdAt,
    });
  });

  newsRows.forEach((row: any) => {
    activities.push({
      id: row._id.toString(),
      type: "news",
      title: "News published",
      description: row.title,
      time: formatDateTime(row.createdAt),
      user: getInitials(row.authorId?.name),
      createdAt: row.createdAt,
    });
  });

  projectRows.forEach((row: any) => {
    activities.push({
      id: row._id.toString(),
      type: "project",
      title: "New project",
      description: row.title,
      time: formatDateTime(row.createdAt),
      user: getInitials(row.title),
      createdAt: row.createdAt,
    });
  });

  userRows.slice(0, 6).forEach((row: any) => {
    activities.push({
      id: row._id.toString(),
      type: "user",
      title: "New user",
      description: `${row.name} - ${row.email}`,
      time: formatDateTime(row.createdAt),
      user: getInitials(row.name),
      createdAt: row.createdAt,
    });
  });

  const activityFeed = activities
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)
    .map(({ createdAt, ...item }) => item);

  const usersForManagement = userRows.map((user: any) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
  }));

  const permissionMatrix = [
    {
      role: "ADMIN",
      blogs: "Create / Edit / Delete",
      projects: "Create / Edit / Delete",
      services: "Create / Edit / Delete",
      pages: "Edit content",
      dashboard: "Admin dashboard",
    },
    {
      role: "BLOG_EDITOR",
      blogs: "Create / Edit / Delete",
      projects: "Read only",
      services: "Read only",
      pages: "Read only",
      dashboard: "Editor (blogs/news)",
    },
    {
      role: "PROJECT_EDITOR",
      blogs: "Read only",
      projects: "Create / Edit / Delete",
      services: "Read only",
      pages: "Read only",
      dashboard: "Editor (projects)",
    },
    {
      role: "VIEWER",
      blogs: "Read only",
      projects: "Read only",
      services: "Read only",
      pages: "Read only",
      dashboard: "No dashboard",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor content, submissions, and access control in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={usersCount}
          description="Active accounts across roles."
          icon={Users}
        />
        <StatCard
          title="Blogs"
          value={blogsCount}
          description="Published posts."
          icon={FileText}
        />
        <StatCard
          title="News"
          value={newsCount}
          description="Published updates."
          icon={Newspaper}
        />
        <StatCard
          title="Projects"
          value={projectsCount}
          description="Active listings."
          icon={FolderKanban}
        />
        <StatCard
          title="Contact Submissions"
          value={contactsCount}
          description="New inquiries."
          icon={Mail}
        />
        <StatCard
          title="Project Interests"
          value={interestsCount}
          description="Leads on projects."
          icon={MessageSquare}
        />
        <StatCard
          title="Content Pages"
          value={pagesCount}
          description="Managed pages."
          icon={FileText}
        />
        <StatCard
          title="Services"
          value={servicesCount}
          description="Service entries."
          icon={Briefcase}
        />
        <StatCard
          title="Audit Events"
          value={auditCount}
          description="Logged changes."
          icon={Shield}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content vs Inquiries</CardTitle>
            <CardDescription>Last 7 days activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activityFeed} />
          </CardContent>
        </Card>
      </div>

      <section id="users" className="scroll-mt-24">
        <Card>
          <CardHeader>
            <CardTitle>Users and Roles</CardTitle>
            <CardDescription>Manage permissions and access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Admins: {adminCount}</Badge>
              <Badge variant="secondary">Blog editors: {blogEditorCount}</Badge>
              <Badge variant="secondary">Project editors: {projectEditorCount}</Badge>
              <Badge variant="secondary">Viewers: {viewerCount}</Badge>
            </div>
            <UserManagement
              users={usersForManagement}
              currentUserId={authUser.id}
            />
          </CardContent>
        </Card>
      </section>

      <section id="permissions" className="scroll-mt-24">
        <Card>
          <CardHeader>
            <CardTitle>Permissions Summary</CardTitle>
            <CardDescription>Roles and what each role can do.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Blogs & News</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Dashboard</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionMatrix.map((item) => (
                  <TableRow key={item.role}>
                    <TableCell className="font-medium">{item.role}</TableCell>
                    <TableCell className="text-muted-foreground">{item.blogs}</TableCell>
                    <TableCell className="text-muted-foreground">{item.projects}</TableCell>
                    <TableCell className="text-muted-foreground">{item.services}</TableCell>
                    <TableCell className="text-muted-foreground">{item.pages}</TableCell>
                    <TableCell className="text-muted-foreground">{item.dashboard}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="contacts" className="scroll-mt-24">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>Latest messages from the site.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactRows.length ? (
                    contactRows.map((row: any) => (
                      <TableRow key={row._id.toString()}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {truncateText(row.message, 70)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(row.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground">
                        No contact submissions yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section id="interests" className="scroll-mt-24">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Project Interests</CardTitle>
              <CardDescription>Recent project inquiries.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interestRows.length ? (
                    interestRows.map((row: any) => {
                      const projectTitle =
                        typeof row.projectId === "object" &&
                        row.projectId?.title
                          ? row.projectId.title
                          : "Project";
                      return (
                        <TableRow key={row._id.toString()}>
                          <TableCell className="font-medium">
                            {row.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {row.email}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {projectTitle}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(row.createdAt)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground">
                        No project interests yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>

      <section id="content" className="scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Content Overview</h2>
            <p className="text-sm text-muted-foreground">
              Latest updates across blogs, news, projects, pages, and services.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            View site
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <Card id="blogs">
            <CardHeader>
              <CardTitle>Latest Blogs</CardTitle>
              <CardDescription>Newest posts created.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {blogRows.length ? (
                blogRows.map((row: any) => (
                  <div
                    key={row._id.toString()}
                    className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.authorId?.name || "Unknown author"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(row.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No blog posts yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card id="news">
            <CardHeader>
              <CardTitle>Latest News</CardTitle>
              <CardDescription>Latest company updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {newsRows.length ? (
                newsRows.map((row: any) => (
                  <div
                    key={row._id.toString()}
                    className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.authorId?.name || "Unknown author"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(row.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No news yet.</p>
              )}
            </CardContent>
          </Card>

          <Card id="projects">
            <CardHeader>
              <CardTitle>Latest Projects</CardTitle>
              <CardDescription>Newest listings created.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectRows.length ? (
                projectRows.map((row: any) => (
                  <div
                    key={row._id.toString()}
                    className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {truncateText(row.description, 60)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(row.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No projects yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card id="services">
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Available service offerings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {serviceRows.length ? (
                serviceRows.map((row: any) => (
                  <div
                    key={row._id.toString()}
                    className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {truncateText(row.description, 60)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(row.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No services yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>Latest page updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length ? (
                    pageRows.map((row: any) => (
                      <TableRow key={row._id.toString()}>
                        <TableCell className="font-medium">
                          {row.pageName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(row.updatedAt || row.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-muted-foreground">
                        No content pages yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card id="audit">
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Tracked changes for security.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditRows.length ? (
                    auditRows.map((row: any) => (
                      <TableRow key={row._id.toString()}>
                        <TableCell className="font-medium">
                          {String(row.action).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.entityType}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.actorId?.name || "System"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(row.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground">
                        No audit events yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
