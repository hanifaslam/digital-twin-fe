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
  UpdateFloorPayload,
  updateFloorSchema
} from '@/schema/master/floor/floor-schema'
import {
  showFloor,
  updateFloor
} from '@/service/master/floor/floor-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditFloorDialogProps {
  open: boolean
  floorId: string | null
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

export default function EditFloorDialog({
  open,
  floorId,
  onOpenChange,
  onSuccess
}: EditFloorDialogProps) {
  const form = useForm<UpdateFloorPayload>({
    resolver: zodResolver(
      updateFloorSchema
    ) as Resolver<UpdateFloorPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      status: true
    }
  })

  const { data, isLoading, run, reset } = useFetcher(
    () => showFloor(floorId || ''),
    { immediate: false }
  )

  useEffect(() => {
    if (!open || !floorId) return
    run()
  }, [open, floorId, run])

  useEffect(() => {
    if (!open) return
    form.reset({
      name: '',
      status: true
    })
  }, [open, form])

  useEffect(() => {
    if (!data) return
    form.reset({
      name: data?.name ?? '',
      status: data?.status ?? true
    })
  }, [data, form])

  const { onSubmit, isSubmitting } = useSubmit<
    UpdateFloorPayload,
    null
  >({
    mutation: (payload) => {
      if (!floorId) return Promise.reject()
      return updateFloor(floorId, payload)
    },
    form,
    autoReset: false,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Floor',
    errorMessage: 'Failed To Update Floor',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset({
        name: '',
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
      title="Edit Floor"
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
                      Floor Name
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter floor name"
                        {...field}
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