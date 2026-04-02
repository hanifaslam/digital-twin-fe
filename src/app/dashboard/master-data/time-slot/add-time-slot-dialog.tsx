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
import { useSubmit } from '@/hooks/use-submit'
import {
  CreateTimeSlotPayload,
  createTimeSlotSchema
} from '@/schema/master/time-slot/time-slot-schema'
import { createTimeSlot } from '@/service/master/time-slot/time-slot-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface AddTimeSlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddTimeSlotDialog({
  open,
  onOpenChange,
  onSuccess
}: AddTimeSlotDialogProps) {
  const form = useForm<CreateTimeSlotPayload>({
    resolver: zodResolver(createTimeSlotSchema) as Resolver<CreateTimeSlotPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      start_time: '',
      end_time: ''
    }
  })

  const { onSubmit, isSubmitting } = useSubmit<CreateTimeSlotPayload, null>({
    mutation: createTimeSlot,
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Time Slot',
    errorMessage: 'Failed To Add Time Slot',
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
      title="Add Time Slot"
      content={
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
                    <Input type="time" {...field} step="60" />
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
                    <Input type="time" {...field} step="60" />
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
