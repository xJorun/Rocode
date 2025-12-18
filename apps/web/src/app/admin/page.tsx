'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@rocode/ui'
import { Input } from '@rocode/ui'
import { Card } from '@rocode/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rocode/ui'
import { Loading } from '@rocode/ui'

export default function AdminPage() {
  const queryClient = useQueryClient()
  const [selectedTab, setSelectedTab] = useState('problems')

  const { data: problemsData, isLoading } = useQuery({
    queryKey: ['admin', 'problems'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4000/admin/problems', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch')
      return response.json()
    },
  })

  const setDailyChallengeMutation = useMutation({
    mutationFn: async ({ date, problemId }: { date: string; problemId: string }) => {
      const response = await fetch('http://localhost:4000/admin/daily-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date, problemId }),
      })
      if (!response.ok) throw new Error('Failed to set daily challenge')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily'] })
    },
  })

  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedProblemId, setSelectedProblemId] = useState('')

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Loading text="Loading admin panel..." />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-zinc-100">Admin Dashboard</h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="daily">Daily Challenge</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="problems" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">All Problems</h2>
            <div className="space-y-2">
              {problemsData?.problems?.map((problem: any) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between p-3 bg-zinc-900 rounded border border-zinc-800"
                >
                  <div>
                    <h3 className="font-medium text-zinc-100">{problem.title}</h3>
                    <p className="text-sm text-zinc-400">{problem.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      problem.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                      problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                    {problem.publishedAt ? (
                      <span className="text-xs text-zinc-400">Published</span>
                    ) : (
                      <span className="text-xs text-zinc-500">Draft</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">Set Daily Challenge</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Date</label>
                <Input
                  type="date"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                  className="w-64"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Problem</label>
                <select
                  value={selectedProblemId}
                  onChange={(e) => setSelectedProblemId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-100"
                >
                  <option value="">Select a problem</option>
                  {problemsData?.problems?.map((problem: any) => (
                    <option key={problem.id} value={problem.id}>
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => {
                  if (selectedProblemId && dailyDate) {
                    setDailyChallengeMutation.mutate({
                      date: dailyDate,
                      problemId: selectedProblemId,
                    })
                  }
                }}
                disabled={!selectedProblemId || !dailyDate || setDailyChallengeMutation.isPending}
              >
                {setDailyChallengeMutation.isPending ? 'Setting...' : 'Set Daily Challenge'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">Analytics</h2>
            <p className="text-zinc-400">Analytics dashboard coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

