'use client'

import { Input } from '@/components/ui/input'
import { formatWithThousandSeparator, onlyDigits } from '@/lib/utils'
import * as React from 'react'

interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: string
  prefix?: string
}

export function CurrencyInput({
  label,
  prefix = 'Rp',
  value,
  onChange,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(() => {
    if (!value) return ''
    const raw = onlyDigits(String(value))
    return formatWithThousandSeparator(raw)
  })

  React.useEffect(() => {
    if (value !== undefined) {
      const raw = onlyDigits(String(value || ''))
      setDisplayValue(formatWithThousandSeparator(raw))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = onlyDigits(e.target.value)
    const formatted = formatWithThousandSeparator(raw)
    setDisplayValue(formatted)

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: raw }
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div
        className={`flex h-9 overflow-hidden rounded-md border border-input focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] ${
          props.disabled ? 'cursor-not-allowed bg-muted' : 'bg-background'
        }`}
      >
        <span className="text-muted-foreground bg-muted flex items-center border-r px-3 text-sm select-none">
          {prefix}
        </span>
        <Input
          {...props}
          disabled={props.disabled}
          value={displayValue}
          onChange={handleChange}
          inputMode="numeric"
          placeholder={props.placeholder}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent disabled:cursor-not-allowed disabled:opacity-100"
        />
      </div>
    </div>
  )
}
