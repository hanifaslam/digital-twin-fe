'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  maxVisiblePages?: number
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisiblePages = 5
}: TablePaginationProps) {
  const getPaginationItems = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const items: (number | 'ellipsis')[] = []
    const showEllipsis = totalPages > maxVisiblePages

    if (currentPage <= 3) {
      for (let i = 1; i <= Math.min(maxVisiblePages - 1, totalPages); i++) {
        items.push(i)
      }
      if (showEllipsis && totalPages > maxVisiblePages) {
        items.push('ellipsis')
        items.push(totalPages)
      }
    } else if (currentPage >= totalPages - 2) {
      // Show last few pages
      items.push(1)
      if (showEllipsis) {
        items.push('ellipsis')
      }
      for (
        let i = Math.max(totalPages - maxVisiblePages + 2, 2);
        i <= totalPages;
        i++
      ) {
        items.push(i)
      }
    } else {
      items.push(1)
      items.push('ellipsis')

      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        items.push(i)
      }

      items.push('ellipsis')
      items.push(totalPages)
    }

    return items
  }

  const paginationItems = getPaginationItems()
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {/* Previous Page Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className="h-8 w-8 p-0"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Number Buttons */}
      {paginationItems.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <Button
              key={`ellipsis-${index}`}
              type="button"
              variant="outline"
              size="sm"
              disabled
              className="h-8 min-w-8 cursor-default px-2"
              aria-label="More pages"
            >
              ...
            </Button>
          )
        }

        return (
          <Button
            key={item}
            type="button"
            variant={item === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(item)}
            className={cn(
              'h-8 min-w-8 px-2',
              item === currentPage && 'bg-primary text-primary-foreground'
            )}
            aria-label={`Go to page ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </Button>
        )
      })}

      {/* Next Page Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="h-8 w-8 p-0"
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export interface PaginationInfoProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  className?: string
}

export function PaginationInfo({ totalItems, className }: PaginationInfoProps) {
  return (
    <div className={cn('text-sm text-gray-600', className)}>
      from {totalItems}
    </div>
  )
}
