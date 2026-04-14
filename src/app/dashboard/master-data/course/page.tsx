'use client'

import SearchInput from '@/components/common/input/search-input'
import {
  TableAction,
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
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
import {
  deleteCourse,
  getAllSemesters,
  updateCourseStatus
} from '@/service/master/course/course-service'
import { getAllStudyPrograms } from '@/service/master/study-program/study-program-service'
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
  const [filters, setFilters] = useState({
    study_program_id: [] as string[],
    semester: [] as string[],
    status: [] as string[]
  })
  const [tempStudyProgramIds, setTempStudyProgramIds] = useState<string[]>([])
  const [tempSemesters, setTempSemesters] = useState<string[]>([])
  const [tempStatuses, setTempStatuses] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const confirm = useConfirm()

  const { data: studyProgramsResp, run: runStudyPrograms } = useFetcher(
    getAllStudyPrograms,
    {
      immediate: false
    }
  )

  const { data: semestersResp, run: runSemesters } = useFetcher(
    getAllSemesters,
    {
      immediate: false
    }
  )

  useEffect(() => {
    runStudyPrograms()
    runSemesters()
  }, [runSemesters, runStudyPrograms])

  const filterGroups: FilterGroup[] = [
    {
      label: 'Study Program',
      options:
        studyProgramsResp?.map((studyProgram) => ({
          label: studyProgram.name,
          value: studyProgram.id
        })) || [],
      selected: tempStudyProgramIds,
      onChange: setTempStudyProgramIds
    },
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
      study_program_id: filters.study_program_id.join(','),
      semester: filters.semester.join(','),
      status: filters.status.join(',')
    }),
    [currentPage, itemsPerPage, search, filters]
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
      className: 'min-w-[220px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'study_program_name',
      label: 'Study Program',
      className: 'min-w-[220px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">
          {value.study_program_name || '-'}
        </p>
      )
    },
    {
      key: 'semester',
      label: 'Semester',
      className: 'min-w-[120px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">Semester {value.semester}</p>
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

  return (
    <ContentLayout
      title="Course"
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
                study_program_id: tempStudyProgramIds,
                semester: tempSemesters,
                status: tempStatuses
              })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempStudyProgramIds([])
              setTempSemesters([])
              setTempStatuses([])
              setFilters({
                study_program_id: [],
                semester: [],
                status: []
              })
              setCurrentPage(1)
            }}
            badgeCount={
              filters.study_program_id.length +
              filters.semester.length +
              filters.status.length
            }
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
          loading={isLoading}
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
