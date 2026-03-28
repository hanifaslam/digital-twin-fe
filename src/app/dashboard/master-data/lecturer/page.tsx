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
import { useLecturer } from '@/hooks/api/master/lecturer/use-lecturer'
import useFetcher from '@/hooks/use-fetcher'
import { getAllStudyPrograms } from '@/service/master/study-program/study-program-service'
import { ListLecturerResponse } from '@/types/response/master/lecturer/lecturer-response'
import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AddLecturerDialog from './add-lecturer-dialog'
import EditLecturerDialog from './edit-lecturer-dialog'

export default function LecturerPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    study_program: [] as string[]
  })
  const [tempStudyPrograms, setTempStudyPrograms] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLecturerId, setEditingLecturerId] = useState<string | null>(
    null
  )

  const { data: studyProgramsResp, run: runStudyPrograms } = useFetcher(
    getAllStudyPrograms,
    {
      immediate: false
    }
  )

  useEffect(() => {
    runStudyPrograms()
  }, [runStudyPrograms])

  const filterGroups: FilterGroup[] = [
    {
      label: 'Study Program',
      options:
        studyProgramsResp?.map((studyProgram) => ({
          label: studyProgram.name,
          value: studyProgram.id
        })) || [],
      selected: tempStudyPrograms,
      onChange: setTempStudyPrograms
    }
  ]

  const param = useMemo(
    () => ({
      page: currentPage,
      per_page: itemsPerPage,
      q: search,
      study_program: filters.study_program.join(',')
    }),
    [currentPage, itemsPerPage, search, filters]
  )

  const { data, isLoading, mutate } = useLecturer(param)

  const columns: TableColumn<ListLecturerResponse>[] = [
    {
      key: 'nip',
      label: 'NIP',
      className: 'min-w-[160px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">{value.nip}</p>
      )
    },
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
      key: 'study_program',
      label: 'Study Program',
      className: 'min-w-[220px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">
          {Array.isArray(value.study_program)
            ? value.study_program.join(', ')
            : value.study_program || '-'}
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

  function handleEdit(row: ListLecturerResponse) {
    setEditingLecturerId(row.id)
  }

  const tableAction: TableAction<ListLecturerResponse>[] = [
    {
      label: 'Edit',
      onClick: handleEdit,
      icon: <PencilIcon />,
      variant: 'ghost'
    }
  ]

  return (
    <ContentLayout
      title="Lecturer"
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
              setFilters({ study_program: tempStudyPrograms })
              setCurrentPage(1)
            }}
            onCancel={() => {
              setTempStudyPrograms([])
              setFilters({ study_program: [] })
            }}
            badgeCount={filters.study_program.length}
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
        <TableContainer<ListLecturerResponse>
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
      <AddLecturerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => mutate()}
      />
      <EditLecturerDialog
        open={Boolean(editingLecturerId)}
        lecturerId={editingLecturerId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingLecturerId(null)
          }
        }}
        onSuccess={() => mutate()}
      />
    </ContentLayout>
  )
}
