'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, Input, Button, Badge, Avatar, AvatarImage, AvatarFallback, Tabs, TabsList, TabsTrigger, TabsContent } from '@rocode/ui'
import { Search, MessageSquare, TrendingUp, Clock, ThumbsUp, MessageCircle, Users } from 'lucide-react'

// Mock data - will be replaced with API calls
const mockPosts = [
  {
    id: '1',
    title: 'Best practices for optimizing Luau code',
    author: { username: 'roblox_dev', avatarUrl: null },
    excerpt: 'Here are some tips I learned while optimizing my game...',
    replies: 12,
    likes: 45,
    tags: ['optimization', 'performance'],
    category: 'discussion',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Help with Vector3 math problem',
    author: { username: 'newbie_coder', avatarUrl: null },
    excerpt: 'I\'m stuck on calculating the distance between two points...',
    replies: 5,
    likes: 3,
    tags: ['help', 'vector3'],
    category: 'help',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Weekly challenge solutions discussion',
    author: { username: 'code_master', avatarUrl: null },
    excerpt: 'Share your solutions and approaches for this week\'s challenge!',
    replies: 28,
    likes: 67,
    tags: ['challenge', 'solutions'],
    category: 'discussion',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]

const categories = [
  { id: 'all', label: 'All Posts', icon: MessageSquare },
  { id: 'discussion', label: 'Discussion', icon: MessageCircle },
  { id: 'help', label: 'Help', icon: TrendingUp },
  { id: 'tips', label: 'Tips & Tricks', icon: Users },
]

export default function CommunityPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = !search || post.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const formatTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-zinc-400">Connect with other Roblox developers, share tips, and get help</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64">
          <Card className="p-4 mb-4">
            <Button className="w-full" size="lg">
              Create Post
            </Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatarUrl || undefined} />
                        <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.author.username}</p>
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>

                  <Link href={`/community/${post.id}`}>
                    <h2 className="text-xl font-bold mb-2 hover:text-emerald-400 transition-colors cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-zinc-400 mb-4">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.replies}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
