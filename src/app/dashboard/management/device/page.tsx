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
import { useDevice } from '@/hooks/api/master/device/use-device'
import useFetcher from '@/hooks/use-fetcher'
import { me } from '@/service/auth/auth-service'
import {
  deleteDevice,
  getTypes,
  toggleDeviceStatus
} from '@/service/master/device/device-service'
import { getAllRooms } from '@/service/master/room/room-service'
import {
  DeviceTypeResponse,
  ListDeviceResponse
} from '@/types/response/master/device/device-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddDeviceDialog from './add-device-dialog'
import EditDeviceDialog from './edit-device-dialog'

export default function DevicePage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedBuildingId, setSelectedBuildingId] = useState('')
  const [filters, setFilters] = useState({
    room_id: [] as string[],
    type: [] as string[]
  })
  const [tempRoomIds, setTempRoomIds] = useState<string[]>([])
  const [tempTypes, setTempTypes] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null)
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

  const { data: roomsResp, run: runRooms } = useFetcher(getAllRooms, {
    immediate: false
  })
  const { data: deviceTypesResp, run: runDeviceTypes } = useFetcher(getTypes, {
    immediate: false
  })

  useEffect(() => {
    runDeviceTypes()
  }, [runDeviceTypes])

  useEffect(() => {
    if (activeBuildingId) {
      runRooms({ building_id: activeBuildingId })
    }
  }, [activeBuildingId, runRooms])

  const filterGroups: FilterGroup[] = [
    {
      label: 'Room',
      options:
        roomsResp?.map((room) => ({
          label: room.name,
          value: room.id
        })) || [],
      selected: tempRoomIds,
      onChange: setTempRoomIds
    },
    {
      label: 'Types',
      options:
        deviceTypesResp?.map((type) => {
          if (typeof type === 'string') {
            return {
              label: type,
              value: type
            }
          }

          const typedType = type as DeviceTypeResponse
          return {
            label: typedType.label || typedType.value,
            value: typedType.value
          }
        }) || [],
      selected: tempTypes,
      onChange: setTempTypes
    }
  ]

  const param = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      q: search,
      building_id: activeBuildingId,
      room_id: filters.room_id.join(','),
      type: filters.type.join(',')
    }),
    [currentPage, itemsPerPage, search, activeBuildingId, filters]
  )

  const { data, isLoading, refetch } = useDevice(param)

  const handleToggleStatus = async (row: ListDeviceResponse) => {
    const confirmed = await confirm({
      title: `${row.status ? 'Deactivate' : 'Activate'} Device`,
      description: `Are you sure you want to ${row.status ? 'deactivate' : 'activate'} this device?`,
      confirmText: `${row.status ? 'Yes, Deactivate' : 'Yes, Activate'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: row.status ? 'bg-red-600 hover:bg-red-700' : ''
    })

    if (!confirmed) return

    try {
      await toggleDeviceStatus(row.id)
      void refetch()
      toast.success(
        `Device ${row.status ? 'deactivated' : 'activated'} successfully`
      )
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message || 'Failed to update device status'
      )
    }
  }

  const handleDelete = async (row: ListDeviceResponse) => {
    const confirmed = await confirm({
      title: 'Delete Device',
      description: 'Are you sure you want to delete this device?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      confirmButtonClassName: 'bg-red-600 hover:bg-red-700'
    })

    if (!confirmed) return

    try {
      await deleteDevice(row.id)
      void refetch()
      toast.success('Device deleted successfully')
    } catch (error) {
      toast.error((error as AxiosError)?.message || 'Failed to delete device')
    }
  }

  function handleEdit(row: ListDeviceResponse) {
    setEditingDeviceId(row.id)
  }

  const columns: TableColumn<ListDeviceResponse>[] = [
    {
      key: 'name',
      label: 'Device Name',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'room_name',
      label: 'Room',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.room_name || '-'}</p>
      )
    },
    {
      key: 'type',
      label: 'Type',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.type || '-'}</p>
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

  const tableAction: TableAction<ListDeviceResponse>[] = [
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
      title="Device"
      afterTitle={
        buildings.length > 0 ? (
          <div className="mt-4">
            <ScrollableTabs
              value={activeBuildingId}
              onValueChange={(buildingId) => {
                setSelectedBuildingId(buildingId)
                setCurrentPage(1)
                setFilters((prev) => ({ ...prev, room_id: [] }))
                setTempRoomIds([])
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
          <FilterSheet
            onConfirm={() => {
              setFilters({
                room_id: tempRoomIds,
                type: tempTypes
              })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempRoomIds([])
              setTempTypes([])
              setFilters({
                room_id: [],
                type: []
              })
              setCurrentPage(1)
            }}
            badgeCount={filters.room_id.length + filters.type.length}
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
        <TableContainer<ListDeviceResponse>
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
      <AddDeviceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => void refetch()}
      />
      <EditDeviceDialog
        open={Boolean(editingDeviceId)}
        deviceId={editingDeviceId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingDeviceId(null)
          }
        }}
        onSuccess={() => void refetch()}
      />
    </ContentLayout>
  )
}
