import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/use-toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "LinkHub - Your Link Management Platform",
    template: "%s | LinkHub",
  },
  description: "Create and share your personalized link page with QR code",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "LinkHub",
    title: "LinkHub - Your Link Management Platform",
    description: "Create and share your personalized link page with QR code",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkHub - Your Link Management Platform",
    description: "Create and share your personalized link page with QR code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
