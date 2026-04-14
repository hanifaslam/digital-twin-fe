import { cn } from '@/lib/utils'
import React from 'react'

interface AttendanceBadgeProps {
  status?: boolean | null
  isManual?: boolean
  children: React.ReactNode
  className?: string
}

export const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({
  status,
  isManual,
  children,
  className
}) => {
  if (
    (!isManual && (status === null || status === undefined)) ||
    children === '-'
  ) {
    return (
      <p className="w-fit truncate rounded px-2 py-1 text-sm font-medium text-muted-foreground">
        -
      </p>
    )
  }

  const badgeClass = status
    ? 'text-green-700 bg-green-100'
    : 'text-amber-700 bg-amber-100'

  return (
    <p
      className={cn(
        'w-fit truncate rounded px-2 py-1 text-sm font-medium',
        badgeClass,
        className
      )}
    >
      {children}
    </p>
  )
}
