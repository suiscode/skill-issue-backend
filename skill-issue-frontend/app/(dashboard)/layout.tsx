"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isHydrating } = useAuth()

  useEffect(() => {
    if (!isHydrating && !isAuthenticated) {
      router.replace("/signin")
    }
  }, [isAuthenticated, isHydrating, router])

  if (isHydrating || !isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
