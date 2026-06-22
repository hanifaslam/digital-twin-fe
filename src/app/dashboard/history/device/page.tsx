'use client'

import SearchInput from '@/components/common/input/search-input'
import {
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { ErrorPage } from '@/components/common/tabs/error-page'
import { ScrollableTabs } from '@/components/common/tabs/scrollable-tabs'
import ContentLayout from '@/components/layout/content-layout'
import IconButton from '@/components/template/button/icon-button'
import {
  FilterCheckbox,
  FilterGroup
} from '@/components/template/content/filter-check'
import { FilterDateRange } from '@/components/template/content/filter-date-range'
import { FilterSheet } from '@/components/template/modal/filter-sheet'
import { useDeviceHistory } from '@/hooks/api/history/device/use-device-history'
import useFetcher from '@/hooks/use-fetcher'
import { me } from '@/service/auth/auth-service'
import { DeviceHistoryService } from '@/service/history/device/device-history-service'
import { getAllRooms } from '@/service/master/room/room-service'
import { DeviceHistoryResponse } from '@/types/response/history/device/device-history-response'
import { format } from 'date-fns'
import { DownloadIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { toast } from 'sonner'

export default function DeviceHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedBuildingId, setSelectedBuildingId] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    undefined
  )
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([])
  const [tempSelectedRoomIds, setTempSelectedRoomIds] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)

  const {
    data: meResp,
    isLoading: isMeLoading,
    error: meError
  } = useFetcher(me, { immediate: true })

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

  useEffect(() => {
    if (activeBuildingId) {
      runRooms({ building_id: activeBuildingId })
    }
  }, [activeBuildingId, runRooms])

  const start_date = useMemo(
    () => (dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined),
    [dateRange]
  )
  const end_date = useMemo(
    () => (dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined),
    [dateRange]
  )

  const filterGroups: FilterGroup[] = [
    {
      label: 'Room',
      options:
        roomsResp?.map((room) => ({
          label: room.name,
          value: room.id
        })) || [],
      selected: tempSelectedRoomIds,
      onChange: setTempSelectedRoomIds
    }
  ]

  const param = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      building_id: activeBuildingId,
      room_id:
        selectedRoomIds.length > 0 ? selectedRoomIds.join(',') : undefined,
      start_date,
      end_date,
      q: search
    }),
    [
      currentPage,
      itemsPerPage,
      activeBuildingId,
      selectedRoomIds,
      start_date,
      end_date,
      search
    ]
  )

  const { data, isLoading } = useDeviceHistory(param)

  const columns: TableColumn<DeviceHistoryResponse>[] = [
    {
      key: 'device_name',
      label: 'Device Name',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="truncate font-medium text-sm text-foreground">
          {value.device_name}
        </p>
      )
    },
    {
      key: 'device_type',
      label: 'Type',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="truncate font-medium text-sm text-foreground">
          {value.device_type}
        </p>
      )
    },
    {
      key: 'room_name',
      label: 'Room',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="truncate font-medium text-sm text-foreground">
          {value.room_name || '-'}
        </p>
      )
    },
    {
      key: 'date',
      label: 'Date',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="truncate font-medium text-sm text-foreground">
          {value.date}
        </p>
      )
    },
    {
      key: 'total_energy',
      label: 'Total Energy (kWh)',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="text-sm font-medium text-foreground">
          {value.total_energy} kWh
        </p>
      )
    }
  ]

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await DeviceHistoryService.export(param)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `device-history-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
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
    return <ErrorPage message="Failed to load buildings from current user." />
  }

  if (!isMeLoading && buildings.length === 0) {
    return <ErrorPage message="No building access found for this account." />
  }

  return (
    <ContentLayout
      title="Device History"
      afterTitle={
        buildings.length > 0 ? (
          <div className="mt-4">
            <ScrollableTabs
              value={activeBuildingId}
              onValueChange={(buildingId) => {
                setSelectedBuildingId(buildingId)
                setCurrentPage(1)
                setSelectedRoomIds([])
                setTempSelectedRoomIds([])
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
            icon={<DownloadIcon size={16} />}
            title="Export"
            onClick={handleExport}
            loading={isExporting}
            variant="outline"
          />
          <FilterSheet
            onConfirm={() => {
              setDateRange(tempDateRange)
              setSelectedRoomIds(tempSelectedRoomIds)
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempDateRange(undefined)
              setDateRange(undefined)
              setTempSelectedRoomIds([])
              setSelectedRoomIds([])
              setCurrentPage(1)
            }}
            badgeCount={(dateRange?.from ? 1 : 0) + selectedRoomIds.length}
          >
            <div className="space-y-6">
              <FilterCheckbox filterGroups={filterGroups} />
              <FilterDateRange
                filterGroups={[
                  {
                    label: 'Date Range',
                    startDate: tempDateRange?.from,
                    endDate: tempDateRange?.to,
                    onStartDateChange: (date) =>
                      setTempDateRange((prev) => ({
                        from: date,
                        to: prev?.to
                      })),
                    onEndDateChange: (date) =>
                      setTempDateRange((prev) => ({
                        from: prev?.from,
                        to: date
                      }))
                  }
                ]}
              />
            </div>
          </FilterSheet>
        </div>
      }
    >
      <div>
        <TableContainer<DeviceHistoryResponse>
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
        />
      </div>
    </ContentLayout>
  )
}
