'use client'

import SearchInput from '@/components/common/input/search-input'
import {
  TableAction,
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { EyeIcon } from '@/components/icons/eye-icon'
import { PencilIcon } from '@/components/icons/pencil-icon'
import ContentLayout from '@/components/layout/content-layout'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import IconButton from '@/components/template/button/icon-button'
import {
  FilterCheckbox,
  FilterGroup
} from '@/components/template/content/filter-check'
import { FilterSheet } from '@/components/template/modal/filter-sheet'
import { Switch } from '@/components/ui/switch'
import { useRole } from '@/hooks/api/user-management/use-role'
import { updateRoleStatus } from '@/service/user-management/role-service'
import { ListRoleResponse } from '@/types/response/user-management/role-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function RolePage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    status: [] as string[]
  })
  const [tempStatus, setTempStatus] = useState<string[]>([])

  const router = useRouter()

  const confirm = useConfirm()

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

  const { data, isLoading, mutate } = useRole(param)

  const handleToggleStatus = async (row: ListRoleResponse) => {
    const confirmed = await confirm({
      title: `${row.is_active ? 'Deactivate' : 'Activate'} Role`,
      description: `Are you sure you want to ${row.is_active ? 'deactivate' : 'activate'} this role?`,
      confirmText: `${row.is_active ? 'Yes, Deactivate' : 'Yes, Activate'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: row.is_active ? 'bg-red-600 hover:bg-red-700' : ''
    })

    if (!confirmed) return

    try {
      await updateRoleStatus(row.id)
      mutate()
      toast.success(
        `Role ${row.is_active ? 'deactivated' : 'activated'} successfully`
      )
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message || 'Failed to update role status'
      )
    }
  }

  const columns: TableColumn<ListRoleResponse>[] = [
    {
      key: 'code',
      label: 'Role Code',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.code}</p>
      )
    },
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[150px]',
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
            checked={value.is_active}
            onCheckedChange={() => handleToggleStatus(value)}
          />
          <span className="text-sm font-medium">
            {value.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    }
  ]

  function handleEdit(row: ListRoleResponse) {
    router.push(`/dashboard/user-management/role/edit-role/${row.id}`)
  }

  function handleDetails(row: ListRoleResponse) {
    router.push(`/dashboard/user-management/role/detail/${row.id}`)
  }

  const tableAction: TableAction<ListRoleResponse>[] = [
    {
      label: 'Edit',
      onClick: handleEdit,
      icon: <PencilIcon />,
      variant: 'ghost'
    },
    {
      label: 'Details',
      onClick: handleDetails,
      icon: <EyeIcon />,
      variant: 'ghost'
    }
  ]

  return (
    <ContentLayout
      title="Role"
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
            badgeCount={filters.status.length}
            onConfirm={() => {
              setFilters({ status: tempStatus })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempStatus([])
              setFilters({ status: [] })
            }}
          >
            <FilterCheckbox filterGroups={filterGroups} />
          </FilterSheet>
          <Link href={'/dashboard/user-management/role/add-role'}>
            <IconButton icon={<PlusIcon />} title="Add" />
          </Link>
        </div>
      }
    >
      <div>
        <TableContainer<ListRoleResponse>
          data={data?.data || []}
          columns={columns}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data?.metadata?.total_row || 0}
          totalPages={data?.metadata?.total_page || 0}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          loading={isLoading}
          actions={tableAction}
          showCreatedAt={false}
          showEmptyImage={false}
        />
      </div>
    </ContentLayout>
  )
}
