'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, Badge, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Avatar, AvatarImage, AvatarFallback, Tabs, TabsList, TabsTrigger, TabsContent } from '@rocode/ui'
import { Code2, ThumbsUp, MessageSquare, Clock, Star, Filter, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth'

// Mock data - will be replaced with API calls
const mockReviews = [
  {
    id: '1',
    submission: {
      id: 'sub1',
      problem: {
        slug: 'vector-distance',
        title: 'Calculate Vector Distance',
        difficulty: 'easy',
      },
      author: {
        username: 'coder123',
        avatarUrl: null,
      },
    },
    reviewer: {
      username: 'senior_dev',
      avatarUrl: null,
    },
    rating: 5,
    feedback: 'Great solution! Clean code and efficient algorithm. Consider adding comments for clarity.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    helpful: 12,
    comments: 3,
  },
  {
    id: '2',
    submission: {
      id: 'sub2',
      problem: {
        slug: 'state-machine',
        title: 'Game State Machine',
        difficulty: 'medium',
      },
      author: {
        username: 'newbie_dev',
        avatarUrl: null,
      },
    },
    reviewer: {
      username: 'code_master',
      avatarUrl: null,
    },
    rating: 4,
    feedback: 'Solid implementation! The logic is correct but you could optimize the state transitions. Here\'s a suggestion...',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    helpful: 8,
    comments: 1,
  },
]

export default function ReviewsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('recent')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Code Reviews</h1>
        <p className="text-zinc-400">Get feedback on your code or help others improve their solutions</p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Reviews</TabsTrigger>
          <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="flex gap-4 mb-6">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="my-submissions">My Submissions</SelectItem>
                <SelectItem value="high-rated">Highly Rated</SelectItem>
                <SelectItem value="needs-review">Needs Review</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id} className="hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.reviewer.avatarUrl || undefined} />
                        <AvatarFallback>{review.reviewer.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.reviewer.username}</p>
                        <p className="text-sm text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-zinc-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="h-4 w-4 text-zinc-400" />
                      <Link
                        href={`/problems/${review.submission.problem.slug}`}
                        className="font-medium hover:text-emerald-400 transition-colors"
                      >
                        {review.submission.problem.title}
                      </Link>
                      <Badge variant="outline" className="text-xs">
                        {review.submission.problem.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">
                      By{' '}
                      <Link
                        href={`/u/${review.submission.author.username}`}
                        className="hover:text-emerald-400 transition-colors"
                      >
                        @{review.submission.author.username}
                      </Link>
                    </p>
                  </div>

                  <p className="text-zinc-300 mb-4 whitespace-pre-wrap">{review.feedback}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        {review.helpful} helpful
                      </button>
                      <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        {review.comments} comments
                      </button>
                    </div>
                    <Link href={`/reviews/${review.id}`}>
                      <Button variant="outline" size="sm">
                        View Full Review
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-reviews">
          <Card>
            <CardContent className="p-6">
              <p className="text-zinc-400 text-center py-8">
                You haven't submitted any reviews yet. Start reviewing code to help the community!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <p className="text-zinc-400 text-center py-8">
                No submissions waiting for review. Submit solutions to get feedback from the community!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
