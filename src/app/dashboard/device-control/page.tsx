'use client'

import { StatusBadge } from '@/components/common/badge/status-badge'
import SearchInput from '@/components/common/input/search-input'
import {
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { ErrorPage } from '@/components/common/tabs/error-page'
import { ScrollableTabs } from '@/components/common/tabs/scrollable-tabs'
import ContentLayout from '@/components/layout/content-layout'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import {
  FilterCheckbox,
  FilterGroup
} from '@/components/template/content/filter-check'
import { FilterSheet } from '@/components/template/modal/filter-sheet'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useDevice } from '@/hooks/api/master/device/use-device'
import { useDeviceSocket } from '@/hooks/api/socket/use-device-socket'
import useFetcher from '@/hooks/use-fetcher'
import { handleApiError } from '@/lib/utils'
import { me } from '@/service/auth/auth-service'
import { controlDevice } from '@/service/master/device/device-service'
import { getAllRooms } from '@/service/master/room/room-service'
import { ListDeviceResponse } from '@/types/response/master/device/device-response'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function DeviceControlPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedBuildingId, setSelectedBuildingId] = useState('')
  const [filters, setFilters] = useState({
    room_id: [] as string[]
  })
  const [tempRoomIds, setTempRoomIds] = useState<string[]>([])
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
      (b) => b.id === selectedBuildingId
    )

    return hasSelectedBuilding ? selectedBuildingId : (buildings[0]?.id ?? '')
  }, [selectedBuildingId, buildings])

  const { data: roomsResp, run: runRooms } = useFetcher(getAllRooms, {
    immediate: false
  })

  useEffect(() => {
    if (activeBuildingId) {
      runRooms({ building_id: activeBuildingId })
    }
  }, [activeBuildingId, runRooms])

  useDeviceSocket()

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
    }
  ]

  const params = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      q: search,
      building_id: activeBuildingId || undefined,
      room_id: filters.room_id.join(',') || undefined,
      status: 'true'
    }),
    [currentPage, itemsPerPage, search, activeBuildingId, filters]
  )

  const { data, isLoading } = useDevice(params)

  const handleToggleControl = async (row: ListDeviceResponse) => {
    const isTurningOn = !row.is_on
    const confirmed = await confirm({
      title: `${isTurningOn ? 'Turn On' : 'Turn Off'} ${row.name}`,
      description: `Are you sure you want to ${isTurningOn ? 'turn on' : 'turn off'} this device?`,
      confirmText: `Yes, ${isTurningOn ? 'Turn On' : 'Turn Off'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: !isTurningOn
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-green-600 hover:bg-green-700'
    })

    if (!confirmed) return

    try {
      await controlDevice(row.id, String(isTurningOn))
      toast.success(
        `Device ${isTurningOn ? 'turned on' : 'turned off'} successfully`
      )
    } catch (error) {
      toast.error(handleApiError(error, 'Failed to control device'))
    }
  }

  if (meError) {
    return <ErrorPage message="Failed to load buildings from current user." />
  }

  if (!isMeLoading && buildings.length === 0) {
    return <ErrorPage message="No building access found for this account." />
  }

  const columns: TableColumn<ListDeviceResponse>[] = [
    {
      key: 'name',
      label: 'Device name',
      className: 'min-w-[200px]',
      render: (value) => (
        <span className="text-sm font-medium">{value.name}</span>
      )
    },
    {
      key: 'room_name',
      label: 'Room',
      className: 'min-w-[150px]',
      render: (value) => (
        <span className="text-sm font-medium">{value.room_name}</span>
      )
    },
    {
      key: 'is_on',
      label: 'Status',
      className: 'min-w-[120px]',
      render: (value) => (
        <StatusBadge
          status={value.is_on ?? false}
          trueText="On"
          falseText="Off"
        />
      )
    },
    {
      key: 'power',
      label: 'Power',
      className: 'min-w-[120px]',
      render: (value) => (
        <span className="text-sm font-medium">{value.power ?? '0'} W</span>
      )
    },
    {
      key: 'action',
      label: 'Action',
      className: 'min-w-[150px]',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={value.is_on ?? false}
            onCheckedChange={() => handleToggleControl(value)}
            disabled={!(value.is_online ?? false)}
          />
          <span className="text-sm font-medium">
            {(value.is_on ?? false) ? 'On' : 'Off'}
          </span>
        </div>
      )
    }
  ]

  const renderMobileItem = (row: ListDeviceResponse) => (
    <Card className="gap-0 border-none shadow-md ring-1 ring-gray-200 py-0">
      <CardHeader className="px-4 py-4 border-b">
        <CardTitle className="text-base font-semibold">{row.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 font-medium">
          <span className="text-xs font-medium text-muted-foreground">
            Room:
          </span>
          <span className="text-xs font-semibold text-primary">
            {row.room_name}
          </span>
        </CardDescription>
        <CardAction>
          <StatusBadge
            status={row.is_on ?? false}
            trueText="On"
            falseText="Off"
          />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex items-center justify-between px-4 py-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground">
            Power Usage
          </span>
          <span className="text-lg font-semibold">
            {row.power ?? '0'}{' '}
            <small className="text-xs font-normal text-muted-foreground">W</small>
          </span>
        </div>
        <div className="flex items-center gap-3 bg-muted px-3 py-2 rounded-full">
          <span className="text-xs font-semibold text-gray-600">
            {(row.is_on ?? false) ? 'On' : 'Off'}
          </span>
          <Switch
            checked={row.is_on ?? false}
            onCheckedChange={() => handleToggleControl(row)}
            disabled={!(row.is_online ?? false)}
            className="scale-90"
          />
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <ContentLayout
      title="Device Control"
      afterTitle={
        buildings.length > 0 ? (
          <div className="mt-4">
            <ScrollableTabs
              value={activeBuildingId}
              onValueChange={(val) => {
                setSelectedBuildingId(val)
                setCurrentPage(1)
                setFilters({ room_id: [] })
                setTempRoomIds([])
              }}
              items={buildings.map((b) => ({
                id: b.id,
                label: b.name
              }))}
            />
          </div>
        ) : null
      }
      leading={
        <SearchInput
          placeholder="Search devices..."
          className="w-full max-w-full sm:max-w-md"
          value={search}
          onSearch={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
        />
      }
      trailing={
        <div className="flex items-center space-x-4">
          <FilterSheet
            onConfirm={() => {
              setFilters({ room_id: tempRoomIds })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempRoomIds([])
              setFilters({ room_id: [] })
              setCurrentPage(1)
            }}
            badgeCount={filters.room_id.length}
          >
            <FilterCheckbox filterGroups={filterGroups} />
          </FilterSheet>
        </div>
      }
    >
      <TableContainer<ListDeviceResponse>
        data={data?.data || []}
        columns={columns}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data?.metadata?.total_row || 0}
        totalPages={data?.metadata?.total_page || 0}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        loading={isLoading || isMeLoading}
        showCreatedAt={false}
        showEmptyImage={false}
        renderMobileItem={renderMobileItem}
      />
    </ContentLayout>
  )
}
