import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getAuthUserFromToken } from "@/lib/auth";
import { Roles } from "@/lib/permissions";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardHeader } from "@/components/dashboard/header";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectEditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const authUser = await getAuthUserFromToken(token);
  if (!authUser) {
    redirect("/login");
  }

  if (![Roles.ADMIN, Roles.PROJECT_EDITOR].includes(authUser.role)) {
    redirect("/");
  }

  const navItems = [
    { title: "Projects", url: "/editor/projects", icon: "projects" },
  ];

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider>
        <EditorSidebar
          title="Project Editor"
          subtitle="Projects"
          navItems={navItems}
          user={{ name: authUser.name, email: authUser.email }}
        />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex-1 p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
