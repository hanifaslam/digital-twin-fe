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
import { useClass } from '@/hooks/api/master/class/use-class'
import useFetcher from '@/hooks/use-fetcher'
import { me } from '@/service/auth/auth-service'
import {
  deleteClass,
  updateClassStatus
} from '@/service/master/class/class-service'
import { ListClassResponse } from '@/types/response/master/class/class-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddClassDialog from './add-class-dialog'
import EditClassDialog from './edit-class-dialog'

export default function ClassPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedStudyProgramId, setSelectedStudyProgramId] = useState('')
  const [filters, setFilters] = useState({
    status: [] as string[]
  })
  const [tempStatuses, setTempStatuses] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClassId, setEditingClassId] = useState<string | null>(null)
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

  const filterGroups: FilterGroup[] = [
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
      status: filters.status.join(',')
    }),
    [activeStudyProgramId, currentPage, itemsPerPage, search, filters]
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
      title="Class"
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
                status: tempStatuses
              })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempStatuses([])
              setFilters({
                status: []
              })
              setCurrentPage(1)
            }}
            badgeCount={filters.status.length}
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
          loading={isLoading || isMeLoading}
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
