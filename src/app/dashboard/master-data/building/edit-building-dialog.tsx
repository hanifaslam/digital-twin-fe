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
  UpdateBuildingPayload,
  updateBuildingSchema
} from '@/schema/master/building/building-schema'
import {
  showBuilding,
  updateBuilding
} from '@/service/master/building/building-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditBuildingDialogProps {
  open: boolean
  buildingId: string | null
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

export default function EditBuildingDialog({
  open,
  buildingId,
  onOpenChange,
  onSuccess
}: EditBuildingDialogProps) {
  const form = useForm<UpdateBuildingPayload>({
    resolver: zodResolver(
      updateBuildingSchema
    ) as Resolver<UpdateBuildingPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      code: '',
      status: true
    }
  })

  const { data, isLoading, run, reset } = useFetcher(
    () => showBuilding(buildingId || ''),
    { immediate: false }
  )

  useEffect(() => {
    if (!open || !buildingId) return
    run()
  }, [open, buildingId, run])

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
    UpdateBuildingPayload,
    null
  >({
    mutation: (payload) => {
      if (!buildingId) return Promise.reject()
      return updateBuilding(buildingId, payload)
    },
    form,
    autoReset: false,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Building',
    errorMessage: 'Failed To Update Building',
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
      title="Edit Building"
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
                      Building Name
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter building name"
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