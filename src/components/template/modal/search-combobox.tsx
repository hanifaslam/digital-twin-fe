'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { debounce } from 'lodash'
import { Check, ChevronDown, Loader2, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type Option<T = Record<string, unknown>> = {
  label: string
  value: string
  labelComponent?: React.ReactNode
} & T

interface ComboBoxProps {
  value?: string | null
  onChange?: (val: string | null) => void
  options: Option[]
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  onSearchChange?: (val: string) => void
  isLoading?: boolean
  error?: boolean
  errorText?: string
  disableLocalSearch?: boolean
  autoFillSearch?: boolean
}

export function SearchComboBox({
  value,
  onChange,
  options,
  placeholder = 'Select item...',
  emptyText = 'No results found.',
  disabled,
  className,
  onSearchChange,
  isLoading = false,
  error = false,
  errorText = 'Failed to load items.',
  disableLocalSearch = false,
  autoFillSearch = false
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const debouncedOnSearchChange = useMemo(
    () => debounce(onSearchChange || (() => {}), 400),
    [onSearchChange]
  )

  useEffect(() => {
    return () => debouncedOnSearchChange.cancel()
  }, [debouncedOnSearchChange])

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        setSearchValue('')
        debouncedOnSearchChange.cancel()
      } else {
        if (autoFillSearch) {
          const currentSelectedLabel =
            options.find((opt) => opt.value === (value ?? ''))?.label ?? ''
          setSearchValue(currentSelectedLabel)
          debouncedOnSearchChange(currentSelectedLabel)
        } else {
          debouncedOnSearchChange('')
        }
        debouncedOnSearchChange.flush()
      }
    },
    [debouncedOnSearchChange, autoFillSearch, options, value]
  )

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchValue(val)
      debouncedOnSearchChange(val)
    },
    [debouncedOnSearchChange]
  )

  const selectedLabel =
    options.find((opt) => opt.value === (value ?? ''))?.label ?? ''
  const selectedLabelComponent = options.find(
    (opt) => opt.value === (value ?? '')
  )?.labelComponent
  const filteredOptions = useMemo(() => {
    if (disableLocalSearch) return options
    if (!searchValue.trim()) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue, disableLocalSearch])

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            !selectedLabelComponent &&
              !selectedLabel &&
              'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          {selectedLabelComponent || selectedLabel || placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter={false} filter={() => 1}>
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>

          <CommandList>
            {error && <CommandEmpty>{errorText}</CommandEmpty>}
            {!isLoading && filteredOptions.length === 0 && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}

            <CommandGroup>
              {filteredOptions.map((opt, index) => (
                <div
                  key={opt.value || `option-${index}`}
                  className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm"
                  onClick={() => {
                    onChange?.(opt.value)
                    setOpen(false)
                  }}
                >
                  {opt.labelComponent || <span>{opt.label}</span>}
                  <Check
                    className={cn(
                      'h-4 w-4',
                      value === opt.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
