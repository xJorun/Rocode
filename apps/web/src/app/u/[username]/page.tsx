'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Avatar, AvatarImage, AvatarFallback, Badge, DifficultyBadge, StatusBadge, Card, CardContent, Loading } from '@rocode/ui'
import { Flame, Calendar, CheckCircle2, Target, Trophy, Code2 } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string

  const { data, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: () => api.getUser(username),
    enabled: !!username,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading profile..." />
      </div>
    )
  }

  if (!data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">User not found</p>
      </div>
    )
  }

  const { user } = data

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-80">
          <Card className="p-6">
            <div className="text-center mb-6">
              <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-zinc-700">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback className="text-2xl">{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-bold">{user.displayName || user.username}</h1>
              <p className="text-zinc-400">@{user.username}</p>
              {user.planTier !== 'free' && (
                <Badge variant="pro" className="mt-2">
                  {user.planTier === 'pro' ? 'Pro Member' : 'Studio'}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <Flame className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{user.currentStreak}</p>
                <p className="text-xs text-zinc-400">Current Streak</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <Trophy className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{user.maxStreak}</p>
                <p className="text-xs text-zinc-400">Max Streak</p>
              </div>
            </div>

            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </Card>

          {user.badges && user.badges.length > 0 && (
            <Card className="p-6 mt-4">
              <h2 className="font-semibold mb-4">Badges</h2>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge: any) => (
                  <div
                    key={badge.id}
                    className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center"
                    title={badge.name}
                  >
                    <span className="text-2xl">{badge.iconUrl || '🏆'}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Solved Problems
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-emerald-400">{user.solvedCounts?.easy || 0}</span>
                </div>
                <p className="text-sm text-zinc-400">Easy</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-amber-400">{user.solvedCounts?.medium || 0}</span>
                </div>
                <p className="text-sm text-zinc-400">Medium</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-red-400">{user.solvedCounts?.hard || 0}</span>
                </div>
                <p className="text-sm text-zinc-400">Hard</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold">{user.solvedCounts?.total || 0}</p>
              <p className="text-sm text-zinc-400">Total Solved</p>
            </div>
          </Card>

          {user.topTags && user.topTags.length > 0 && (
            <Card className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-400" />
                Top Tags
              </h2>
              <div className="space-y-3">
                {user.topTags.map((tag: any) => (
                  <div key={tag.tag} className="flex items-center gap-3">
                    <Badge variant="outline">{tag.tag}</Badge>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${Math.min(100, (tag.count / Math.max(...user.topTags.map((t: any) => t.count))) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-zinc-400">{tag.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {user.recentSubmissions && user.recentSubmissions.length > 0 && (
            <Card className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-purple-400" />
                Recent Submissions
              </h2>
              <div className="space-y-2">
                {user.recentSubmissions.map((sub: any) => (
                  <Link
                    key={sub.id}
                    href={`/problems/${sub.problem.slug}`}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <StatusBadge status={sub.status} showIcon={false} />
                      <span className="font-medium">{sub.problem.title}</span>
                      <DifficultyBadge difficulty={sub.problem.difficulty} />
                    </div>
                    <span className="text-sm text-zinc-400">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

