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
import { useRoom } from '@/hooks/api/master/room/use-room'
import useFetcher from '@/hooks/use-fetcher'
import { me } from '@/service/auth/auth-service'
import {
  deleteRoom,
  updateRoomStatus
} from '@/service/master/room/room-service'
import { ListRoomResponse } from '@/types/response/master/room/room-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddRoomDialog from './add-room-dialog'
import EditRoomDialog from './edit-room-dialog'

export default function RoomPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedBuildingId, setSelectedBuildingId] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const confirm = useConfirm()

  const {
    data: meResp,
    isLoading: isMeLoading,
    error: meError
  } = useFetcher(me, {
    immediate: true
  })

  const buildings = useMemo(() => meResp?.buildings || [], [meResp])
  const activeBuildingId = useMemo(() => {
    if (buildings.length === 0) return ''

    const hasSelectedBuilding = buildings.some(
      (building) => building.id === selectedBuildingId
    )

    return hasSelectedBuilding ? selectedBuildingId : (buildings[0]?.id ?? '')
  }, [selectedBuildingId, buildings])

  const param = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      q: search,
      building_id: activeBuildingId
    }),
    [currentPage, itemsPerPage, search, activeBuildingId]
  )

  const { data, isLoading, mutate } = useRoom(param)

  const handleToggleStatus = async (row: ListRoomResponse) => {
    const confirmed = await confirm({
      title: `${row.status ? 'Deactivate' : 'Activate'} Room`,
      description: `Are you sure you want to ${row.status ? 'deactivate' : 'activate'} this room?`,
      confirmText: `${row.status ? 'Yes, Deactivate' : 'Yes, Activate'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: row.status ? 'bg-red-600 hover:bg-red-700' : ''
    })

    if (!confirmed) return

    try {
      await updateRoomStatus(row.id)
      void mutate()
      toast.success(
        `Room ${row.status ? 'deactivated' : 'activated'} successfully`
      )
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message || 'Failed to update room status'
      )
    }
  }

  function handleEdit(row: ListRoomResponse) {
    setEditingRoomId(row.id)
  }

  const handleDelete = async (row: ListRoomResponse) => {
    const confirmed = await confirm({
      title: 'Delete Room',
      description: `Are you sure you want to delete this room?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      confirmButtonClassName: 'bg-red-600 hover:bg-red-700'
    })

    if (!confirmed) return

    try {
      await deleteRoom(row.id)
      void mutate()
      toast.success('Room deleted successfully')
    } catch (error) {
      toast.error((error as AxiosError)?.message || 'Failed to delete room')
    }
  }

  const columns: TableColumn<ListRoomResponse>[] = [
    {
      key: 'name',
      label: 'Room Name',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'floor',
      label: 'Floor',
      className: 'min-w-[140px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">
          {value.floor_name || '-'}
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

  const tableAction: TableAction<ListRoomResponse>[] = [
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
    return <ErrorPage message="Failed to load buildings from current user." />
  }

  if (!isMeLoading && buildings.length === 0) {
    return <ErrorPage message="No building access found for this account." />
  }

  return (
    <ContentLayout
      title="Room"
      afterTitle={
        buildings.length > 0 ? (
          <div className="mt-4">
            <ScrollableTabs
              value={activeBuildingId}
              onValueChange={(buildingId) => {
                setSelectedBuildingId(buildingId)
                setCurrentPage(1)
              }}
              items={buildings.map((building) => ({
                id: building.id,
                label: building.name
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
            icon={<PlusIcon />}
            title="Add"
            onClick={() => setIsAddDialogOpen(true)}
          />
        </div>
      }
    >
      <div>
        <TableContainer<ListRoomResponse>
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
      <AddRoomDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => mutate()}
      />
      <EditRoomDialog
        open={Boolean(editingRoomId)}
        roomId={editingRoomId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRoomId(null)
          }
        }}
        onSuccess={() => mutate()}
      />
    </ContentLayout>
  )
}
