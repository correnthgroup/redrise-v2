import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "@/components/providers/i18n-context"
import { Sonner } from "@/components/ui/sonner"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "Redrise",
  description: "Business automation platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
        <Sonner />
      </body>
    </html>
  )
}
