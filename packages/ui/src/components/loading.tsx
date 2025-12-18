import * as React from 'react'
import { cn } from '../utils'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Loading({ className, size = 'md', text }: LoadingProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-emerald-400', sizeMap[size])} />
      {text && <span className="text-sm text-zinc-400">{text}</span>}
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <Loading size="lg" text="Loading..." />
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loading size="md" />
    </div>
  )
}

