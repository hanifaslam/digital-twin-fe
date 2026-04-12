import React from 'react'

interface StatusBadgeProps {
  status?: boolean | null
  trueText?: string
  falseText?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  trueText = 'Active',
  falseText = 'Inactive'
}) => {
  if (status === null || status === undefined) {
    return (
      <p className="w-fit truncate rounded px-2 py-1 text-sm font-medium">-</p>
    )
  }

  const className = status
    ? 'w-fit truncate rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-700'
    : 'w-fit truncate rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-700'

  return <p className={className}>{status ? trueText : falseText}</p>
}
