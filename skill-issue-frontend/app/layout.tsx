import React from "react"
import type { Metadata, Viewport } from "next"
import { Sora, IBM_Plex_Mono } from "next/font/google"
import { AppApolloProvider } from "@/components/apollo-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "ARENA - Competitive Gaming Platform",
  description:
    "Play. Compete. Win Real Money. Create 5v5 matches with real money bets on the most trusted competitive gaming platform.",
}

export const viewport: Viewport = {
  themeColor: "#0d1117",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sora.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <AppApolloProvider>
            {children}
            <Toaster position="top-right" />
          </AppApolloProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
