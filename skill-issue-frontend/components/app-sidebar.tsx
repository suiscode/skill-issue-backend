"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Swords,
  Wallet,
  User,
  Settings,
  Bell,
  LogOut,
  Zap,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Matches", href: "/create-match", icon: Swords },
  { title: "Wallet", href: "/wallet", icon: Wallet },
  { title: "Profile", href: "/profile", icon: User },
  { title: "Settings", href: "#", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const initials = user?.username.slice(0, 2).toUpperCase() ?? "PX"

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="px-4 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            ARENA
          </span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon
                        className={
                          pathname === item.href ? "text-primary" : ""
                        }
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Notifications
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Notifications">
                  <Bell />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="px-4 py-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.username ?? "arena"}`}
            />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium text-foreground">
              {user?.username ?? "Player"}
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.email ?? "No email"}
            </span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
