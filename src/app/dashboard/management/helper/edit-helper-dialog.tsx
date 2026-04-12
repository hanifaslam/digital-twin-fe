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
import { Switch } from '@/components/ui/switch'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  UpdateHelperPayload,
  updateHelperSchema
} from '@/schema/master/helper/helper-schema'
import { getAllBuildings } from '@/service/master/building/building-service'
import { showHelper, updateHelper } from '@/service/master/helper/helper-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditHelperDialogProps {
  open: boolean
  helperId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EditHelperDialogSkeleton() {
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
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  )
}

export default function EditHelperDialog({
  open,
  helperId,
  onOpenChange,
  onSuccess
}: EditHelperDialogProps) {
  const form = useForm<UpdateHelperPayload>({
    resolver: zodResolver(updateHelperSchema) as Resolver<UpdateHelperPayload>,
    mode: 'onChange',
    defaultValues: {
      user_id: '',
      building_ids: [],
      phone_number: '',
      status: true
    }
  })

  const {
    data: helperResp,
    isLoading: isHelperLoading,
    run: runHelper,
    reset: resetHelper
  } = useFetcher(() => showHelper(helperId || ''), {
    immediate: false
  })

  const {
    data: buildingsResp,
    isLoading: isBuildingsLoading,
    run: runBuildings
  } = useFetcher(getAllBuildings, {
    immediate: false
  })

  useEffect(() => {
    if (!open || !helperId) return
    runHelper()
    runBuildings()
  }, [helperId, open, runBuildings, runHelper])

  useEffect(() => {
    resetHelper()
    if (!open) return

    form.reset({
      user_id: '',
      building_ids: [],
      phone_number: '',
      status: true
    })
  }, [form, helperId, open, resetHelper])

  useEffect(() => {
    if (!helperResp) return

    form.reset({
      user_id: helperResp.user_id,
      building_ids: helperResp.buildings?.map((building) => building.id) ?? [],
      phone_number: helperResp.phone_number,
      status: helperResp.status
    })
  }, [form, helperResp])

  const { onSubmit, isSubmitting } = useSubmit<UpdateHelperPayload, null>({
    mutation: (payload) => updateHelper(helperId || '', payload),
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Helper',
    errorMessage: 'Failed To Update Helper',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      resetHelper()
    }
    onOpenChange(newOpen)
  }

  const isFormLoading = isHelperLoading || isBuildingsLoading
  const isInitialLoading = isFormLoading && !helperResp

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Helper"
      content={
        isInitialLoading ? (
          <EditHelperDialogSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Name</FormLabel>
                <Input
                  value={helperResp?.name || ''}
                  disabled
                  placeholder="Choose user"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input
                  value={helperResp?.email || ''}
                  disabled
                  placeholder="Choose user"
                />
              </div>

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
                        placeholder="Enter phone number"
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
                name="building_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Buildings<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <MultiSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        items={
                          buildingsResp?.map((building) => ({
                            id: building.id,
                            name: building.name
                          })) || []
                        }
                        placeholder="Select buildings"
                        searchPlaceholder="Search buildings..."
                        emptyText="No buildings found."
                        isLoading={isBuildingsLoading}
                        disabled={isFormLoading}
                        maxDisplayAuto={true}
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
