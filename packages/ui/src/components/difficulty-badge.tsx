import * as React from 'react'
import { cn } from '../utils'
import type { Difficulty } from '@rocode/shared'

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

const difficultyConfig = {
  easy: {
    label: 'Easy',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  hard: {
    label: 'Hard',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

