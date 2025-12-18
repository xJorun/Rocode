'use client'

import Link from 'next/link'
import { Card, CardContent, Badge } from '@rocode/ui'
import { Gamepad2, Layout, Database, Building2, ArrowRight } from 'lucide-react'

const tracks = [
  {
    slug: 'gameplay',
    name: 'Gameplay Systems',
    description: 'Master game mechanics, cooldowns, state machines, and player interactions',
    icon: Gamepad2,
    color: 'from-emerald-500 to-green-500',
    problemCount: 12,
    tags: ['state-machines', 'cooldowns', 'signals', 'inventory'],
  },
  {
    slug: 'ui',
    name: 'UI & UX Patterns',
    description: 'Build responsive and intuitive user interfaces with animation logic',
    icon: Layout,
    color: 'from-purple-500 to-pink-500',
    problemCount: 10,
    tags: ['ui-logic', 'animation', 'input-handling'],
  },
  {
    slug: 'data',
    name: 'Data Structures',
    description: 'Learn efficient data organization and classic algorithms',
    icon: Database,
    color: 'from-cyan-500 to-blue-500',
    problemCount: 15,
    tags: ['arrays', 'tables', 'trees', 'graphs'],
  },
  {
    slug: 'architecture',
    name: 'Architecture',
    description: 'Design scalable and maintainable game systems',
    icon: Building2,
    color: 'from-orange-500 to-red-500',
    problemCount: 8,
    tags: ['networking', 'optimization', 'patterns'],
  },
]

export default function TracksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Tracks</h1>
        <p className="text-zinc-400">Curated problem sets to master specific areas of Roblox development</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tracks.map((track) => (
          <Link key={track.slug} href={`/tracks/${track.slug}`}>
            <Card className="h-full hover:border-zinc-700 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center shrink-0`}>
                    <track.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold group-hover:text-emerald-400 transition-colors">
                        {track.name}
                      </h2>
                      <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-zinc-400 text-sm mb-4">{track.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {track.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-sm text-zinc-500">{track.problemCount} problems</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

