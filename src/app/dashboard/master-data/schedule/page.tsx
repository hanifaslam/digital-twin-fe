'use client'

import SearchInput from '@/components/common/input/search-input'
import {
  TableAction,
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { ErrorPage } from '@/components/common/tabs/error-page'
import { ScrollableTabs } from '@/components/common/tabs/scrollable-tabs'
import { PencilIcon } from '@/components/icons/pencil-icon'
import { TrashIcon } from '@/components/icons/trash-icon'
import ContentLayout from '@/components/layout/content-layout'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import IconButton from '@/components/template/button/icon-button'
import { Switch } from '@/components/ui/switch'
import {
  FilterCheckbox,
  FilterGroup
} from '@/components/template/content/filter-check'
import { FilterSheet } from '@/components/template/modal/filter-sheet'
import { useSchedule } from '@/hooks/api/master/schedule/use-schedule'
import useFetcher from '@/hooks/use-fetcher'
import { me } from '@/service/auth/auth-service'
import { getAllRooms } from '@/service/master/room/room-service'
import {
  deleteSchedule,
  getAllDays,
  updateScheduleStatus
} from '@/service/master/schedule/schedule-service'
import { ListScheduleResponse } from '@/types/response/master/schedule/schedule-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddScheduleDialog from './add-schedule-dialog'
import EditScheduleDialog from './edit-schedule-dialog'

export default function SchedulePage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedStudyProgramId, setSelectedStudyProgramId] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null
  )
  const [filters, setFilters] = useState({
    day: [] as string[],
    room: [] as string[],
    status: [] as string[]
  })
  const [tempDay, setTempDay] = useState<string[]>([])
  const [tempRoom, setTempRoom] = useState<string[]>([])
  const [tempStatus, setTempStatus] = useState<string[]>([])
  const confirm = useConfirm()

  const {
    data: meResp,
    isLoading: isMeLoading,
    error: meError
  } = useFetcher(me, {
    immediate: true
  })

  const studyPrograms = useMemo(() => meResp?.study_programs || [], [meResp])
  const activeStudyProgramId = useMemo(() => {
    if (studyPrograms.length === 0) return ''

    const hasSelectedStudyProgram = studyPrograms.some(
      (studyProgram) => studyProgram.id === selectedStudyProgramId
    )

    return hasSelectedStudyProgram
      ? selectedStudyProgramId
      : (studyPrograms[0]?.id ?? '')
  }, [selectedStudyProgramId, studyPrograms])

  const { data: daysResp, run: runDays } = useFetcher(getAllDays, {
    immediate: false
  })
  const { data: roomsResp, run: runRooms } = useFetcher(getAllRooms, {
    immediate: false
  })

  useEffect(() => {
    runDays()
    runRooms()
  }, [runDays, runRooms])

  const filterGroups: FilterGroup[] = [
    {
      label: 'Day',
      options: daysResp?.map((day) => ({ label: day.label, value: day.value })) || [],
      selected: tempDay,
      onChange: setTempDay
    },
    {
      label: 'Room',
      options: roomsResp?.map((room) => ({ label: room.name, value: room.id })) || [],
      selected: tempRoom,
      onChange: setTempRoom
    },
    {
      label: 'Status',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
      ],
      selected: tempStatus,
      onChange: setTempStatus
    }
  ]

  const param = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      q: search,
      study_program_id: activeStudyProgramId,
      day: filters.day.join(','),
      room: filters.room.join(','),
      status: filters.status.join(',')
    }),
    [activeStudyProgramId, currentPage, itemsPerPage, search, filters]
  )

  const { data, isLoading, refetch } = useSchedule(param)

  const handleToggleStatus = async (row: ListScheduleResponse) => {
    const confirmed = await confirm({
      title: `${row.status ? 'Deactivate' : 'Activate'} Schedule`,
      description: `Are you sure you want to ${row.status ? 'deactivate' : 'activate'} this schedule?`,
      confirmText: `${row.status ? 'Yes, Deactivate' : 'Yes, Activate'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: row.status ? 'bg-red-600 hover:bg-red-700' : ''
    })

    if (!confirmed) return

    try {
      await updateScheduleStatus(row.id)
      void refetch()
      toast.success(
        `Schedule ${row.status ? 'deactivated' : 'activated'} successfully`
      )
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message || 'Failed to update schedule status'
      )
    }
  }

  const handleDelete = async (row: ListScheduleResponse) => {
    const confirmed = await confirm({
      title: 'Delete Schedule',
      description: 'Are you sure you want to delete this schedule?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      confirmButtonClassName: 'bg-red-600 hover:bg-red-700'
    })

    if (!confirmed) return

    try {
      await deleteSchedule(row.id)
      void refetch()
      toast.success('Schedule deleted successfully')
    } catch (error) {
      toast.error((error as AxiosError)?.message || 'Failed to delete schedule')
    }
  }

  function handleEdit(row: ListScheduleResponse) {
    setEditingScheduleId(row.id)
  }

  const columns: TableColumn<ListScheduleResponse>[] = [
    {
      key: 'class_name',
      label: 'Class',
      className: 'min-w-[160px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.class_name}</p>
      )
    },
    {
      key: 'course_name',
      label: 'Course',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.course_name}</p>
      )
    },
    {
      key: 'day',
      label: 'Day',
      className: 'min-w-[120px]',
      render: (value) => (
        <p className="truncate text-sm capitalize font-medium">
          {value.day.toLowerCase()}
        </p>
      )
    },
    {
      key: 'lecturer_name',
      label: 'Lecturer',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.lecturer_name}</p>
      )
    },
    {
      key: 'room_name',
      label: 'Room',
      className: 'min-w-[160px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.room_name}</p>
      )
    },
    {
      key: 'building_name',
      label: 'Building',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.building_name}</p>
      )
    },
    {
      key: 'time_label',
      label: 'Time',
      className: 'min-w-[150px]',
      render: (value) => {
        const timeLabels = value.time_label
          ? value.time_label
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : ['-']

        return (
          <ul className="space-y-1 text-sm font-medium">
            {timeLabels.map((timeLabel, index) => (
              <li key={`${value.id}-time-${index}`} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
                <span className="break-words">{timeLabel}</span>
              </li>
            ))}
          </ul>
        )
      }
    },
    {
      key: 'status',
      label: 'Status',
      className: 'min-w-[150px]',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={value.status}
            onCheckedChange={() => handleToggleStatus(value)}
          />
          <span className="text-sm font-medium">
            {value.status ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    }
  ]

  const tableAction: TableAction<ListScheduleResponse>[] = [
    {
      label: 'Edit',
      onClick: handleEdit,
      icon: <PencilIcon />,
      variant: 'ghost'
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      icon: <TrashIcon className="size-4" />,
      variant: 'ghost',
      className: 'text-red-600 hover:text-red-700'
    }
  ]

  if (meError) {
    return (
      <ErrorPage message="Failed to load study programs from current user." />
    )
  }

  if (!isMeLoading && studyPrograms.length === 0) {
    return (
      <ErrorPage message="No study program access found for this account." />
    )
  }

  return (
    <ContentLayout
      title="Schedule"
      afterTitle={
        studyPrograms.length > 0 ? (
          <div className="mt-4">
            <ScrollableTabs
              value={activeStudyProgramId}
              onValueChange={(studyProgramId) => {
                setSelectedStudyProgramId(studyProgramId)
                setCurrentPage(1)
              }}
              items={studyPrograms.map((studyProgram) => ({
                id: studyProgram.id,
                label: studyProgram.name
              }))}
            />
          </div>
        ) : null
      }
      leading={
        <SearchInput
          placeholder="Search"
          className="max-w-lg"
          value={search}
          onSearch={(value) => {
            setSearch(value)
            setCurrentPage(1)
          }}
        />
      }
      trailing={
        <div className="flex space-x-4">
          <FilterSheet
            onConfirm={() => {
              setFilters({
                day: tempDay,
                room: tempRoom,
                status: tempStatus
              })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempDay([])
              setTempRoom([])
              setTempStatus([])
              setFilters({
                day: [],
                room: [],
                status: []
              })
              setCurrentPage(1)
            }}
            badgeCount={
              filters.day.length + filters.room.length + filters.status.length
            }
          >
            <FilterCheckbox filterGroups={filterGroups} />
          </FilterSheet>
          <IconButton
            icon={<PlusIcon />}
            title="Add"
            onClick={() => setIsAddDialogOpen(true)}
            disabled={!activeStudyProgramId}
          />
        </div>
      }
    >
      <div>
        <TableContainer<ListScheduleResponse>
          data={data?.data || []}
          columns={columns}
          actions={tableAction}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data?.metadata?.total_row || 0}
          totalPages={data?.metadata?.total_page || 0}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          loading={isLoading || isMeLoading}
          showEmptyImage={false}
          showCreatedAt={false}
        />
      </div>
      <AddScheduleDialog
        open={isAddDialogOpen}
        studyPrograms={studyPrograms}
        initialStudyProgramId={activeStudyProgramId}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => void refetch()}
      />
      <EditScheduleDialog
        open={Boolean(editingScheduleId)}
        scheduleId={editingScheduleId}
        studyPrograms={studyPrograms}
        initialStudyProgramId={activeStudyProgramId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingScheduleId(null)
          }
        }}
        onSuccess={() => void refetch()}
      />
    </ContentLayout>
  )
}
