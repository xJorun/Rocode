'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Loading, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Input } from '@rocode/ui'
import { Building2, Plus, Users, FileText, ArrowRight, Lock, BarChart3 } from 'lucide-react'

export default function StudioPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Building2 className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Studio Portal</h1>
        <p className="text-zinc-400 mb-6">Sign in to access the studio portal</p>
        <Link href="/auth/login">
          <Button>Sign in with Roblox</Button>
        </Link>
      </div>
    )
  }

  if (user.planTier !== 'studio') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Building2 className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Studio Portal</h1>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Create coding assessments, evaluate candidates, and hire the best Roblox developers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <FileText className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Create Assessments</h3>
            <p className="text-sm text-zinc-400">
              Build custom coding tests from our problem bank or create your own.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Users className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Evaluate Candidates</h3>
            <p className="text-sm text-zinc-400">
              Get detailed reports on candidate performance, code quality, and timing.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Lock className="h-10 w-10 text-purple-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Private Problems</h3>
            <p className="text-sm text-zinc-400">
              Create private problems with hidden test cases for your assessments.
            </p>
          </Card>
        </div>

        <Card className="border-emerald-500/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Ready to hire better developers?</h2>
            <p className="text-zinc-400 mb-6">
              Contact our sales team to set up your Studio account.
            </p>
            <Button size="lg">
              Contact Sales
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <StudioDashboard />
}

function StudioDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Studio Dashboard</h1>
          <p className="text-zinc-400">Manage your assessments and candidates</p>
        </div>
        <div className="flex gap-2">
          <Link href="/studio/analytics">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-zinc-400 mb-1">Total Assessments</p>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-zinc-400 mb-1">Active Invites</p>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-zinc-400 mb-1">Candidates Evaluated</p>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-zinc-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No assessments yet</p>
            <p className="text-sm">Create your first assessment to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

