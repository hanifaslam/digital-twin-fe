import { AttendanceBadge } from '@/components/common/badge/attendance-badge'
import {
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { formatToday } from '@/lib/utils'
import { StatusFaceResponse } from '@/types/response/face-recog/face-recog-response'

import React, { useMemo } from 'react'

function permissionLabel(
  isOnTime: boolean | undefined,
  lateMinutes: number | null | undefined
) {
  if (isOnTime === undefined || (isOnTime === false && lateMinutes === null)) {
    return '-'
  }
  if (isOnTime) return 'On Time'
  return `Late ${lateMinutes ?? 0} min`
}

export const AttendanceTable = React.memo(
  ({
    status,
    isLoading
  }: {
    status: StatusFaceResponse | undefined
    isLoading: boolean
  }) => {
    const tableRows = useMemo(
      () => [status || ({} as StatusFaceResponse)],
      [status]
    )

    const columns = useMemo<TableColumn<StatusFaceResponse>[]>(
      () => [
        {
          key: 'registered',
          label: 'Today',
          className: 'min-w-[100px]',
          render: () => (
            <span className="text-sm font-medium capitalize">
              {formatToday()}
            </span>
          )
        },
        {
          key: 'attended_at',
          label: 'Clock In',
          className: 'min-w-[100px]',
          render: (row) => (
            <span className="text-sm font-medium">
              {row.attended_at ?? '-'}
            </span>
          )
        },
        {
          key: 'overridden_at',
          label: 'Not Available',
          className: 'min-w-[100px]',
          render: (row) => (
            <span className="text-sm font-medium">
              {row.overridden_at ?? '-'}
            </span>
          )
        },
        {
          key: 'is_on_time',
          label: 'Permission',
          render: (row) => (
            <AttendanceBadge status={row.is_on_time}>
              {permissionLabel(row.is_on_time, row.late_minutes)}
            </AttendanceBadge>
          )
        }
      ],
      []
    )

    if (isLoading) {
      return (
        <div className="w-full space-y-4">
          {/* Desktop Skeleton */}
          <div className="hidden md:block">
            <div className="h-[120px] w-full animate-pulse rounded-lg bg-gray-100" />
          </div>
          {/* Mobile Skeleton */}
          <div className="block md:hidden">
            <div className="h-[170px] w-full animate-pulse rounded-lg bg-gray-100" />
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="hidden md:block">
          <TableContainer<StatusFaceResponse>
            data={tableRows}
            columns={columns}
            showNumbering={false}
            showCreatedAt={false}
            enablePagination={false}
            enableShowCount={false}
            loading={isLoading}
            loadingRowsCount={1}
            emptyContainerMinHeight="80px"
            showEmptyImage={false}
            emptyDescription="No attendance recorded today"
          />
        </div>

        <div className="md:hidden">
          <div className="flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 border-b pb-3">
              <span className="text-sm font-semibold text-muted-foreground">
                Today
              </span>
              <span className="text-sm font-bold text-primary">
                {formatToday()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Clock In
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {status?.attended_at ?? '-'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Not Available
                </span>
                <span className="text-sm font-semibold">
                  {status?.overridden_at ?? '-'}
                </span>
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Permission Status
                </span>
                <div className="w-fit">
                  <AttendanceBadge status={status?.is_on_time}>
                    {permissionLabel(status?.is_on_time, status?.late_minutes)}
                  </AttendanceBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
)

AttendanceTable.displayName = 'AttendanceTable'
