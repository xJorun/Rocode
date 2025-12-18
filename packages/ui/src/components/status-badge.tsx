import * as React from 'react'
import { cn } from '../utils'
import { Check, X, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import type { SubmissionStatus } from '@rocode/shared'

interface StatusBadgeProps {
  status: SubmissionStatus
  className?: string
  showIcon?: boolean
}

const statusConfig: Record<SubmissionStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending: {
    label: 'Pending',
    className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    icon: Clock,
  },
  running: {
    label: 'Running',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Loader2,
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: Check,
  },
  wrong_answer: {
    label: 'Wrong Answer',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: X,
  },
  runtime_error: {
    label: 'Runtime Error',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: AlertTriangle,
  },
  time_limit: {
    label: 'Time Limit',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Clock,
  },
  memory_limit: {
    label: 'Memory Limit',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: AlertTriangle,
  },
  compilation_error: {
    label: 'Compile Error',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: X,
  },
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className={cn('h-3 w-3', status === 'running' && 'animate-spin')} />}
      {config.label}
    </span>
  )
}

