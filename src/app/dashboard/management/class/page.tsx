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
import { useClass } from '@/hooks/api/master/class/use-class'
import useFetcher from '@/hooks/use-fetcher'
import {
  deleteClass,
  updateClassStatus
} from '@/service/master/class/class-service'
import { getAllStudyPrograms } from '@/service/master/study-program/study-program-service'
import { ListClassResponse } from '@/types/response/master/class/class-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddClassDialog from './add-class-dialog'
import EditClassDialog from './edit-class-dialog'

export default function ClassPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    study_program_id: [] as string[],
    status: [] as string[]
  })
  const [tempStudyProgramIds, setTempStudyProgramIds] = useState<string[]>([])
  const [tempStatuses, setTempStatuses] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClassId, setEditingClassId] = useState<string | null>(null)
  const confirm = useConfirm()

  const { data: studyProgramsResp, run: runStudyPrograms } = useFetcher(
    getAllStudyPrograms,
    {
      immediate: false
    }
  )

  useEffect(() => {
    runStudyPrograms()
  }, [runStudyPrograms])

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
      status: filters.status.join(',')
    }),
    [currentPage, itemsPerPage, search, filters]
  )

  const { data, isLoading, refetch } = useClass(param)

  const handleToggleStatus = async (row: ListClassResponse) => {
    const confirmed = await confirm({
      title: `${row.status ? 'Deactivate' : 'Activate'} Class`,
      description: `Are you sure you want to ${row.status ? 'deactivate' : 'activate'} this class?`,
      confirmText: `${row.status ? 'Yes, Deactivate' : 'Yes, Activate'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: row.status ? 'bg-red-600 hover:bg-red-700' : ''
    })

    if (!confirmed) return

    try {
      await updateClassStatus(row.id)
      void refetch()
      toast.success(
        `Class ${row.status ? 'deactivated' : 'activated'} successfully`
      )
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message || 'Failed to update class status'
      )
    }
  }

  const handleDelete = async (row: ListClassResponse) => {
    const confirmed = await confirm({
      title: 'Delete Class',
      description: 'Are you sure you want to delete this class?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      confirmButtonClassName: 'bg-red-600 hover:bg-red-700'
    })

    if (!confirmed) return

    try {
      await deleteClass(row.id)
      void refetch()
      toast.success('Class deleted successfully')
    } catch (error) {
      toast.error((error as AxiosError)?.message || 'Failed to delete class')
    }
  }

  function handleEdit(row: ListClassResponse) {
    setEditingClassId(row.id)
  }

  const columns: TableColumn<ListClassResponse>[] = [
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[180px]',
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

  const tableAction: TableAction<ListClassResponse>[] = [
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
      title="Class"
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
                status: tempStatuses
              })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempStudyProgramIds([])
              setTempStatuses([])
              setFilters({
                study_program_id: [],
                status: []
              })
              setCurrentPage(1)
            }}
            badgeCount={filters.study_program_id.length + filters.status.length}
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
        <TableContainer<ListClassResponse>
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
      <AddClassDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => void refetch()}
      />
      <EditClassDialog
        open={Boolean(editingClassId)}
        classId={editingClassId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingClassId(null)
          }
        }}
        onSuccess={() => void refetch()}
      />
    </ContentLayout>
  )
}
