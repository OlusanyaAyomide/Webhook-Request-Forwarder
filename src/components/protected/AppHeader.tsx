"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import clsx from "clsx";
import { ArrowLeft, LogOut, Settings, MoreVertical, Moon, Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";


import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

import { useSidebar } from "../ui/sidebar";
import { useClerk, useUser } from "@clerk/nextjs";
import { ProgressLink } from "./ProgressLink";

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false)

  const { open } = useSidebar()

  const { user } = useUser();

  const { signOut } = useClerk();

  const segments = pathname.split("/").filter(Boolean);
  const pageTitle =
    segments.length === 0
      ? "Dashboard"
      : segments[segments.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

  const showBackButton = segments.length > 1;

  const initials = () => {
    return (user?.firstName && user.lastName) ?
      user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
      : "N/A"
  }

  useEffect(() => {
    if (isMounted) return
    setIsMounted(true)
  }, [isMounted])

  return (
    <div
      className={clsx(
        "fixed top-0 right-0 z-30 border-b bg-background px-4 flex items-center justify-between",
        "h-[85px] border-b-[var(--muted)]",
        "w-full",
        open ? "md:w-[calc(100vw-200px)] lg:w-[calc(100vw-280px)]" : "md:w-[calc(100vw-70px)] lg:w-[calc(100vw-70px)]"
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1
          className={clsx(
            "text-foreground font-semibold tracking-tight",
            showBackButton ? "text-3xl" : "text-2xl"
          )}
        >
          {pageTitle}
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Theme toggle switch */}
        {
          isMounted && (
            <div className="flex items-center gap-2">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Switch
                id="theme-switch"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          )
        }
        {/* Avatar */}
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-sm font-semibold text-foreground">
          {initials()}
        </div>

        {/* Menu toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 p-0 border-[var(--input)]">
            {/* Settings */}
            <ProgressLink href="/settings">
              <DropdownMenuItem className="cursor-pointer h-12 hover:bg-[var(--primary)]/5">
                <Settings className="mr-2 h-4 w-4" />
                View More (Settings)
              </DropdownMenuItem>
            </ProgressLink>
            {/* Logout */}
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer h-12 hover:bg-[var(--primary)]/5"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="w-full flex mt-3 gap-3 justify-around">
            <Button
              variant={"outline"}
              className="h-10 md:w-[220px] lg:h-12 bg-transparent border" onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="h-10 md:h-12 md:w-[220px] text-white bg-[var(--primary)]"
              onClick={() => {
                signOut({ redirectUrl: "/sign-in" })
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
