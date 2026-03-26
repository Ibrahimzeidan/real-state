import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getAuthUserFromToken } from "@/lib/auth";
import { Roles } from "@/lib/permissions";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
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

  if (authUser.role !== Roles.ADMIN) {
    redirect("/");
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider>
        <DashboardSidebar
          basePath="/admin-dashboard"
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
