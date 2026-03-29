'use client'

import { XCircleIcon } from '@/components/icons/x-circle-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { debounce } from 'lodash'
import { Check, ChevronDown, Loader2, Plus } from 'lucide-react'
import * as React from 'react'

export interface MultiSelectItem {
  id: string
  name: string
}

export interface MultiSelectProps<T extends MultiSelectItem> {
  value?: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  addPlaceholder?: string
  disabled?: boolean
  searchPlaceholder?: string
  emptyText?: string
  loadingText?: string
  errorText?: string
  showAddButton?: boolean
  onAddNew?: () => void
  addButtonText?: string
  items: T[]
  isLoading?: boolean
  error?: boolean
  onSearch?: (query: string) => void
  renderItem?: (item: T, checked: boolean) => React.ReactNode
  onCreateNew?: (name: string) => Promise<void>
  onRefreshItems?: () => void
  isCreating?: boolean
  maxDisplay?: number
  maxDisplayAuto?: boolean
}

export function MultiSelect<T extends MultiSelectItem>(
  props: MultiSelectProps<T>
) {
  const {
    value,
    onChange,
    placeholder = 'Choose items',
    disabled,
    searchPlaceholder = 'Search items...',
    emptyText = 'No items found.',
    loadingText = 'Loading...',
    errorText = 'Failed to load items.',
    showAddButton = false,
    onAddNew,
    addButtonText = 'Add new item',
    items,
    isLoading = false,
    error = false,
    onSearch,
    renderItem,
    onCreateNew,
    onRefreshItems,
    isCreating = false,
    addPlaceholder = 'Enter item name',
    maxDisplay,
    maxDisplayAuto = false
  } = props
  const selectedValue = value ?? []
  const [open, setOpen] = React.useState(false)
  const [showAddInput, setShowAddInput] = React.useState(false)
  const [newItemName, setNewItemName] = React.useState('')

  const [searchValue, setSearchValue] = React.useState('')
  const debouncedOnSearch = React.useMemo(
    () => debounce(onSearch || (() => {}), 400),
    [onSearch]
  )

  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(0)

  React.useEffect(() => {
    if (!maxDisplayAuto || !triggerRef.current) return

    const element = triggerRef.current
    setContainerWidth(element.getBoundingClientRect().width)

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [maxDisplayAuto])

  React.useEffect(() => {
    return () => debouncedOnSearch.cancel()
  }, [debouncedOnSearch])

  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        setSearchValue('')
        debouncedOnSearch.cancel()
        onSearch?.('')
      }
    },
    [debouncedOnSearch, onSearch]
  )

  const handleSearchChange = React.useCallback(
    (val: string) => {
      setSearchValue(val)
      debouncedOnSearch(val)
    },
    [debouncedOnSearch]
  )

  const filteredItems = React.useMemo(() => {
    if (!searchValue.trim()) return items
    const q = searchValue.toLowerCase()
    return items.filter((it) => (it.name || '').toLowerCase().includes(q))
  }, [items, searchValue])

  const handleCreateNew = async () => {
    if (!newItemName.trim() || !onCreateNew) return

    try {
      await onCreateNew(newItemName.trim())
      setNewItemName('')
      setShowAddInput(false)
      onRefreshItems?.()
    } catch (error) {
      console.error('Failed to create new item:', error)
    }
  }

  const handleCancelAdd = () => {
    setNewItemName('')
    setShowAddInput(false)
  }

  const handleAddButtonClick = () => {
    if (onCreateNew) {
      setShowAddInput(true)
    } else {
      setOpen(false)
      onAddNew?.()
    }
  }

  const toggle = (id: string) => {
    const set = new Set(selectedValue)
    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }
    onChange([...set])
  }

  const removeItem = (id: string) => {
    const newValue = selectedValue.filter((v: string) => v !== id)
    onChange(newValue)
  }

  const selectedItems = React.useMemo(() => {
    const map = new Map(items.map((item) => [item.id, item]))
    return selectedValue.map((v: string) => map.get(v)).filter(Boolean) as T[]
  }, [selectedValue, items])

  const computedMaxDisplay = React.useMemo(() => {
    if (maxDisplay !== undefined) return maxDisplay
    if (!maxDisplayAuto || containerWidth === 0 || selectedItems.length === 0) {
      return undefined
    }

    const BADGE_PADDING = 40
    const BADGE_GAP = 4
    const CHAR_WIDTH = 7
    const CHEVRON_SPACE = 32
    const OVERFLOW_BADGE_WIDTH = 60

    const availableWidth = containerWidth - CHEVRON_SPACE - OVERFLOW_BADGE_WIDTH

    let usedWidth = 0
    let count = 0

    for (const item of selectedItems) {
      const badgeWidth = (item.name?.length || 0) * CHAR_WIDTH + BADGE_PADDING
      if (
        usedWidth + badgeWidth + (count > 0 ? BADGE_GAP : 0) >
        availableWidth
      ) {
        break
      }
      usedWidth += badgeWidth + (count > 0 ? BADGE_GAP : 0)
      count++
    }

    return Math.max(1, count)
  }, [maxDisplay, maxDisplayAuto, containerWidth, selectedItems])

  const defaultRenderItem = (item: T, checked: boolean) => (
    <>
      <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full border">
        {checked ? (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
            <Check className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="flex h-4 w-4 items-center justify-center rounded-full">
            <Plus className="h-4 w-4 rounded-full bg-[#959393] text-white" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate">{item.name}</span>
        </div>
      </div>
    </>
  )

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="group w-full justify-between"
            disabled={disabled}
          >
            <span className="text-muted-foreground group-hover:text-black font-normal truncate">
              {selectedItems.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {(computedMaxDisplay
                    ? selectedItems.slice(0, computedMaxDisplay)
                    : selectedItems
                  ).map((item) => (
                    <Badge
                      key={item.id}
                      variant="default"
                      className="flex items-center gap-1 px-2 py-1 text-xs text-primary-foreground rounded-sm"
                    >
                      {item.name}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeItem(item.id)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            e.stopPropagation()
                            removeItem(item.id)
                          }
                        }}
                        className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5 cursor-pointer"
                      >
                        <XCircleIcon className="h-3 w-3" />
                      </span>
                    </Badge>
                  ))}
                  {computedMaxDisplay &&
                    selectedItems.length > computedMaxDisplay && (
                      <Badge
                        variant="default"
                        className="flex items-center gap-1 px-2 py-1 text-xs text-primary-foreground rounded-sm"
                      >
                        +{selectedItems.length - computedMaxDisplay} more
                      </Badge>
                    )}
                </div>
              ) : (
                placeholder
              )}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-30 group-hover:opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0"
          align="start"
          side="top"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={handleSearchChange}
            />

            <CommandList className="max-h-50 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center gap-2 p-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> {loadingText}
                </div>
              )}
              {error && <CommandEmpty>{errorText}</CommandEmpty>}
              {!isLoading && filteredItems.length === 0 && (
                <CommandEmpty>{emptyText}</CommandEmpty>
              )}

                <CommandGroup>
                {filteredItems.map((item) => {
                  const checked = selectedValue.includes(item.id)
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => toggle(item.id)}
                      className="cursor-pointer"
                    >
                      {renderItem
                        ? renderItem(item, checked)
                        : defaultRenderItem(item, checked)}
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              {showAddButton && (
                <CommandGroup>
                  {showAddInput ? (
                    <div className="space-y-2 p-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder={addPlaceholder}
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleCreateNew()
                            }
                            if (e.key === 'Escape') {
                              handleCancelAdd()
                            }
                          }}
                          autoFocus
                          disabled={isCreating}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={handleCreateNew}
                          disabled={!newItemName.trim() || isCreating}
                        >
                          {isCreating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Add'
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <CommandItem
                      className="text-primary cursor-pointer"
                      onSelect={handleAddButtonClick}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {addButtonText}
                    </CommandItem>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
