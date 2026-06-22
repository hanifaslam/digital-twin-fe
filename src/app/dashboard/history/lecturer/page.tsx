'use client'

import SearchInput from '@/components/common/input/search-input'
import {
  TableAction,
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { ErrorPage } from '@/components/common/tabs/error-page'
import { ScrollableTabs } from '@/components/common/tabs/scrollable-tabs'
import ContentLayout from '@/components/layout/content-layout'
import IconButton from '@/components/template/button/icon-button'
import { FilterDateRange } from '@/components/template/content/filter-date-range'
import { FilterSheet } from '@/components/template/modal/filter-sheet'
import { useLecturerHistory } from '@/hooks/api/history/lecturer/use-lecturer-history'
import useFetcher from '@/hooks/use-fetcher'
import { me } from '@/service/auth/auth-service'
import { LecturerHistoryService } from '@/service/history/lecturer/lecturer-history-service'
import { LecturerHistoryResponse } from '@/types/response/history/lecturer/lecturer-history-response'
import { format } from 'date-fns'
import { DownloadIcon, InfoIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { ActivityLogDialog } from './_components/activity-log-dialog'

export default function LecturerHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedStudyProgramId, setSelectedStudyProgramId] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    undefined
  )
  const [search, setSearch] = useState('')
  const [activityLogLecturerId, setActivityLogLecturerId] = useState<
    string | null
  >(null)
  const [activityLogDate, setActivityLogDate] = useState<string | undefined>(
    undefined
  )
  const [isExporting, setIsExporting] = useState(false)

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

  const start_date = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : undefined
  const end_date = dateRange?.to
    ? format(dateRange.to, 'yyyy-MM-dd')
    : undefined

  const param = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      study_program: activeStudyProgramId,
      start_date,
      end_date,
      q: search
    }),
    [
      currentPage,
      itemsPerPage,
      activeStudyProgramId,
      start_date,
      end_date,
      search
    ]
  )

  const { data, isLoading } = useLecturerHistory(param)

  const columns: TableColumn<LecturerHistoryResponse>[] = [
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'study_program',
      label: 'Study Program',
      className: 'min-w-[220px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">
          {Array.isArray(value.study_program)
            ? value.study_program.join(', ')
            : value.study_program || '-'}
        </p>
      )
    },
    {
      key: 'date',
      label: 'Date',
      className: 'min-w-[180px]',
      render: (value) => {
        const dateObj = new Date(value.date)
        return (
          <p className="text-sm font-medium">
            {format(dateObj, 'dd MMM yyyy, HH:mm:ss')}
          </p>
        )
      }
    }
  ]

  function handleViewActivityLog(row: LecturerHistoryResponse) {
    setActivityLogLecturerId(row.lecturer_id)
    setActivityLogDate(format(new Date(row.date), 'yyyy-MM-dd'))
  }

  const tableAction: TableAction<LecturerHistoryResponse>[] = [
    {
      label: 'Info',
      onClick: handleViewActivityLog,
      icon: <InfoIcon size={16} />,
      variant: 'ghost'
    }
  ]

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await LecturerHistoryService.export(param)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `lecturer-history-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

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
      title="Lecturer History"
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
          <IconButton
            icon={<DownloadIcon size={16} />}
            title="Export"
            onClick={handleExport}
            loading={isExporting}
            variant="outline"
          />
          <FilterSheet
            onConfirm={() => {
              setDateRange(tempDateRange)
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempDateRange(dateRange)
            }}
            badgeCount={dateRange?.from ? 1 : 0}
          >
            <FilterDateRange
              filterGroups={[
                {
                  label: 'Date Range',
                  startDate: tempDateRange?.from,
                  endDate: tempDateRange?.to,
                  onStartDateChange: (date) =>
                    setTempDateRange((prev) => ({ from: date, to: prev?.to })),
                  onEndDateChange: (date) =>
                    setTempDateRange((prev) => ({ from: prev?.from, to: date }))
                }
              ]}
            />
          </FilterSheet>
        </div>
      }
    >
      <div>
        <TableContainer<LecturerHistoryResponse>
          data={data?.data || []}
          columns={columns}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data?.metadata?.total_row || 0}
          totalPages={data?.metadata?.total_page || 0}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          loading={isLoading || isMeLoading}
          showEmptyImage={false}
          showCreatedAt={false}
          actions={tableAction}
        />
      </div>
      <ActivityLogDialog
        open={!!activityLogLecturerId}
        onOpenChange={(open) => {
          if (!open) {
            setActivityLogLecturerId(null)
            setActivityLogDate(undefined)
          }
        }}
        lecturerId={activityLogLecturerId}
        date={activityLogDate}
      />
    </ContentLayout>
  )
}
