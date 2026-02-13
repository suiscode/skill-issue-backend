"use client"

import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

export function LandingNavbar() {
  const { isAuthenticated, isHydrating, signOut } = useAuth()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            ARENA
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it Works
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Games
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Leaderboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isHydrating ? null : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">View Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
