'use client'

import { StatusBadge } from '@/components/common/badge/status-badge'
import SearchInput from '@/components/common/input/search-input'
import {
  TableAction,
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
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
import { getAllBuildings } from '@/service/master/building/building-service'
import { ListHelperResponse } from '@/types/response/master/helper/helper-response'
import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AddHelperDialog from './add-helper-dialog'
import EditHelperDialog from './edit-helper-dialog'

export default function HelperPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    building_id: [] as string[],
    status: [] as string[]
  })
  const [tempBuildingIds, setTempBuildingIds] = useState<string[]>([])
  const [tempStatuses, setTempStatuses] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingHelperId, setEditingHelperId] = useState<string | null>(null)

  const { data: buildingsResp, run: runBuildings } = useFetcher(
    getAllBuildings,
    {
      immediate: false
    }
  )

  useEffect(() => {
    runBuildings()
  }, [runBuildings])

  const filterGroups: FilterGroup[] = [
    {
      label: 'Building',
      options:
        buildingsResp?.map((building) => ({
          label: building.name,
          value: building.id
        })) || [],
      selected: tempBuildingIds,
      onChange: setTempBuildingIds
    },
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
      building_id: filters.building_id.join(','),
      status: filters.status.join(',')
    }),
    [currentPage, itemsPerPage, search, filters]
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

  return (
    <ContentLayout
      title="Helper"
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
                building_id: tempBuildingIds,
                status: tempStatuses
              })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempBuildingIds([])
              setTempStatuses([])
              setFilters({ building_id: [], status: [] })
              setCurrentPage(1)
            }}
            badgeCount={filters.building_id.length + filters.status.length}
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
          loading={isLoading}
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
