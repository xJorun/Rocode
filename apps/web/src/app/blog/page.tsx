'use client'

import Link from 'next/link'
import { Card, CardContent, Badge, Button, Input } from '@rocode/ui'
import { Search, Calendar, User, ArrowRight, BookOpen, Code, TrendingUp } from 'lucide-react'
import { useState } from 'react'

// Mock articles - will be replaced with API calls
const mockArticles = [
  {
    id: '1',
    title: 'Mastering Vector3 Math in Roblox',
    excerpt: 'Learn how to efficiently work with Vector3 operations and optimize your spatial calculations in Roblox games.',
    author: { name: 'Roblox Team', avatarUrl: null },
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    readTime: '8 min read',
    category: 'tutorial',
    tags: ['vector3', 'math', 'optimization'],
    image: null,
  },
  {
    id: '2',
    title: '10 Luau Patterns Every Developer Should Know',
    excerpt: 'Discover the most common and useful coding patterns used by professional Roblox developers.',
    author: { name: 'Code Master', avatarUrl: null },
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    readTime: '12 min read',
    category: 'guides',
    tags: ['patterns', 'best-practices', 'luau'],
    image: null,
  },
  {
    id: '3',
    title: 'Optimizing Game Performance: A Deep Dive',
    excerpt: 'Advanced techniques for identifying and fixing performance bottlenecks in your Roblox games.',
    author: { name: 'Performance Pro', avatarUrl: null },
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    readTime: '15 min read',
    category: 'advanced',
    tags: ['performance', 'optimization', 'profiling'],
    image: null,
  },
]

const categories = [
  { id: 'all', label: 'All Articles', icon: BookOpen },
  { id: 'tutorial', label: 'Tutorials', icon: Code },
  { id: 'guides', label: 'Guides', icon: TrendingUp },
]

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = !search || article.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Blog & Articles</h1>
        <p className="text-zinc-400">Learn from expert developers and stay up to date with Roblox development</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-4 justify-center mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:border-zinc-700 transition-colors flex flex-col">
            {article.image && (
              <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20" />
            )}
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="mb-3">
                <Badge variant="outline" className="mb-2">{article.category}</Badge>
                <Link href={`/blog/${article.id}`}>
                  <h2 className="text-xl font-bold mb-2 hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {article.author.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.publishedAt.toLocaleDateString()}
                  </div>
                  <span>{article.readTime}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Link href={`/blog/${article.id}`}>
                  <Button variant="outline" className="w-full group">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-400">No articles found. Try a different search or category.</p>
        </div>
      )}
    </div>
  )
}
