import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AppApolloProvider } from "@/components/apollo-provider"
import { AuthProvider } from "@/components/auth-provider"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <AppApolloProvider>{children}</AppApolloProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
