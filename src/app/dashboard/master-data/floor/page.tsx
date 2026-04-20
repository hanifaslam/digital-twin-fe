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
import IconButton from '@/components/template/button/icon-button'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import {
  FilterCheckbox,
  FilterGroup
} from '@/components/template/content/filter-check'
import { FilterSheet } from '@/components/template/modal/filter-sheet'
import { Switch } from '@/components/ui/switch'
import useFetcher from '@/hooks/use-fetcher'
import {
  deleteFloor,
  getAllFloors,
  toggleFloorStatus
} from '@/service/master/floor/floor-service'
import { ListFloorResponse } from '@/types/response/master/floor/floor-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import AddFloorDialog from './add-floor-dialog'
import EditFloorDialog from './edit-floor-dialog'
import { useFloor } from '@/hooks/api/master/floor/use-floor'

export default function FloorPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [filters, setFilters] = useState({
    status: [] as string[]
  })

  const [tempStatus, setTempStatus] = useState<string[]>([])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const confirm = useConfirm()

  const { run: runFloors } = useFetcher(getAllFloors, {
    immediate: false
  })

  useEffect(() => {
    runFloors()
  }, [runFloors])

  const filterGroups: FilterGroup[] = [
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
      status: filters.status.join(',')
    }),
    [currentPage, itemsPerPage, search, filters]
  )

  const { data, isLoading, mutate } = useFloor(param)

  const handleToggleStatus = async (row: ListFloorResponse) => {
    const confirmed = await confirm({
      title: `${row.status ? 'Deactivate' : 'Activate'} Floor`,
      description: `Are you sure you want to ${
        row.status ? 'deactivate' : 'activate'
      } this floor?`,
      confirmText: `${row.status ? 'Yes, Deactivate' : 'Yes, Activate'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: row.status ? 'bg-red-600 hover:bg-red-700' : ''
    })

    if (!confirmed) return

    try {
      await toggleFloorStatus(row.id)
      await mutate()
      toast.success(
        `Floor ${
          row.status ? 'deactivated' : 'activated'
        } successfully`
      )
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message ||
          'Failed to update floor status'
      )
    }
  }

  const columns: TableColumn<ListFloorResponse>[] = [
    {
      key: 'name',
      label: 'Floor Name',
      className: 'min-w-[220px]',
        render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'status',
      label: 'Status',
      className: 'min-w-[120px]',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.status}
            onCheckedChange={() => handleToggleStatus(row)}
          />
          <span>{row.status ? 'Active' : 'Inactive'}</span>
        </div>
      )
    },
  ]

  function handleEdit(row: ListFloorResponse) {
    setEditingId(row.id)
  }
const handleDelete = async (row: ListFloorResponse) => {
    const confirmed = await confirm({
      title: 'Delete Floor',
      description: `Are you sure you want to delete this floor?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      confirmButtonClassName: 'bg-red-600 hover:bg-red-700'
    })

    if (!confirmed) return

    try {
      await deleteFloor(row.id)
      void mutate()
      toast.success('Floor deleted successfully')
    } catch (error) {
      toast.error((error as AxiosError)?.message || 'Failed to delete floor')
    }
  }
  const tableAction: TableAction<ListFloorResponse>[] = [
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
      title="Floor"
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
              setFilters({ status: tempStatus })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempStatus([])
              setFilters({ status: [] })
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
      <TableContainer<ListFloorResponse>
        data={data?.data || []}
        columns={columns}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data?.metadata?.total_row || 0}
        totalPages={data?.metadata?.total_page || 0}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        loading={isLoading}
        showEmptyImage={false}
        showCreatedAt={false}
        actions={tableAction}
      />

      <AddFloorDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => mutate()}
      />

      <EditFloorDialog
        open={Boolean(editingId)}
        floorId={editingId}
        onOpenChange={(open) => {
          if (!open) setEditingId(null)
        }}
        onSuccess={() => mutate()}
      />
    </ContentLayout>
  )
}