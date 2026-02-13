"use client"

import { Mail, User, ShieldCheck } from "lucide-react"
import { TopNavbar } from "@/components/top-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  return (
    <>
      <TopNavbar title="Profile" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <User className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Username</p>
                  <p className="text-sm font-medium">{user?.username ?? "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user?.email ?? "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Verification</p>
                  <p className="text-sm font-medium">Email verified</p>
                </div>
              </div>
              <Button variant="destructive" onClick={signOut}>
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
