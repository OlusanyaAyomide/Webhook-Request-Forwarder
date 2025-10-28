"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "../ui/sidebar";
import {
  LayoutDashboard,
  FolderGit2,
  Settings as SettingsIcon,
  Webhook,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import AppHeader from "./AppHeader";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function AppSideBarContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const { open, setOpen } = useSidebar()

  const [isMounted, setIsMounted] = useState(false)

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderGit2,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
  ];

  useEffect(() => {
    if (isMounted) return
    setIsMounted(true)
  }, [isMounted])

  return (
    <div className="w-full relative">
      <AppHeader />
      <div className="flex w-full relative">
        <Sidebar collapsible="icon" className={`
        flex border-r border-[var(--muted)] bg-background sticky top-0 transition-all duration-300 ${open ? "md:w-[200px] lg:w-[280px]" : "w-[70px]"} left-0 h-screen shrink-0  backdrop-blur-xl
        `}>
          <div className="flex items-center">
            <SidebarHeader className={` flex flex-row  border-[var(--muted)] ${open ? "p-6 w-full" : "w-11 p-2 mt-4"} transition-all duration-500`}>
              <div className="flex items-center gap-2">
                <div className="bg-[var(--primary)] p-2 rounded-lg">
                  <Webhook className="w-5 h-5" style={{ color: "white" }} />
                </div>
                <div className={`transition-all duration-300 ${open ? "" : "text-[0px]"}`}>
                  <h2 className="font-semibold">WH<span className="max-lg:hidden ml-1">Forwarder</span><span className="lg:hidden">F</span></h2>
                </div>
              </div>
            </SidebarHeader>
            {
              isMounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    `rounded-full transition-all z-40 relative duration-500 hover:bg-[var(--primary)]/10
                    ${open ? "-translate-x-2" : "-translate-x-9 translate-y-12"}
                    `
                  }
                  onClick={() => setOpen(!open)}
                >
                  {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </Button>
              )
            }
          </div>
          {/* Navigation */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className={open ? "mt-7" : "mt-14"}>
                  {links.map(({ name, href, icon: Icon }) => {
                    const isActive =
                      pathname === href || pathname.startsWith(`${href}/`);

                    return (
                      <SidebarMenuItem key={href} className="mb-5">
                        <Link href={href} className="block">
                          <Tooltip delayDuration={100}>
                            <TooltipProvider>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  data-active={isActive}
                                  className={clsx(
                                    "flex items-center gap-3 relative px-3 h-12 py-2 rounded-lg transition-all duration-200",
                                    " hover:bg-[var(--primary)]/5",
                                    "data-[active=true]:text-white data-[active=true]:bg-transparent",
                                    "data-[active=true]:before:h-12 data-[active=true]:before:top-0 data-[active=true]:before:-left-2 data-[active=true]:before:w-[4px] data-[active=true]:text-[var(--primary)] data-[active=true]:before:bg-[var(--primary)]",
                                    isActive ? "data-[active=true]:before:hidden" : "",
                                    open ? " data-[active=true]:hover:scale-105" : "",
                                    !open && isActive ? "data-[active=true]:scale-125" : ""
                                  )}
                                >
                                  <span>
                                    <Icon className={"w-4 h-4"} />
                                  </span>
                                  {
                                    !open && (
                                      <TooltipContent className="py-2" side="right">
                                        <span className="text-sm">{name}</span>
                                      </TooltipContent>
                                    )
                                  }
                                  <span className="text-base">{name}</span>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                            </TooltipProvider>
                          </Tooltip>
                        </Link>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div
            className={clsx(
              "border-t border-[var(--muted)] flex items-centertransition-all duration-500 ",
              open ? "p-4 w-full gap-3 " : "p-2 w-6 verflow-hidden"
            )}
          >
            {/* Avatar Circle with Initials */}
            <div className="flex items-center justify-center rounded-full bg-[var(--primary)] font-semibold w-10 h-10 shrink-0">
              O A
            </div>

            {/* User Details (only when open) */}
            {open && (
              <div className="flex flex-col transition-all duration-500 overflow-hidden">
                <span className="text-sm font-semibold">
                  {"Olusanya Ayomide"}
                </span>
                <span className="text-xs truncate max-w-[140px]">
                  olusanyaayomide76@gmail.com
                </span>
              </div>
            )}
          </div>
        </Sidebar>
        {/* Main content */}
        <main className="flex-1 pt-26 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

    </div>

  );
}
