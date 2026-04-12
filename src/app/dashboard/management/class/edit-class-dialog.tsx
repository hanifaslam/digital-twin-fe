'use client'

import BaseDialog from '@/components/common/dialog/base-dialog'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  UpdateClassPayload,
  updateClassSchema
} from '@/schema/master/class/class-schema'
import {
  showClass,
  updateClass
} from '@/service/master/class/class-service'
import { getAllStudyPrograms } from '@/service/master/study-program/study-program-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditClassDialogProps {
  open: boolean
  classId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EditClassDialogSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  )
}

export default function EditClassDialog({
  open,
  classId,
  onOpenChange,
  onSuccess
}: EditClassDialogProps) {
  const form = useForm<UpdateClassPayload>({
    resolver: zodResolver(updateClassSchema) as Resolver<UpdateClassPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      study_program_id: '',
      status: true
    }
  })

  const {
    data: classResp,
    isLoading: isClassLoading,
    run: runClass,
    reset: resetClass
  } = useFetcher(() => showClass(classId || ''), {
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
    if (!open || !classId) return
    runClass()
    runStudyPrograms()
  }, [classId, open, runClass, runStudyPrograms])

  useEffect(() => {
    resetClass()
    if (!open) return

    form.reset({
      name: '',
      study_program_id: '',
      status: true
    })
  }, [classId, form, open, resetClass])

  useEffect(() => {
    if (!classResp) return

    form.reset({
      name: classResp.name,
      study_program_id: classResp.study_program_id,
      status: classResp.status
    })
  }, [classResp, form])

  const { onSubmit, isSubmitting } = useSubmit<UpdateClassPayload, null>({
    mutation: (payload) => updateClass(classId || '', payload),
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Class',
    errorMessage: 'Failed To Update Class',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      resetClass()
    }
    onOpenChange(newOpen)
  }

  const isFormLoading = isClassLoading || isStudyProgramsLoading
  const isInitialLoading = isFormLoading && !classResp

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Class"
      content={
        isInitialLoading ? (
          <EditClassDialogSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter class name"
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
                name="study_program_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Study Program<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchComboBox
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? '')}
                        options={
                          studyProgramsResp?.map((studyProgram) => ({
                            value: studyProgram.id,
                            label: studyProgram.name
                          })) || []
                        }
                        placeholder="Select study program"
                        isLoading={isStudyProgramsLoading}
                        disabled={isFormLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={Boolean(field.value)}
                          onCheckedChange={field.onChange}
                          disabled={isFormLoading}
                        />
                        <span>{field.value ? 'Active' : 'Inactive'}</span>
                      </div>
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
