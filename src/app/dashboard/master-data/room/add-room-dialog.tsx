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
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  CreateRoomPayload,
  createRoomSchema
} from '@/schema/master/room/room-schema'
import { getAllBuildings } from '@/service/master/building/building-service'
import { getAllFloors } from '@/service/master/floor/floor-service'
import { createRoom } from '@/service/master/room/room-service'
import { SearchComboBox } from '@/components/template/modal/search-combobox'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface AddRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddRoomDialog({
  open,
  onOpenChange,
  onSuccess
}: AddRoomDialogProps) {
  const form = useForm<CreateRoomPayload>({
    resolver: zodResolver(createRoomSchema) as Resolver<CreateRoomPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      building_id: '',
      floor: '',
      status: true
    }
  })

  const {
    data: buildingsResp,
    isLoading: isBuildingsLoading,
    run: runBuildings
  } = useFetcher(getAllBuildings, {
    immediate: false
  })

  const {
    data: floorsResp,
    isLoading: isFloorsLoading,
    run: runFloors
  } = useFetcher(getAllFloors, {
    immediate: false
  })

  useEffect(() => {
    if (!open) return
    runBuildings()
    runFloors()
  }, [open, runBuildings, runFloors])

  const { onSubmit, isSubmitting } = useSubmit<CreateRoomPayload, null>({
    mutation: createRoom,
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Room',
    errorMessage: 'Failed To Add Room',
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
      title="Add Room"
      content={
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Room Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter room name"
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
              name="building_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Building<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <SearchComboBox
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? '')}
                      options={
                        buildingsResp?.map((building) => ({
                          value: building.id,
                          label: building.name
                        })) || []
                      }
                      placeholder="Select building"
                      isLoading={isBuildingsLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Floor<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <SearchComboBox
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? '')}
                      options={
                        floorsResp?.map((floor) => ({
                          value: floor.id,
                          label: floor.name
                        })) || []
                      }
                      placeholder="Select floor"
                      isLoading={isFloorsLoading}
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
