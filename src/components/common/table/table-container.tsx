'use client'

import { XCircleIcon } from '@/components/icons/x-circle-icon'
import { Button } from '@/components/ui/button'
import { cn, formatDateTime } from '@/lib/utils'
import * as React from 'react'
import { MainTable, TableAction, TableColumn } from './main-table'
import { PaginationInfo, TablePagination } from './table-pagination'
import { TableShowCount } from './table-show-count'

interface PaginationControlsProps {
  enablePagination: boolean
  enableShowCount: boolean
  totalItems: number
  itemsPerPage: number
  handleItemsPerPageChange: (count: number) => void
  showCountOptions: number[]
  showPaginationInfo: boolean
  currentPage: number
  totalPages: number
  handlePageChange: (page: number) => void
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  enablePagination,
  enableShowCount,
  totalItems,
  itemsPerPage,
  handleItemsPerPageChange,
  showCountOptions,
  showPaginationInfo,
  currentPage,
  totalPages,
  handlePageChange
}) => {
  if (!enablePagination && !enableShowCount) return null

  return (
    <div className="flex flex-col items-start justify-between gap-4 border-t bg-gray-50/30 p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        {enableShowCount && totalItems > 0 && (
          <TableShowCount
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            options={showCountOptions}
          />
        )}

        {showPaginationInfo && totalItems > 0 && (
          <PaginationInfo
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        )}
      </div>

      {enablePagination && totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export interface TableContainerProps<T extends object = object> {
  data: T[]
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  showNumbering?: boolean
  className?: string
  rowClassName?: string | ((row: T) => string)
  headerClassName?: string
  enablePagination?: boolean
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  currentPage?: number
  enableShowCount?: boolean
  showCountOptions?: number[]
  onItemsPerPageChange?: (count: number) => void
  loading?: boolean
  emptyMessage?: string
  showPaginationInfo?: boolean
  paginationPosition?: 'top' | 'bottom' | 'both'
  totalItems?: number
  totalPages?: number
  serverSidePagination?: boolean
  showCreatedAt?: boolean
  bodyBorderBottom?: boolean
  bodyBorderLeft?: boolean
  showEmptyImage?: boolean
  emptyImageSrc?: string
  emptyImageAlt?: string
  showEmptyDescription?: boolean
  showEmptyMessage?: boolean
  emptyDescription?: string
  emptyContainerHeight?: string
  emptyContainerMinHeight?: string
  enableMultiSelect?: boolean
  selectedRows?: T[]
  onSelectionChange?: (selectedRows: T[]) => void
  getRowId?: (row: T) => string | number
  multiSelectText?: string
  renderMultiSelectActions?: (selectedRows: T[]) => React.ReactNode
  actionColumnLabel?: string
  showMultiSelectFloatingCard?: boolean
  loadingRowsCount?: number
}

export function TableContainer<T extends object = object>({
  data,
  columns,
  actions = [],
  showNumbering = true,
  className,
  rowClassName,
  headerClassName,
  enablePagination = true,
  itemsPerPage = 10,
  onPageChange,
  currentPage = 1,
  enableShowCount = true,
  showCountOptions = [10, 25, 50, 100],
  onItemsPerPageChange,
  loading = false,
  emptyMessage = 'No data available',
  showPaginationInfo = true,
  paginationPosition = 'bottom',
  totalItems: serverTotalItems,
  totalPages: serverTotalPages,
  serverSidePagination = true,
  showCreatedAt = true,
  bodyBorderBottom = false,
  bodyBorderLeft = false,
  showEmptyImage = true,
  emptyImageSrc = '/no-data.png',
  emptyImageAlt = 'No data',
  showEmptyDescription = true,
  showEmptyMessage = true,
  emptyDescription = 'We could not find any results based on your search.',
  emptyContainerHeight = 'auto',
  emptyContainerMinHeight = '400px',
  enableMultiSelect = false,
  selectedRows = [],
  onSelectionChange,
  getRowId,
  multiSelectText = 'Item',
  renderMultiSelectActions,
  actionColumnLabel = 'Action',
  showMultiSelectFloatingCard = true,
  loadingRowsCount = 5
}: TableContainerProps<T>) {
  const columnResolver: TableColumn<T>[] = React.useMemo(() => {
    const baseColumns = [...columns]

    if (showCreatedAt) {
      const hasCreatedAtColumn = baseColumns.some(
        (col) => col.key === 'created_at'
      )

      if (!hasCreatedAtColumn) {
        baseColumns.push({
          key: 'created_at',
          label: 'Created At',
          render: (row) => {
            const createdAt = (row as Record<string, unknown>).created_at
            if (!createdAt) {
              return null
            }
            return (
              <span className="text-sm text-gray-600">
                {formatDateTime(createdAt as string | Date)}
              </span>
            )
          }
        })
      }
    }

    return baseColumns
  }, [columns, showCreatedAt])

  const totalItems = serverSidePagination
    ? (serverTotalItems ?? 0)
    : data.length
  const totalPages = serverSidePagination
    ? (serverTotalPages ?? 0)
    : Math.ceil(data.length / itemsPerPage)

  const getCurrentPageData = (): T[] => {
    if (!enablePagination || serverSidePagination) return data

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const getNumberingOffset = (): number => {
    if (!enablePagination) return 0
    if (serverSidePagination) {
      return (currentPage - 1) * itemsPerPage
    }
    return (currentPage - 1) * itemsPerPage
  }

  const currentPageData = getCurrentPageData()
  const numberingOffset = getNumberingOffset()

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    }
  }

  const handleItemsPerPageChange = (count: number) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(count)
    }
    if (onPageChange) {
      onPageChange(1)
    }
  }

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-lg border bg-white',
        className
      )}
    >
      {paginationPosition === 'top' || paginationPosition === 'both' ? (
        <PaginationControls
          enablePagination={enablePagination}
          enableShowCount={enableShowCount}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          showCountOptions={showCountOptions}
          showPaginationInfo={showPaginationInfo}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      ) : null}

      <MainTable<T>
        data={currentPageData}
        columns={columnResolver}
        actions={actions}
        showNumbering={showNumbering}
        rowClassName={rowClassName}
        headerClassName={headerClassName}
        loading={loading}
        emptyMessage={emptyMessage}
        numberingOffset={numberingOffset}
        className="border-0"
        bodyBorderBottom={bodyBorderBottom}
        bodyBorderLeft={bodyBorderLeft}
        showEmptyImage={showEmptyImage}
        emptyImageSrc={emptyImageSrc}
        emptyImageAlt={emptyImageAlt}
        showEmptyDescription={showEmptyDescription}
        showEmptyMessage={showEmptyMessage}
        emptyDescription={emptyDescription}
        emptyContainerHeight={emptyContainerHeight}
        emptyContainerMinHeight={emptyContainerMinHeight}
        enableMultiSelect={enableMultiSelect}
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
        getRowId={getRowId}
        actionColumnLabel={actionColumnLabel}
        loadingRowsCount={loadingRowsCount}
      />

      {/* Bottom pagination */}
      {paginationPosition === 'bottom' || paginationPosition === 'both' ? (
        <PaginationControls
          enablePagination={enablePagination}
          enableShowCount={enableShowCount}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          showCountOptions={showCountOptions}
          showPaginationInfo={showPaginationInfo}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      ) : null}

      {/* Floating Selection Card */}
      {enableMultiSelect && showMultiSelectFloatingCard && (
        <div className="fixed bottom-10 left-1/2 z-60 -translate-x-1/2 transform">
          <div
            className={cn(
              'flex items-center gap-4 rounded-lg bg-green-700 px-4 py-3 shadow-lg transition-all duration-300 ease-in-out',
              selectedRows.length > 0
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-full'
            )}
          >
            <div className="flex gap-1 items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSelectionChange?.([])}
                className="h-8 w-8 p-0 text-white hover:bg-green-600 hover:text-white"
              >
                <XCircleIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-white whitespace-nowrap">
                {selectedRows.length} {multiSelectText} Selected
              </span>
            </div>
            <div className="h-6 w-px bg-white/30" />
            <div className="flex items-center gap-2">
              {renderMultiSelectActions?.(selectedRows)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { MainTable, PaginationInfo, TablePagination, TableShowCount }
export type { TableAction, TableColumn }