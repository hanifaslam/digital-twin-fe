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
import { Switch } from '@/components/ui/switch'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  CreateHelperPayload,
  createHelperSchema
} from '@/schema/master/helper/helper-schema'
import { getAllBuildings } from '@/service/master/building/building-service'
import { createHelper } from '@/service/master/helper/helper-service'
import { getAllUsers } from '@/service/user-management/user-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

interface AddHelperDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddHelperDialog({
  open,
  onOpenChange,
  onSuccess
}: AddHelperDialogProps) {
  const form = useForm<CreateHelperPayload>({
    resolver: zodResolver(createHelperSchema) as Resolver<CreateHelperPayload>,
    mode: 'onChange',
    defaultValues: {
      user_id: '',
      building_ids: [],
      phone_number: '',
      status: true
    }
  })

  const {
    data: usersResp,
    isLoading: isUsersLoading,
    run: runUsers
  } = useFetcher(() => getAllUsers({ role: 'HP' }), {
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
    if (!open) return
    runUsers()
    runBuildings()
  }, [open, runBuildings, runUsers])

  const selectedUserId = useWatch({
    control: form.control,
    name: 'user_id'
  })

  const selectedUser = useMemo(
    () => usersResp?.find((user) => user.id === selectedUserId),
    [usersResp, selectedUserId]
  )

  const { onSubmit, isSubmitting } = useSubmit<CreateHelperPayload, null>({
    mutation: createHelper,
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Helper',
    errorMessage: 'Failed To Add Helper',
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
      title="Add Helper"
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
                      value={field.value}
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
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
