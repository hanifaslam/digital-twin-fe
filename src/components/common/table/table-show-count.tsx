'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface TableShowCountProps {
  value: number
  onChange: (value: number) => void
  options?: number[]
  className?: string
  label?: string
}

export function TableShowCount({
  value,
  onChange,
  options = [10, 25, 50, 100],
  className,
  label = 'Show'
}: TableShowCountProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm whitespace-nowrap text-gray-600">{label}</span>
      <Select
        value={value.toString()}
        onValueChange={(newValue) => onChange(parseInt(newValue, 10))}
      >
        <SelectTrigger className="h-8 w-auto min-w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
