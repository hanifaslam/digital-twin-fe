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
import { useTimeSlot } from '@/hooks/api/master/time-slot/use-time-slot'
import { deleteTimeSlot } from '@/service/master/time-slot/time-slot-service'
import { ListTimeSlotResponse } from '@/types/response/master/time-slot/time-slot-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddTimeSlotDialog from './add-time-slot-dialog'
import EditTimeSlotDialog from './edit-time-slot-dialog'

export default function TimeSlotPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTimeSlotId, setEditingTimeSlotId] = useState<string | null>(
    null
  )
  const confirm = useConfirm()

  const param = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      q: search
    }),
    [currentPage, itemsPerPage, search]
  )

  const { data, isLoading, refetch } = useTimeSlot(param)

  const handleDelete = async (row: ListTimeSlotResponse) => {
    const confirmed = await confirm({
      title: 'Delete Time Slot',
      description: 'Are you sure you want to delete this time slot?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      confirmButtonClassName: 'bg-red-600 hover:bg-red-700'
    })

    if (!confirmed) return

    try {
      await deleteTimeSlot(row.id)
      void refetch()
      toast.success('Time slot deleted successfully')
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message || 'Failed to delete time slot'
      )
    }
  }

  function handleEdit(row: ListTimeSlotResponse) {
    setEditingTimeSlotId(row.id)
  }

  const columns: TableColumn<ListTimeSlotResponse>[] = [
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'display_time',
      label: 'Display Time',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.display_time}</p>
      )
    }
  ]

  const tableAction: TableAction<ListTimeSlotResponse>[] = [
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
      title="Time Slot"
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
        <IconButton
          icon={<PlusIcon />}
          title="Add"
          onClick={() => setIsAddDialogOpen(true)}
        />
      }
    >
      <div>
        <TableContainer<ListTimeSlotResponse>
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
      <AddTimeSlotDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => void refetch()}
      />
      <EditTimeSlotDialog
        open={Boolean(editingTimeSlotId)}
        timeSlotId={editingTimeSlotId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTimeSlotId(null)
          }
        }}
        onSuccess={() => void refetch()}
      />
    </ContentLayout>
  )
}
