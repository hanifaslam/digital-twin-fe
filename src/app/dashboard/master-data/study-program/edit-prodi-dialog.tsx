'use client'

import BaseDialog from '@/components/common/dialog/base-dialog'
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
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  UpdateStudyProgramPayload,
  updateStudyProgramSchema
} from '@/schema/master/study-program/study-program-schema'
import {
  showStudyProgram,
  updateStudyProgram
} from '@/service/master/study-program/study-program-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditStudyProgramDialogProps {
  open: boolean
  studyProgramId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function SkeletonForm() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default function EditStudyProgramDialog({
  open,
  studyProgramId,
  onOpenChange,
  onSuccess
}: EditStudyProgramDialogProps) {
  const form = useForm<UpdateStudyProgramPayload>({
    resolver: zodResolver(
      updateStudyProgramSchema
    ) as Resolver<UpdateStudyProgramPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      code: '',
      status: true
    }
  })

  const { data, isLoading, run, reset } = useFetcher(
    () => showStudyProgram(studyProgramId || ''),
    { immediate: false }
  )

  useEffect(() => {
    if (!open || !studyProgramId) return
    run()
  }, [open, studyProgramId, run])

  useEffect(() => {
    if (!open) return
    form.reset({
      name: '',
      code: '',
      status: true
    })
  }, [open, form])

  useEffect(() => {
    if (!data) return
    form.reset({
      name: data?.name ?? '',
      code: data?.code ?? '',
      status: data?.status ?? true
    })
  }, [data, form])

  const { onSubmit, isSubmitting } = useSubmit<
    UpdateStudyProgramPayload,
    null
  >({
    mutation: (payload) => {
      if (!studyProgramId) return Promise.reject()
      return updateStudyProgram(studyProgramId, payload)
    },
    form,
    autoReset: false,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Study Program',
    errorMessage: 'Failed To Update Study Program',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset({
        name: '',
        code: '',
        status: true
      })
      reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Study Program"
      content={
        isLoading && !data ? (
          <SkeletonForm />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Study Program Name
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter study program name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Code
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter code"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
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
                      <div className="flex flex-col gap-2 mt-2">
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-sm">
                          {field.value ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? 'Updating...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        )
      }
    />
  )
}