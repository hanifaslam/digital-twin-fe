'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import * as React from 'react'

interface SuffixInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  suffixes: string[]
  defaultSuffix?: string
  onSuffixChange?: (suffix: string) => void
}

export function SuffixInput({
  suffixes,
  defaultSuffix,
  value,
  onChange,
  onSuffixChange,
  className,
  ...props
}: SuffixInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(() => {
    if (value === undefined || value === null) return ''
    return String(value)
  })

  const [selectedSuffix, setSelectedSuffix] = React.useState<string>(
    defaultSuffix || suffixes[0] || ''
  )

  React.useEffect(() => {
    if (defaultSuffix) {
      setSelectedSuffix(defaultSuffix)
    }
  }, [defaultSuffix])

  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(String(value ?? ''))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      setDisplayValue(inputValue)

      if (onChange) {
        onChange(e)
      }
    }
  }

  const isInteractive = !!onSuffixChange

  return (
    <div
      className={cn(
        'flex overflow-hidden rounded-md border h-9 border-input bg-background focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        className
      )}
    >
      <Input
        {...props}
        value={displayValue}
        onChange={handleChange}
        inputMode="numeric"
        className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-full"
      />
      {isInteractive ? (
        <Select
          value={selectedSuffix}
          onValueChange={(val) => {
            setSelectedSuffix(val)
            onSuffixChange?.(val)
          }}
        >
          <SelectTrigger className="w-fit border-0 border-l rounded-none bg-muted px-3 h-full focus:ring-0 shadow-none text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
            <SelectValue placeholder={selectedSuffix} />
          </SelectTrigger>
          <SelectContent align="end">
            {suffixes.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-muted-foreground bg-muted flex items-center border-l px-3 text-sm font-medium select-none justify-center min-w-[3rem]">
          {selectedSuffix}
        </div>
      )}
    </div>
  )
}
