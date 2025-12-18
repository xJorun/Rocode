'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, Badge, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Loading } from '@rocode/ui'
import { TrendingUp, Users, CheckCircle2, Clock, Target, Award, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'

// Mock data - will be replaced with API calls
const mockAnalytics = {
  overview: {
    totalCandidates: 156,
    completedAssessments: 142,
    averageScore: 78.5,
    averageTime: 45.2,
  },
  topPerformers: [
    {
      id: '1',
      username: 'candidate1',
      score: 95,
      timeSpent: 38,
      completedAt: new Date(),
    },
    {
      id: '2',
      username: 'candidate2',
      score: 92,
      timeSpent: 42,
      completedAt: new Date(),
    },
    {
      id: '3',
      username: 'candidate3',
      score: 88,
      timeSpent: 50,
      completedAt: new Date(),
    },
  ],
  performanceDistribution: {
    excellent: 23,
    good: 45,
    average: 52,
    needsImprovement: 22,
  },
  recentAssessments: [
    {
      id: '1',
      candidateName: 'John Doe',
      assessmentName: 'Junior Developer Assessment',
      score: 85,
      status: 'completed',
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      candidateName: 'Jane Smith',
      assessmentName: 'Senior Developer Assessment',
      score: 92,
      status: 'completed',
      completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ],
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [selectedAssessment, setSelectedAssessment] = useState('all')
  const [timeRange, setTimeRange] = useState('30d')

  // TODO: Replace with actual API call
  // const { data, isLoading } = useQuery({
  //   queryKey: ['studio-analytics', selectedAssessment, timeRange],
  //   queryFn: () => api.getStudioAnalytics({ assessmentId: selectedAssessment, timeRange }),
  //   enabled: !!user,
  // })

  const analytics = mockAnalytics

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessment Analytics</h1>
        <p className="text-zinc-400">Track candidate performance and insights from your assessments</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Assessment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assessments</SelectItem>
            <SelectItem value="assessment1">Junior Developer Assessment</SelectItem>
            <SelectItem value="assessment2">Senior Developer Assessment</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold">{analytics.overview.totalCandidates}</p>
            <p className="text-sm text-zinc-400">Total Candidates</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold">{analytics.overview.completedAssessments}</p>
            <p className="text-sm text-zinc-400">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-amber-400" />
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold">{analytics.overview.averageScore}%</p>
            <p className="text-sm text-zinc-400">Average Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-purple-400" />
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold">{analytics.overview.averageTime}m</p>
            <p className="text-sm text-zinc-400">Avg. Time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Performance Distribution */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Distribution
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Excellent (90%+)</span>
                  <span className="text-sm text-zinc-400">{analytics.performanceDistribution.excellent}</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${(analytics.performanceDistribution.excellent / analytics.overview.totalCandidates) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Good (75-89%)</span>
                  <span className="text-sm text-zinc-400">{analytics.performanceDistribution.good}</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(analytics.performanceDistribution.good / analytics.overview.totalCandidates) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Average (60-74%)</span>
                  <span className="text-sm text-zinc-400">{analytics.performanceDistribution.average}</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${(analytics.performanceDistribution.average / analytics.overview.totalCandidates) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Needs Improvement (&lt;60%)</span>
                  <span className="text-sm text-zinc-400">{analytics.performanceDistribution.needsImprovement}</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(analytics.performanceDistribution.needsImprovement / analytics.overview.totalCandidates) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </h2>
            <div className="space-y-4">
              {analytics.topPerformers.map((performer, index) => (
                <div key={performer.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">@{performer.username}</p>
                      <p className="text-xs text-zinc-400">{performer.timeSpent}m • {performer.score}%</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {performer.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Completions</h2>
          <div className="space-y-3">
            {analytics.recentAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{assessment.candidateName}</p>
                  <p className="text-sm text-zinc-400">{assessment.assessmentName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {assessment.score}%
                  </Badge>
                  <span className="text-sm text-zinc-400">
                    {new Date(assessment.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
