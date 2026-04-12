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
  UpdateDevicePayload,
  updateDeviceSchema
} from '@/schema/master/device/device-schema'
import {
  getTypes,
  showDevice,
  updateDevice
} from '@/service/master/device/device-service'
import { getAllRooms } from '@/service/master/room/room-service'
import {
  DeviceTypeResponse,
  ShowDeviceResponse
} from '@/types/response/master/device/device-response'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

interface EditDeviceDialogProps {
  open: boolean
  deviceId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EditDeviceDialogSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  )
}

export default function EditDeviceDialog({
  open,
  deviceId,
  onOpenChange,
  onSuccess
}: EditDeviceDialogProps) {
  const form = useForm<UpdateDevicePayload>({
    resolver: zodResolver(updateDeviceSchema) as Resolver<UpdateDevicePayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: '',
      room_id: '',
      mqtt_topic: '',
      stream_url: '',
      status: true
    }
  })
  const selectedType = useWatch({
    control: form.control,
    name: 'type'
  })
  const isCctv = selectedType?.trim().toLowerCase() === 'cctv'

  const {
    data: deviceResp,
    isLoading: isDeviceLoading,
    run: runDevice,
    reset: resetDevice
  } = useFetcher<ShowDeviceResponse>(() => showDevice(deviceId || ''), {
    immediate: false
  })

  const {
    data: deviceTypesResp,
    isLoading: isDeviceTypesLoading,
    run: runDeviceTypes
  } = useFetcher(getTypes, {
    immediate: false
  })

  const {
    data: roomsResp,
    isLoading: isRoomsLoading,
    run: runRooms
  } = useFetcher(getAllRooms, {
    immediate: false
  })

  useEffect(() => {
    if (!open || !deviceId) return
    runDevice()
    runDeviceTypes()
    runRooms()
  }, [open, deviceId, runDevice, runDeviceTypes, runRooms])

  useEffect(() => {
    resetDevice()
    if (!open) return

    form.reset({
      name: '',
      type: '',
      room_id: '',
      mqtt_topic: '',
      stream_url: '',
      status: true
    })
  }, [form, open, resetDevice, deviceId])

  useEffect(() => {
    if (!deviceResp) return

    form.reset({
      name: deviceResp.name,
      type: deviceResp.type,
      room_id: deviceResp.room_id,
      mqtt_topic: deviceResp.mqtt_topic || '',
      stream_url: deviceResp.stream_url || '',
      status: deviceResp.status
    })
  }, [form, deviceResp])

  useEffect(() => {
    if (!selectedType) return

    if (isCctv) {
      form.setValue('mqtt_topic', '', {
        shouldDirty: false,
        shouldValidate: true
      })
      form.clearErrors('mqtt_topic')
      return
    }

    form.setValue('stream_url', '', {
      shouldDirty: false,
      shouldValidate: true
    })
    form.clearErrors('stream_url')
  }, [form, isCctv, selectedType])

  const { onSubmit, isSubmitting } = useSubmit<UpdateDevicePayload, null>({
    mutation: (payload) => updateDevice(deviceId || '', payload),
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Device',
    errorMessage: 'Failed To Update Device',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      resetDevice()
    }
    onOpenChange(newOpen)
  }

  const isFormLoading =
    isDeviceLoading || isDeviceTypesLoading || isRoomsLoading
  const isInitialLoading = isFormLoading && !deviceResp

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Device"
      content={
        isInitialLoading ? (
          <EditDeviceDialogSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Device Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter device name"
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchComboBox
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? '')}
                        options={
                          deviceTypesResp?.map((type) => {
                            if (typeof type === 'string') {
                              return {
                                value: type,
                                label: type
                              }
                            }

                            const typedType = type as DeviceTypeResponse
                            return {
                              value: typedType.value,
                              label: typedType.label || typedType.value
                            }
                          }) || []
                        }
                        placeholder="Select type"
                        isLoading={isDeviceTypesLoading}
                        disabled={isFormLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="room_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Room<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchComboBox
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? '')}
                        options={
                          roomsResp?.map((room) => ({
                            value: room.id,
                            label: room.name
                          })) || []
                        }
                        placeholder="Select room"
                        isLoading={isRoomsLoading}
                        disabled={isFormLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isCctv ? (
                <FormField
                  control={form.control}
                  name="stream_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Stream URL<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter stream URL"
                          {...field}
                          autoComplete="off"
                          disabled={isFormLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="mqtt_topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        MQTT Topic<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter MQTT topic"
                          {...field}
                          autoComplete="off"
                          disabled={isFormLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
