'use client'

import { StatusBadge } from '@/components/common/badge/status-badge'
import SearchInput from '@/components/common/input/search-input'
import {
  TableAction,
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { ErrorPage } from '@/components/common/tabs/error-page'
import { ScrollableTabs } from '@/components/common/tabs/scrollable-tabs'
import { PencilIcon } from '@/components/icons/pencil-icon'
import ContentLayout from '@/components/layout/content-layout'
import IconButton from '@/components/template/button/icon-button'
import {
  FilterCheckbox,
  FilterGroup
} from '@/components/template/content/filter-check'
import { FilterSheet } from '@/components/template/modal/filter-sheet'
import { useHelper } from '@/hooks/api/master/helper/use-helper'
import useFetcher from '@/hooks/use-fetcher'
import { me } from '@/service/auth/auth-service'
import { ListHelperResponse } from '@/types/response/master/helper/helper-response'
import { PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import AddHelperDialog from './add-helper-dialog'
import EditHelperDialog from './edit-helper-dialog'

export default function HelperPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedBuildingId, setSelectedBuildingId] = useState('')
  const [filters, setFilters] = useState({
    status: [] as string[]
  })
  const [tempStatuses, setTempStatuses] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingHelperId, setEditingHelperId] = useState<string | null>(null)

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

  const filterGroups: FilterGroup[] = [
    {
      label: 'Status',
      options: [
        {
          label: 'Active',
          value: 'true'
        },
        {
          label: 'Inactive',
          value: 'false'
        }
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
      building_id: activeBuildingId,
      status: filters.status.join(',')
    }),
    [currentPage, itemsPerPage, search, activeBuildingId, filters]
  )

  const { data, isLoading, refetch } = useHelper(param)

  const columns: TableColumn<ListHelperResponse>[] = [
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'email',
      label: 'Email',
      className: 'min-w-[220px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.email}</p>
      )
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
      className: 'min-w-[180px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.phone_number}</p>
      )
    },
    {
      key: 'buildings',
      label: 'Buildings',
      className: 'min-w-[220px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">
          {Array.isArray(value.buildings)
            ? value.buildings.join(', ')
            : value.buildings || '-'}
        </p>
      )
    },
    {
      key: 'status',
      label: 'Status',
      className: 'min-w-[150px]',
      render: (row) => <StatusBadge status={row.status} />
    }
  ]

  function handleEdit(row: ListHelperResponse) {
    setEditingHelperId(row.id)
  }

  const tableAction: TableAction<ListHelperResponse>[] = [
    {
      label: 'Edit',
      onClick: handleEdit,
      icon: <PencilIcon />,
      variant: 'ghost'
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
      title="Helper"
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
          <FilterSheet
            onConfirm={() => {
              setFilters({
                status: tempStatuses
              })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempStatuses([])
              setFilters({ status: [] })
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
        <TableContainer<ListHelperResponse>
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
          actions={tableAction}
        />
      </div>
      <AddHelperDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => void refetch()}
      />
      <EditHelperDialog
        open={Boolean(editingHelperId)}
        helperId={editingHelperId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingHelperId(null)
          }
        }}
        onSuccess={() => void refetch()}
      />
    </ContentLayout>
  )
}
