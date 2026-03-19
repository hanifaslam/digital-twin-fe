'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import * as React from 'react'

export interface TableColumn<T extends object = object> {
  key: string
  label: React.ReactNode
  className?: string
  render?: (value: T, row: T, index: number) => React.ReactNode
}

export interface TableAction<T extends object = object> {
  label?: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link'
  className?: string
  disabled?: (row: T) => boolean
  hidden?: (row: T) => boolean
}

export interface MainTableProps<T extends object = object> {
  data: T[]
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  showNumbering?: boolean
  className?: string
  rowClassName?: string | ((row: T) => string)
  headerClassName?: string
  emptyMessage?: string
  loading?: boolean
  numberingOffset?: number
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
  actionColumnLabel?: string
}

export function MainTable<T extends object = object>({
  data,
  columns,
  actions = [],
  showNumbering = true,
  className,
  rowClassName,
  headerClassName,
  emptyMessage = 'No data available',
  loading = false,
  numberingOffset = 0,
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
  getRowId = (row) => (row as { id?: string | number }).id || '',
  actionColumnLabel = 'Action'
}: MainTableProps<T>) {
  const isRowSelected = (row: T) => {
    const rowId = getRowId(row)
    return selectedRows.some((selectedRow) => getRowId(selectedRow) === rowId)
  }

  const isAllRowsSelected = () => {
    if (data.length === 0) return false
    return data.every((row) => isRowSelected(row))
  }

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return

    if (checked) {
      // Select all rows on current page
      const newSelectedRows = [...selectedRows]
      data.forEach((row) => {
        if (!isRowSelected(row)) {
          newSelectedRows.push(row)
        }
      })
      onSelectionChange(newSelectedRows)
    } else {
      // Deselect all rows on current page
      const currentPageIds = data.map((row) => getRowId(row))
      const newSelectedRows = selectedRows.filter(
        (row) => !currentPageIds.includes(getRowId(row))
      )
      onSelectionChange(newSelectedRows)
    }
  }

  const handleSelectRow = (row: T, checked: boolean) => {
    if (!onSelectionChange) return

    if (checked) {
      onSelectionChange([...selectedRows, row])
    } else {
      const rowId = getRowId(row)
      onSelectionChange(
        selectedRows.filter((selectedRow) => getRowId(selectedRow) !== rowId)
      )
    }
  }

  const renderCellContent = (
    column: TableColumn<T>,
    value: unknown,
    row: T,
    index: number
  ) => {
    if (column.render) {
      return column.render(row, row, index)
    }

    if (value === null || value === undefined) {
      return <span className="text-sm">-</span>
    }

    let displayValue = ''
    try {
      if (typeof value === 'string') {
        displayValue = value
      } else if (typeof value === 'number') {
        displayValue = value.toString()
      } else if (typeof value === 'boolean') {
        displayValue = value.toString()
      } else {
        displayValue = String(value)
      }
    } catch {
      displayValue = '-'
    }

    return <span className="text-sm">{displayValue}</span>
  }

  const renderActions = (row: T) => {
    if (!actions.length) return null

    return (
      <div className="flex items-center gap-1">
        {actions.map((action, index) => {
          if (action.hidden && action.hidden(row)) {
            return null
          }

          const isDisabled = action.disabled ? action.disabled(row) : false

          return (
            <Button
              key={index}
              type="button"
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => !isDisabled && action.onClick(row)}
              disabled={isDisabled}
              className={cn(
                'h-8 w-8 p-0',
                isDisabled && 'cursor-not-allowed opacity-50',
                action.className
              )}
              title={action.label}
            >
              {action.icon}
            </Button>
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full">
        <Table className={className}>
          <TableHeader>
            <TableRow
              className={cn(bodyBorderBottom && 'border-b', headerClassName)}
              style={{ backgroundColor: '#F9FAFB' }}
            >
              {enableMultiSelect && (
                <TableHead className="h-14 w-12 text-center">
                  <Checkbox disabled />
                </TableHead>
              )}
              {showNumbering && (
                <TableHead className="h-14 w-12 text-center">No</TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn('h-14', column.className)}
                >
                  {column.label}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="h-14 w-24 text-center">
                  {actionColumnLabel}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={index}
                className={cn(
                  bodyBorderBottom && 'border-b',
                  bodyBorderLeft && 'border-l'
                )}
              >
                {enableMultiSelect && (
                  <TableCell
                    className={cn(
                      bodyBorderLeft ? 'border-l' : '',
                      bodyBorderBottom && 'border-b',
                      'text-center'
                    )}
                  >
                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                  </TableCell>
                )}
                {showNumbering && (
                  <TableCell
                    className={cn(
                      bodyBorderLeft ? 'border-l' : '',
                      bodyBorderBottom && 'border-b',
                      'text-center'
                    )}
                  >
                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                  </TableCell>
                )}
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      column.className,
                      bodyBorderBottom && 'border-b',
                      bodyBorderLeft &&
                        !showNumbering &&
                        !enableMultiSelect &&
                        colIndex === 0 &&
                        'border-l'
                    )}
                  >
                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell className={cn(bodyBorderBottom && 'border-b')}>
                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="w-full">
        <Table className={className}>
          <TableHeader>
            <TableRow
              className={cn(bodyBorderBottom && 'border-b', headerClassName)}
              style={{ backgroundColor: '#F9FAFB' }}
            >
              {enableMultiSelect && (
                <TableHead className="h-14 w-12 text-center">
                  <Checkbox disabled />
                </TableHead>
              )}
              {showNumbering && (
                <TableHead className="h-14 w-12 text-center">No</TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn('h-14', column.className)}
                >
                  {column.label}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="h-14 w-24 text-center">
                  {actionColumnLabel}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={
                  columns.length +
                  (enableMultiSelect ? 1 : 0) +
                  (showNumbering ? 1 : 0) +
                  (actions.length > 0 ? 1 : 0)
                }
                className="py-8 text-center text-gray-500"
              >
                <div
                  className="flex flex-col items-center justify-center gap-4"
                  style={{
                    height: emptyContainerHeight,
                    minHeight: emptyContainerMinHeight
                  }}
                >
                  {showEmptyImage && (
                    <Image
                      src={emptyImageSrc}
                      alt={emptyImageAlt}
                      width={200}
                      height={200}
                    />
                  )}
                  {showEmptyMessage && (
                    <span className="text-xl font-semibold text-black">
                      {emptyMessage}
                    </span>
                  )}
                  {showEmptyDescription && (
                    <span className="text-muted-foreground text-sm whitespace-nowrap">
                      {emptyDescription}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table className={className}>
        <TableHeader>
          <TableRow
            className={cn(bodyBorderBottom && 'border-b', headerClassName)}
            style={{ backgroundColor: '#F9FAFB' }}
          >
            {enableMultiSelect && (
              <TableHead className="h-14 w-12 text-center">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={isAllRowsSelected()}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
              </TableHead>
            )}
            {showNumbering && (
              <TableHead className="h-14 w-12 text-center font-semibold">
                No
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn('h-14 font-semibold', column.className)}
              >
                {column.label}
              </TableHead>
            ))}
            {actions.length > 0 && (
              <TableHead className="h-14 w-24 text-center font-semibold">
                {actionColumnLabel}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn(
                'hover:bg-gray-50/50',
                typeof rowClassName === 'function'
                  ? rowClassName(row)
                  : rowClassName,
                bodyBorderBottom && 'border-b'
              )}
            >
              {enableMultiSelect && (
                <TableCell className={cn('text-center')}>
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={isRowSelected(row)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(row, checked as boolean)
                      }
                    />
                  </div>
                </TableCell>
              )}
              {showNumbering && (
                <TableCell className={cn('text-center font-medium')}>
                  {numberingOffset + rowIndex + 1}
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.key} className={cn(column.className)}>
                  {renderCellContent(
                    column,
                    (row as Record<string, unknown>)[column.key],
                    row,
                    rowIndex
                  )}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell className={cn('text-center')}>
                  {renderActions(row)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
