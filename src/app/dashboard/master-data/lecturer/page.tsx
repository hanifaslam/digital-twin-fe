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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function LecturerPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    study_program: [] as string[]
  })
  const [tempStudyPrograms, setTempStudyPrograms] = useState<string[]>([])

  const router = useRouter()
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

  const { data, isLoading } = useLecturer(param)

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
      key: 'study_program_name',
      label: 'Study Program',
      className: 'min-w-[220px]',
      render: (value) => (
        <p className="truncate text-sm font-medium">
          {value.study_program_name}
        </p>
      )
    }
  ]

  function handleEdit(row: ListLecturerResponse) {
    router.push(`/dashboard/master-data/lecturer/edit-lecturer/${row.id}`)
  }

  function handleDetails(row: ListLecturerResponse) {
    router.push(`/dashboard/master-data/lecturer/detail/${row.id}`)
  }

  const tableAction: TableAction<ListLecturerResponse>[] = [
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
          <Link href={'/dashboard/master-data/lecturer/add-lecturer'}>
            <IconButton icon={<PlusIcon />} title="Add" />
          </Link>
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
    </ContentLayout>
  )
}
