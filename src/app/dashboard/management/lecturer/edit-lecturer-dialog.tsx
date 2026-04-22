'use client'

import BaseDialog from '@/components/common/dialog/base-dialog'
import { MultiSelect } from '@/components/template/combobox/multi-selection'
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
import { Skeleton } from '@/components/ui/skeleton'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  UpdateLecturerPayload,
  updateLecturerSchema
} from '@/schema/master/lecturer/lecturer-schema'
import {
  showLecturer,
  updateLecturer
} from '@/service/master/lecturer/lecturer-service'
import { getAllStudyPrograms } from '@/service/master/study-program/study-program-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditLecturerDialogProps {
  open: boolean
  lecturerId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EditLecturerDialogSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export default function EditLecturerDialog({
  open,
  lecturerId,
  onOpenChange,
  onSuccess
}: EditLecturerDialogProps) {
  const form = useForm<UpdateLecturerPayload>({
    resolver: zodResolver(
      updateLecturerSchema
    ) as Resolver<UpdateLecturerPayload>,
    mode: 'onChange',
    defaultValues: {
      user_id: '',
      study_program_ids: [],
      nip: '',
      phone_number: ''
    }
  })

  const {
    data: lecturerResp,
    isLoading: isLecturerLoading,
    run: runLecturer,
    reset: resetLecturer
  } = useFetcher(() => showLecturer(lecturerId || ''), {
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
    if (!open || !lecturerId) return
    runLecturer()
    runStudyPrograms()
  }, [lecturerId, open, runLecturer, runStudyPrograms])

  useEffect(() => {
    resetLecturer()
    if (!open) return

    form.reset({
      user_id: '',
      study_program_ids: [],
      nip: '',
      phone_number: ''
    })
  }, [form, lecturerId, open, resetLecturer])

  useEffect(() => {
    if (!lecturerResp) return

    form.reset({
      user_id: lecturerResp.user_id,
      study_program_ids:
        lecturerResp.study_program_ids ??
        lecturerResp.study_program?.map((studyProgram) => studyProgram.id) ??
        (lecturerResp.study_program_id ? [lecturerResp.study_program_id] : []),
      nip: lecturerResp.nip,
      phone_number: lecturerResp.phone_number
    })
  }, [form, lecturerResp])

  const { onSubmit, isSubmitting } = useSubmit<UpdateLecturerPayload, null>({
    mutation: (payload) => updateLecturer(lecturerId || '', payload),
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
    successMessage: 'Successfully Updated Lecturer',
    errorMessage: 'Failed To Update Lecturer',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      resetLecturer()
    }
    onOpenChange(newOpen)
  }

  const isFormLoading = isLecturerLoading || isStudyProgramsLoading
  const isInitialLoading = isFormLoading && !lecturerResp

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Lecturer"
      content={
        isInitialLoading ? (
          <EditLecturerDialogSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Name</FormLabel>
                <Input
                  value={lecturerResp?.name || ''}
                  disabled
                  placeholder="Choose user"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input
                  value={lecturerResp?.email || ''}
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
                        disabled={isFormLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Phone Number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          field.onChange(value)
                        }}
                        inputMode="numeric"
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
                        disabled={isFormLoading}
                        maxDisplayAuto={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
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
            disabled={
              isInitialLoading ||
              isFormLoading ||
              isSubmitting ||
              !form.formState.isValid ||
              !form.formState.isDirty
            }
            type="submit"
          >
            {isSubmitting ? 'Updating...' : 'Submit'}
          </Button>
        </div>
      }
    />
  )
}
