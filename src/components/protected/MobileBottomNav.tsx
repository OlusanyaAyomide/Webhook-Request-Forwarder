"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Home, Folder, Settings, BarChart } from "lucide-react";
import { ProgressLink } from "./ProgressLink";
import clsx from "clsx";

const navItems = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Folder,
    label: "Projects",
    href: "/projects",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--sidebar)] border-t border-[var(--sidebar-border)] safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          console.log(active)

          return (
            <ProgressLink
              key={item.href}
              href={item.href}
              className="flex-1"
            >
              <button
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                  active
                    ? "text-[var(--sidebar-primary)]"
                    : "text-[var(--sidebar-foreground)]"
                )}
              >
                <Icon
                  className={clsx(
                    "h-5 w-5 transition-all",
                    active && "scale-110"
                  )}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </ProgressLink>
          );
        })}
      </div>
    </nav>
  );
}