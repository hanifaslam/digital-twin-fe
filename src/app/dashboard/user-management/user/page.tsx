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
import { useUser } from '@/hooks/api/user-management/use-user'
import { updateUserStatus } from '@/service/user-management/user-service'
import { ListUserResponse } from '@/types/response/user-management/user-response'
import { AxiosError } from 'axios'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function UserPage() {
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

  const { data, isLoading, mutate } = useUser(param)

  const handleToggleStatus = async (row: ListUserResponse) => {
    const confirmed = await confirm({
      title: `${row.status ? 'Deactivate' : 'Activate'} User`,
      description: `Are you sure you want to ${row.status ? 'deactivate' : 'activate'} this user?`,
      confirmText: `${row.status ? 'Yes, Deactivate' : 'Yes, Activate'}`,
      cancelText: 'Cancel',
      confirmButtonClassName: row.status ? 'bg-red-600 hover:bg-red-700' : ''
    })

    if (!confirmed) return

    try {
      await updateUserStatus(row.id)
      mutate()
      toast.success(
        `User ${row.status ? 'deactivated' : 'activated'} successfully`
      )
    } catch (error) {
      toast.error(
        (error as AxiosError)?.message || 'Failed to update user status'
      )
    }
  }

  const columns: TableColumn<ListUserResponse>[] = [
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.name}</p>
      )
    },
    {
      key: 'username',
      label: 'Username',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.username}</p>
      )
    },
    {
      key: 'email',
      label: 'Email',
      className: 'min-w-[200px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.email}</p>
      )
    },
    {
      key: 'role_name',
      label: 'Role',
      className: 'min-w-[150px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.role_name}</p>
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

  function handleEdit(row: ListUserResponse) {
    router.push(`/dashboard/user-management/user/edit-user/${row.id}`)
  }

  function handleDetails(row: ListUserResponse) {
    router.push(`/dashboard/user-management/user/detail/${row.id}`)
  }

  const tableAction: TableAction<ListUserResponse>[] = [
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
      title="User"
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
          >
            <FilterCheckbox filterGroups={filterGroups} />
          </FilterSheet>
          <Link href={'/dashboard/user-management/user/add-user'}>
            <IconButton icon={<PlusIcon />} title="Add" />
          </Link>
        </div>
      }
    >
      <div>
        <TableContainer<ListUserResponse>
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
