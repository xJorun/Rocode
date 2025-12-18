'use client'

import Link from 'next/link'
import { Card, CardContent, Badge, Button, Input } from '@rocode/ui'
import { Search, MapPin, Briefcase, DollarSign, Building2, ArrowRight, Star } from 'lucide-react'
import { useState } from 'react'

// Mock job listings - will be replaced with API calls
const mockJobs = [
  {
    id: '1',
    title: 'Senior Luau Developer',
    company: 'Epic Games Studio',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $180k',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    description: 'We are looking for an experienced Roblox developer to join our team...',
    tags: ['luau', 'roblox', 'game-development'],
    featured: true,
  },
  {
    id: '2',
    title: 'Roblox Game Developer',
    company: 'Indie Studio',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$80k - $120k',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: 'Join our creative team building the next hit Roblox game...',
    tags: ['luau', 'roblox', 'ui'],
    featured: false,
  },
  {
    id: '3',
    title: 'Backend Developer - Roblox Platform',
    company: 'Tech Corp',
    location: 'Remote',
    type: 'Contract',
    salary: '$100/hr',
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    description: 'Help us build scalable backend systems for Roblox games...',
    tags: ['backend', 'luau', 'networking'],
    featured: false,
  },
]

export default function CareersPage() {
  const [search, setSearch] = useState('')

  const filteredJobs = mockJobs.filter(job => {
    return !search || 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  })

  const featuredJobs = filteredJobs.filter(job => job.featured)
  const regularJobs = filteredJobs.filter(job => !job.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Career Opportunities</h1>
        <p className="text-zinc-400">Discover Roblox developer jobs from top studios and companies</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search jobs by title, company, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {featuredJobs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-amber-400" />
            <h2 className="text-2xl font-bold">Featured Opportunities</h2>
          </div>
          <div className="space-y-4">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="border-2 border-amber-500/20 hover:border-amber-500/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold">{job.title}</h3>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                          Featured
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-zinc-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                      </div>
                      <p className="text-zinc-400 mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link href={`/careers/${job.id}`}>
                      <Button className="group">
                        Apply Now
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">All Opportunities</h2>
        <div className="space-y-4">
          {regularJobs.map((job) => (
            <Card key={job.id} className="hover:border-zinc-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                    <div className="flex items-center gap-4 text-zinc-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                    </div>
                    <p className="text-zinc-400 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={`/careers/${job.id}`}>
                    <Button variant="outline" className="group">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-400">No jobs found. Try a different search.</p>
        </div>
      )}
    </div>
  )
}
