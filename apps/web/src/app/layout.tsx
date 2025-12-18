import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: {
    default: 'RoCode - Roblox LeetCode for Luau',
    template: '%s | RoCode',
  },
  description: 'Practice Luau problems, compete on leaderboards, and get hired by Roblox studios.',
  keywords: ['Roblox', 'Luau', 'coding', 'programming', 'leetcode', 'practice', 'interview'],
  authors: [{ name: 'RoCode' }],
  creator: 'RoCode',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://rocode.dev',
    siteName: 'RoCode',
    title: 'RoCode - Roblox LeetCode for Luau',
    description: 'Practice Luau problems, compete on leaderboards, and get hired by Roblox studios.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoCode - Roblox LeetCode for Luau',
    description: 'Practice Luau problems, compete on leaderboards, and get hired by Roblox studios.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

