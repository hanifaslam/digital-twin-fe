'use client'

import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { SearchIcon, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  onSearch: (searchTerm: string) => void
  onChange?: (value: string) => void
  className?: string
  value?: string
  debounceMs?: number
}

export default function SearchInput({
  placeholder = 'Search...',
  onSearch,
  onChange,
  className,
  value,
  debounceMs = 1000
}: SearchInputProps) {
  const [searchInput, setSearchInput] = useState(value || '')
  const [prevValue, setPrevValue] = useState(value)
  const onSearchRef = useRef(onSearch)

  useLayoutEffect(() => {
    onSearchRef.current = onSearch
  })

  if (value !== prevValue) {
    setPrevValue(value)
    setSearchInput(value || '')
  }

  const debouncedSearchTerm = useDebounce(searchInput, debounceMs)

  useEffect(() => {
    onSearchRef.current(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchInput)
    }
  }

  const handleClear = () => {
    setSearchInput('')
    onSearch('')
  }

  return (
    <div className={cn('relative max-w-md', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="text-muted-foreground h-4 w-4" aria-hidden />
      </div>

      <Input
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value)
          if (onChange) onChange(e.target.value)
        }}
        onKeyDown={handleSearch}
        className="w-full pr-10 pl-9"
      />

      {searchInput && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
