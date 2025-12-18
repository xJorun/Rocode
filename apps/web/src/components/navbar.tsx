'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, Avatar, AvatarImage, AvatarFallback, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, Badge, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@rocode/ui'
import { Code2, Trophy, Building2, ChevronDown, User, Settings, LogOut, Crown, BookOpen, MessageSquare, FileText, Briefcase, FileCode } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { cn } from '@rocode/ui'

const navItems = [
  { href: '/problems', label: 'Problems', icon: Code2 },
  { href: '/collections', label: 'Collections', icon: BookOpen },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/community', label: 'Community', icon: MessageSquare },
  { href: '/blog', label: 'Blog', icon: FileText },
  { href: '/reviews', label: 'Reviews', icon: FileCode },
  { href: '/careers', label: 'Careers', icon: Briefcase },
  { href: '/studio', label: 'Studio', icon: Building2 },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-zinc-900" />
            </div>
            <span className="font-bold text-lg">RoCode</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-800 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">{user.displayName || user.username}</span>
                  {user.planTier === 'pro' && (
                    <Badge variant="pro" className="hidden sm:flex">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium">{user.displayName || user.username}</p>
                  <p className="text-xs text-zinc-400">@{user.username}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/u/${user.username}`} className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {user.planTier === 'free' && (
                  <DropdownMenuItem asChild>
                    <Link href="/billing" className="flex items-center text-emerald-400">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-400">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button>Sign in with Roblox</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

