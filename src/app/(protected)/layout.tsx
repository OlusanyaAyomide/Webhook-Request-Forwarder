// src/app/(protected)/layout.tsx
"use client";

import { useUser } from "@clerk/nextjs"; // adjust if you're not using Clerk
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBarContent from "@/components/protected/AppSideBarContent";
import { ReactNode } from "react";
import MobileBottomNav from "@/components/protected/MobileBottomNav";
import { MobileWarning } from "@/components/protected/MobileViewWarning";

export default function Layout({ children }: { children: ReactNode }) {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-sm">Setting up ...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSideBarContent>{children}</AppSideBarContent>
      <MobileBottomNav />
      <MobileWarning />
    </SidebarProvider>
  );
}
