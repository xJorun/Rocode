'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Input, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge, DifficultyBadge, Loading } from '@rocode/ui'
import { Search, Filter, CheckCircle2, Circle, Minus, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import { PROBLEM_TAGS } from '@rocode/shared'

export default function ProblemsPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [sort, setSort] = useState('popularity')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['problems', { search, difficulty, status, sort, page }],
    queryFn: () => api.getProblems({
      search: search || undefined,
      difficulty: difficulty || undefined,
      status: status || undefined,
      sort,
      page,
      limit: 20,
    }),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Problems</h1>
        <p className="text-zinc-400">Practice Luau coding challenges and improve your skills</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={difficulty || 'all'} onValueChange={(v) => setDifficulty(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="attempted">Attempted</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="acceptance">Acceptance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20">
          <Loading text="Loading problems..." />
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="w-12 px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Title</th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-medium text-zinc-400">Difficulty</th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-medium text-zinc-400 hidden md:table-cell">Acceptance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 hidden lg:table-cell">Tags</th>
                </tr>
              </thead>
              <tbody>
                {data?.problems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {problem.status === 'solved' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : problem.status === 'attempted' ? (
                        <Minus className="h-5 w-5 text-amber-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-zinc-600" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/problems/${problem.slug}`}
                        className="font-medium hover:text-emerald-400 transition-colors flex items-center gap-2"
                      >
                        {problem.title}
                        {problem.isPremium && (
                          <Lock className="h-3.5 w-3.5 text-amber-400" />
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400 hidden md:table-cell">
                      {problem.acceptanceRate}%
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {problem.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{problem.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-zinc-400">
                Showing {(page - 1) * 20 + 1} - {Math.min(page * 20, data.pagination.total)} of {data.pagination.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

