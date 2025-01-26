import React from "react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MainNav } from "@/components/nav/main-nav.tsx";
import { MobileMenu } from "@/components/nav/mobile-menu.tsx";
import { Sidebar } from "@/components/nav/sidebar.tsx";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <MainNav />
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">{children}</main>
      </div>
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </div>
  );
}
