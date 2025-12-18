'use client'

import Link from 'next/link'
import { Card, CardContent, Badge, Button } from '@rocode/ui'
import { BookOpen, Target, Briefcase, TrendingUp, ArrowRight, Lock } from 'lucide-react'

const collections = [
  {
    slug: 'interview-prep',
    name: 'Interview Prep',
    description: 'Essential problems to master before your next Roblox developer interview',
    icon: Briefcase,
    color: 'from-blue-500 to-cyan-500',
    problemCount: 25,
    difficulty: 'mixed',
    isPremium: false,
    tags: ['arrays', 'algorithms', 'data-structures'],
  },
  {
    slug: 'beginner-friendly',
    name: 'Beginner Friendly',
    description: 'Start your journey with easy problems designed for newcomers',
    icon: BookOpen,
    color: 'from-emerald-500 to-green-500',
    problemCount: 15,
    difficulty: 'easy',
    isPremium: false,
    tags: ['basics', 'introduction'],
  },
  {
    slug: 'advanced-challenges',
    name: 'Advanced Challenges',
    description: 'Tackle the hardest problems for experienced developers',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    problemCount: 20,
    difficulty: 'hard',
    isPremium: true,
    tags: ['advanced', 'optimization'],
  },
  {
    slug: 'gameplay-systems',
    name: 'Gameplay Systems',
    description: 'Master game mechanics, state machines, and player interactions',
    icon: Target,
    color: 'from-orange-500 to-red-500',
    problemCount: 18,
    difficulty: 'mixed',
    isPremium: false,
    tags: ['gameplay', 'state-machines', 'signals'],
  },
]

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Collections</h1>
        <p className="text-zinc-400">Curated problem sets organized by topic and skill level</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {collections.map((collection) => {
          const Icon = collection.icon
          return (
            <Card key={collection.slug} className="overflow-hidden hover:border-zinc-700 transition-colors">
              <div className={`h-2 bg-gradient-to-r ${collection.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${collection.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{collection.name}</h2>
                        {collection.isPremium && (
                          <Lock className="h-4 w-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">{collection.problemCount} problems</p>
                    </div>
                  </div>
                  <Badge variant="outline">{collection.difficulty}</Badge>
                </div>

                <p className="text-zinc-400 mb-4">{collection.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {collection.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Link href={`/collections/${collection.slug}`}>
                  <Button variant="outline" className="w-full group">
                    View Collection
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
