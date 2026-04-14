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
import { Skeleton } from '@/components/ui/skeleton'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  UpdateTimeSlotPayload,
  updateTimeSlotSchema
} from '@/schema/master/time-slot/time-slot-schema'
import {
  showTimeSlot,
  updateTimeSlot
} from '@/service/master/time-slot/time-slot-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditTimeSlotDialogProps {
  open: boolean
  timeSlotId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EditTimeSlotDialogSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export default function EditTimeSlotDialog({
  open,
  timeSlotId,
  onOpenChange,
  onSuccess
}: EditTimeSlotDialogProps) {
  const form = useForm<UpdateTimeSlotPayload>({
    resolver: zodResolver(updateTimeSlotSchema) as Resolver<UpdateTimeSlotPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      start_time: '',
      end_time: ''
    }
  })

  const {
    data: timeSlotResp,
    isLoading: isTimeSlotLoading,
    run: runTimeSlot,
    reset: resetTimeSlot
  } = useFetcher(() => showTimeSlot(timeSlotId || ''), {
    immediate: false
  })

  useEffect(() => {
    if (!open || !timeSlotId) return
    runTimeSlot()
  }, [open, runTimeSlot, timeSlotId])

  useEffect(() => {
    resetTimeSlot()
    if (!open) return

    form.reset({
      name: '',
      start_time: '',
      end_time: ''
    })
  }, [form, open, resetTimeSlot, timeSlotId])

  useEffect(() => {
    if (!timeSlotResp) return

    form.reset({
      name: timeSlotResp.name,
      start_time: timeSlotResp.start_time,
      end_time: timeSlotResp.end_time
    })
  }, [form, timeSlotResp])

  const { onSubmit, isSubmitting } = useSubmit<UpdateTimeSlotPayload, null>({
    mutation: (payload) => updateTimeSlot(timeSlotId || '', payload),
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Time Slot',
    errorMessage: 'Failed To Update Time Slot',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      resetTimeSlot()
    }
    onOpenChange(newOpen)
  }

  const isInitialLoading = isTimeSlotLoading && !timeSlotResp

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Time Slot"
      content={
        isInitialLoading ? (
          <EditTimeSlotDialogSkeleton />
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
                        placeholder="Enter time slot name"
                        {...field}
                        autoComplete="off"
                        disabled={isTimeSlotLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Time<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        step="60"
                        disabled={isTimeSlotLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      End Time<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        step="60"
                        disabled={isTimeSlotLoading}
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
              isTimeSlotLoading ||
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
