'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card } from '@rocode/ui'
import { Loading } from '@rocode/ui'
import { DifficultyBadge } from '@rocode/ui'
import { Button } from '@rocode/ui'
import Link from 'next/link'
import { Calendar, Trophy, Users } from 'lucide-react'

export default function DailyChallengePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['daily', 'today'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4000/daily/today', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Loading text="Loading daily challenge..." />
      </div>
    )
  }

  if (!data?.challenge) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-zinc-400" />
          <h2 className="text-2xl font-bold mb-2 text-zinc-100">No Challenge Today</h2>
          <p className="text-zinc-400">Check back tomorrow for a new challenge!</p>
        </Card>
      </div>
    )
  }

  const { challenge, userSolved } = data

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">Daily Challenge</h1>
            <p className="text-zinc-400">{new Date(challenge.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-zinc-100">{challenge.problem.title}</h2>
              <DifficultyBadge difficulty={challenge.problem.difficulty} />
            </div>
            {userSolved && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                <Trophy className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Solved!</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-400 mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{challenge.problem.acceptedCount} solved</span>
            </div>
            <div>
              <span>{challenge.problem.acceptanceRate}% acceptance</span>
            </div>
          </div>

          <Link href={`/problems/${challenge.problem.slug}`}>
            <Button className="w-full">
              {userSolved ? 'View Problem' : 'Start Challenge'}
            </Button>
          </Link>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Current Streak</h3>
            <p className="text-2xl font-bold text-zinc-100">0 days</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Best Streak</h3>
            <p className="text-2xl font-bold text-zinc-100">0 days</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Total Challenges</h3>
            <p className="text-2xl font-bold text-zinc-100">0</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

