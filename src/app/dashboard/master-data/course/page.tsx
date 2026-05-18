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
import {
  FilterCheckbox,
  FilterGroup
} from '@/components/template/content/filter-check'
import { FilterSheet } from '@/components/template/modal/filter-sheet'
import { Switch } from '@/components/ui/switch'
import { useCourse } from '@/hooks/api/master/course/use-course'
import useFetcher from '@/hooks/use-fetcher'
import { me } from '@/service/auth/auth-service'
import {
  deleteCourse,
  getAllSemesters,
  updateCourseStatus
} from '@/service/master/course/course-service'
import { ListCourseResponse } from '@/types/response/master/course/course-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddCourseDialog from './add-course-dialog'
import EditCourseDialog from './edit-course-dialog'

export default function CoursePage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedStudyProgramId, setSelectedStudyProgramId] = useState('')
  const [filters, setFilters] = useState({
    semester: [] as string[],
    status: [] as string[]
  })
  const [tempSemesters, setTempSemesters] = useState<string[]>([])
  const [tempStatuses, setTempStatuses] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
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

  const { data: semestersResp, run: runSemesters } = useFetcher(
    getAllSemesters,
    {
      immediate: false
    }
  )

  useEffect(() => {
    runSemesters()
  }, [runSemesters])

  const filterGroups: FilterGroup[] = [
    {
      label: 'Semester',
      options:
        semestersResp?.map((semester) => ({
          label: semester.label,
          value: String(semester.value)
        })) || [],
      selected: tempSemesters,
      onChange: setTempSemesters
    },
    {
      label: 'Status',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
      ],
      selected: tempStatuses,
      onChange: setTempStatuses
    }
  ]

  const param = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      q: search,
      study_program_id: activeStudyProgramId,
      semester: filters.semester.join(','),
      status: filters.status.join(',')
    }),
    [activeStudyProgramId, currentPage, itemsPerPage, search, filters]
  )

  const { data, isLoading, refetch } = useCourse(param)

  const handleToggleStatus = async (row: ListCourseResponse) => {
    const confirmed = await confirm({
      title: `${row.status ? 'Deactivate' : 'Activate'} Course`,
      description: `Are you sure you want to ${row.status ? 'deactivate' : 'activate'} this course?`,
      confirmText: `${row.status ? 'Yes, Deactivate' : 'Yes, Activate'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: row.status ? 'bg-red-600 hover:bg-red-700' : ''
    })

    if (!confirmed) return

    try {
      await updateCourseStatus(row.id)
      void refetch()
      toast.success(
        `Course ${row.status ? 'deactivated' : 'activated'} successfully`
      )
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message || 'Failed to update course status'
      )
    }
  }

  const handleDelete = async (row: ListCourseResponse) => {
    const confirmed = await confirm({
      title: 'Delete Course',
      description: 'Are you sure you want to delete this course?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      confirmButtonClassName: 'bg-red-600 hover:bg-red-700'
    })

    if (!confirmed) return

    try {
      await deleteCourse(row.id)
      void refetch()
      toast.success('Course deleted successfully')
    } catch (error) {
      toast.error((error as AxiosError)?.message || 'Failed to delete course')
    }
  }

  function handleEdit(row: ListCourseResponse) {
    setEditingCourseId(row.id)
  }

  const columns: TableColumn<ListCourseResponse>[] = [
    {
      key: 'code',
      label: 'Code',
      className: 'min-w-[120px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.code}</p>
      )
    },
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[120px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'semester',
      label: 'Semester',
      className: 'min-w-[120px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">
          Semester {value.semester}
        </p>
      )
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

  const tableAction: TableAction<ListCourseResponse>[] = [
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
      title="Course"
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
                semester: tempSemesters,
                status: tempStatuses
              })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempSemesters([])
              setTempStatuses([])
              setFilters({
                semester: [],
                status: []
              })
              setCurrentPage(1)
            }}
            badgeCount={filters.semester.length + filters.status.length}
          >
            <FilterCheckbox filterGroups={filterGroups} />
          </FilterSheet>
          <IconButton
            icon={<PlusIcon />}
            title="Add"
            onClick={() => setIsAddDialogOpen(true)}
          />
        </div>
      }
    >
      <div>
        <TableContainer<ListCourseResponse>
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
      <AddCourseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => void refetch()}
      />
      <EditCourseDialog
        open={Boolean(editingCourseId)}
        courseId={editingCourseId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCourseId(null)
          }
        }}
        onSuccess={() => void refetch()}
      />
    </ContentLayout>
  )
}
