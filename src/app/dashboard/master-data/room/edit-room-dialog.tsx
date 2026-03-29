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
  UpdateRoomPayload,
  updateRoomSchema
} from '@/schema/master/room/room-schema'
import { getAllBuildings } from '@/service/master/building/building-service'
import { getAllFloors } from '@/service/master/floor/floor-service'
import { showRoom, updateRoom } from '@/service/master/room/room-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditRoomDialogProps {
  open: boolean
  roomId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EditRoomDialogSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  )
}

export default function EditRoomDialog({
  open,
  roomId,
  onOpenChange,
  onSuccess
}: EditRoomDialogProps) {
  const form = useForm<UpdateRoomPayload>({
    resolver: zodResolver(updateRoomSchema) as Resolver<UpdateRoomPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      building_id: '',
      floor: '',
      status: true
    }
  })

  const {
    data: roomResp,
    isLoading: isRoomLoading,
    run: runRoom,
    reset: resetRoom
  } = useFetcher(() => showRoom(roomId || ''), {
    immediate: false
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
    if (!open || !roomId) return
    runRoom()
    runBuildings()
    runFloors()
  }, [open, roomId, runBuildings, runFloors, runRoom])

  useEffect(() => {
    resetRoom()
    if (!open) return

    form.reset({
      name: '',
      building_id: '',
      floor: '',
      status: true
    })
  }, [form, open, resetRoom, roomId])

  useEffect(() => {
    if (!roomResp) return

    form.reset({
      name: roomResp.name,
      building_id: roomResp.building_id,
      floor: roomResp.floor_id,
      status: roomResp.status
    })
  }, [form, roomResp])

  const { onSubmit, isSubmitting } = useSubmit<UpdateRoomPayload, null>({
    mutation: (payload) => updateRoom(roomId || '', payload),
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Room',
    errorMessage: 'Failed To Update Room',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      resetRoom()
    }
    onOpenChange(newOpen)
  }

  const isFormLoading = isRoomLoading || isBuildingsLoading || isFloorsLoading
  const isInitialLoading = isFormLoading && !roomResp

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Room"
      content={
        isInitialLoading ? (
          <EditRoomDialogSkeleton />
        ) : (
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
                        disabled={isFormLoading}
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
                        disabled={isFormLoading}
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
