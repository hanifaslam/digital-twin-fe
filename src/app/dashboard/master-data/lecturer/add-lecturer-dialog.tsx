'use client'

import BaseDialog from '@/components/common/dialog/base-dialog'
import { MultiSelect } from '@/components/template/combobox/multi-selection'
import { SearchComboBox } from '@/components/template/modal/search-combobox'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  CreateLecturerPayload,
  createLecturerSchema
} from '@/schema/master/lecturer/lecturer-schema'
import { createLecturer } from '@/service/master/lecturer/lecturer-service'
import { getAllStudyPrograms } from '@/service/master/study-program/study-program-service'
import { getAllUsers } from '@/service/user-management/user-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

interface AddLecturerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddLecturerDialog({
  open,
  onOpenChange,
  onSuccess
}: AddLecturerDialogProps) {
  const form = useForm<CreateLecturerPayload>({
    resolver: zodResolver(
      createLecturerSchema
    ) as Resolver<CreateLecturerPayload>,
    mode: 'onChange',
    defaultValues: {
      user_id: '',
      study_program_ids: [],
      nip: ''
    }
  })

  const {
    data: usersResp,
    isLoading: isUsersLoading,
    run: runUsers
  } = useFetcher(() => getAllUsers({ role: 'DSN' }), {
    immediate: false
  })

  const {
    data: studyProgramsResp,
    isLoading: isStudyProgramsLoading,
    run: runStudyPrograms
  } = useFetcher(getAllStudyPrograms, {
    immediate: false
  })

  useEffect(() => {
    if (!open) return
    runUsers()
    runStudyPrograms()
  }, [open, runStudyPrograms, runUsers])

  const selectedUserId = useWatch({
    control: form.control,
    name: 'user_id'
  })
  const selectedUser = useMemo(
    () => usersResp?.find((user) => user.id === selectedUserId),
    [usersResp, selectedUserId]
  )

  const { onSubmit, isSubmitting } = useSubmit<CreateLecturerPayload, null>({
    mutation: createLecturer,
    form,
    uniqueErrors: [
      {
        field: 'nip',
        triggers: ['nip must be unique', 'nip already exists'],
        message: 'NIP is already used'
      }
    ],
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Lecturer',
    errorMessage: 'Failed To Add Lecturer',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Add Lecturer"
      content={
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    User<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <SearchComboBox
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? '')}
                      options={
                        usersResp?.map((user) => ({
                          value: user.id,
                          label: user.name
                        })) || []
                      }
                      placeholder="Select user"
                      isLoading={isUsersLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Name</FormLabel>
              <Input
                value={selectedUser?.name || ''}
                disabled
                placeholder="Choose user"
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Email</FormLabel>
              <Input
                value={selectedUser?.email || ''}
                disabled
                placeholder="Choose user"
              />
            </div>

            <FormField
              control={form.control}
              name="nip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    NIP<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter NIP"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_program_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Study Programs<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <MultiSelect
                      value={field.value}
                      onChange={field.onChange}
                      items={
                        studyProgramsResp?.map((studyProgram) => ({
                          id: studyProgram.id,
                          name: studyProgram.name
                        })) || []
                      }
                      placeholder="Select study programs"
                      searchPlaceholder="Search study programs..."
                      emptyText="No study programs found."
                      isLoading={isStudyProgramsLoading}
                      maxDisplayAuto={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !form.formState.isValid}
            type="submit"
          >
            {isSubmitting ? 'Adding...' : 'Submit'}
          </Button>
        </div>
      }
    />
  )
}
