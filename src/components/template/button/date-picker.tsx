'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format, type Locale } from 'date-fns'
import { id } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  formatStr?: string
  disabledDays?: (date: Date) => boolean
  locale?: Locale
  captionLayout: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label'
  iconPosition?: 'front' | 'end'
  startMonth?: Date
  endMonth?: Date
  required?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pilih tanggal',
  disabled = false,
  className,
  formatStr = 'dd MMMM yyyy',
  disabledDays,
  locale = id,
  captionLayout = 'label',
  iconPosition = 'front',
  startMonth,
  endMonth,
  required = true
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    if (date) {
      setOpen(false)
    }
  }

  const text = value ? format(value, formatStr, { locale }) : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full font-normal',
            iconPosition === 'front'
              ? 'justify-start text-left'
              : 'justify-between',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {iconPosition === 'front' ? (
            <>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {text}
            </>
          ) : (
            <>
              {text}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="top">
        <Calendar
          mode="single"
          captionLayout={captionLayout}
          selected={value}
          onSelect={handleSelect}
          disabled={disabledDays}
          autoFocus={false}
          locale={locale}
          required={required}
          startMonth={startMonth}
          endMonth={endMonth}
        />
      </PopoverContent>
    </Popover>
  )
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  formatStr?: string
  disabledDays?: (date: Date) => boolean
  locale?: Locale
  iconPosition?: 'front' | 'end'
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pilih rentang tanggal',
  disabled = false,
  className,
  formatStr = 'dd MMM yyyy',
  disabledDays,
  locale = id,
  iconPosition = 'front'
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range)
    // Only close when both dates are selected
    if (range?.from && range?.to) {
      setOpen(false)
    }
  }

  const formatDateRange = () => {
    if (value?.from) {
      if (value.to) {
        return `${format(value.from, formatStr, { locale })} - ${format(value.to, formatStr, { locale })}`
      }
      return format(value.from, formatStr, { locale })
    }
    return placeholder
  }

  const text = formatDateRange()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full font-normal',
            iconPosition === 'front'
              ? 'justify-start text-left'
              : 'justify-between',
            !value?.from && 'text-muted-foreground',
            className
          )}
        >
          {iconPosition === 'front' ? (
            <>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {text}
            </>
          ) : (
            <>
              {text}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="top">
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          disabled={disabledDays}
          numberOfMonths={2}
          autoFocus={false}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  )
}

// Form-compatible wrapper for react-hook-form
export interface FormDatePickerProps extends Omit<
  DatePickerProps,
  'value' | 'onChange'
> {
  value?: Date | null
  onChange?: (date: Date | undefined) => void
  error?: boolean
}

export function FormDatePicker({
  value,
  onChange,
  error,
  className,
  ...props
}: FormDatePickerProps) {
  return (
    <DatePicker
      value={value ?? undefined}
      onChange={onChange}
      className={cn(error && 'border-destructive', className)}
      {...props}
    />
  )
}

export interface FormDateRangePickerProps extends Omit<
  DateRangePickerProps,
  'value' | 'onChange'
> {
  value?: DateRange | null
  onChange?: (range: DateRange | undefined) => void
  error?: boolean
}

export function FormDateRangePicker({
  value,
  onChange,
  error,
  className,
  ...props
}: FormDateRangePickerProps) {
  const normalizedValue: DateRange | undefined = value
    ? {
        from: value.from ?? undefined,
        to: value.to ?? undefined
      }
    : undefined

  return (
    <DateRangePicker
      value={normalizedValue}
      onChange={onChange}
      className={cn(error && 'border-destructive', className)}
      {...props}
    />
  )
}
