'use client'

import { ReactNode } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { SidebarProvider } from "../ui/sidebar"
import AppSideBarContent from "./AppSideBarContent"

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSideBarContent>
          {children}
        </AppSideBarContent>
      </SidebarProvider>
    </NextThemesProvider>
  )
}
