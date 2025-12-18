'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Avatar, AvatarImage, AvatarFallback, Tabs, TabsList, TabsTrigger, Loading } from '@rocode/ui'
import { Trophy, Flame, Medal, Crown } from 'lucide-react'

export default function LeaderboardPage() {
  const [range, setRange] = useState('weekly')

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', range],
    queryFn: () => api.getLeaderboard(range),
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-zinc-400">Top Luau coders ranked by points</p>
      </div>

      <Tabs value={range} onValueChange={setRange} className="mb-6">
        <TabsList>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="py-20">
          <Loading text="Loading leaderboard..." />
        </div>
      ) : (
        <div className="space-y-2">
          {data?.entries.map((entry: any, index: number) => (
            <Link
              key={entry.userId}
              href={`/u/${entry.username}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="w-12 text-center">
                {entry.rank === 1 ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                ) : entry.rank === 2 ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 flex items-center justify-center mx-auto">
                    <Medal className="h-5 w-5 text-white" />
                  </div>
                ) : entry.rank === 3 ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center mx-auto">
                    <Medal className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <span className="text-xl font-bold text-zinc-400">#{entry.rank}</span>
                )}
              </div>

              <Avatar className="h-12 w-12">
                <AvatarImage src={entry.avatarUrl} alt={entry.username} />
                <AvatarFallback>{entry.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{entry.displayName || entry.username}</p>
                <p className="text-sm text-zinc-400">@{entry.username}</p>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-lg font-bold text-emerald-400">{entry.score}</p>
                  <p className="text-xs text-zinc-500">points</p>
                </div>
                <div>
                  <p className="font-medium">{entry.solvedCount}</p>
                  <p className="text-xs text-zinc-500">solved</p>
                </div>
                {entry.streakDays > 0 && (
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="h-4 w-4" />
                    <span className="font-medium">{entry.streakDays}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}

          {(!data?.entries || data.entries.length === 0) && (
            <div className="text-center py-20">
              <Trophy className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No entries yet. Be the first to solve a problem!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

