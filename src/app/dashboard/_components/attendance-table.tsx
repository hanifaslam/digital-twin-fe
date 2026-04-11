import { AttendanceBadge } from '@/components/common/badge/attendance-badge'
import {
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { formatToday } from '@/lib/utils'
import { StatusFaceResponse } from '@/types/response/face-recog/face-recog-response'

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

export function AttendanceTable({
  status,
  isLoading
}: {
  status: StatusFaceResponse | undefined
  isLoading: boolean
}) {
  const tableRows = [status || ({} as StatusFaceResponse)]

  const columns: TableColumn<StatusFaceResponse>[] = [
    {
      key: 'registered',
      label: 'Today',
      className: 'min-w-[100px]',
      render: () => (
        <span className="text-sm font-medium capitalize">{formatToday()}</span>
      )
    },
    {
      key: 'attended_at',
      label: 'Clock In',
      className: 'min-w-[100px]',
      render: (row) => (
        <span className="text-sm font-medium">{row.attended_at ?? '-'}</span>
      )
    },
    {
      key: 'overridden_at',
      label: 'Not Available',
      className: 'min-w-[100px]',
      render: (row) => (
        <span className="text-sm font-medium">{row.overridden_at ?? '-'}</span>
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
  ]

  return (
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
  )
}
