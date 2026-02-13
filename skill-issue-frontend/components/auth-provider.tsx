"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type AuthUser = {
  id: string
  email: string
  username: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isHydrating: boolean
  setSession: (payload: {
    accessToken: string
    refreshToken: string
    user: AuthUser
  }) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isHydrating, setIsHydrating] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    const storedToken = localStorage.getItem("accessToken")
    const storedRefreshToken = localStorage.getItem("refreshToken")
    if (storedUser && storedToken && storedRefreshToken) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser)
      } catch {
        localStorage.removeItem("currentUser")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    } else {
      localStorage.removeItem("currentUser")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
    setIsHydrating(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isHydrating,
      setSession: (payload) => {
        localStorage.setItem("accessToken", payload.accessToken)
        localStorage.setItem("refreshToken", payload.refreshToken)
        localStorage.setItem("currentUser", JSON.stringify(payload.user))
        setUser(payload.user)
      },
      signOut: () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("currentUser")
        setUser(null)
      },
    }),
    [isHydrating, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
