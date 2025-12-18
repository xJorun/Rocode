import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800 text-zinc-300',
        primary: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        secondary: 'bg-zinc-700 text-zinc-200',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        destructive: 'bg-red-500/20 text-red-400 border border-red-500/30',
        outline: 'border border-zinc-700 text-zinc-400',
        pro: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

