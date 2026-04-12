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
import { Switch } from '@/components/ui/switch'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  CreateDevicePayload,
  createDeviceSchema
} from '@/schema/master/device/device-schema'
import { createDevice, getTypes } from '@/service/master/device/device-service'
import { getAllRooms } from '@/service/master/room/room-service'
import { DeviceTypeResponse } from '@/types/response/master/device/device-response'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

interface AddDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddDeviceDialog({
  open,
  onOpenChange,
  onSuccess
}: AddDeviceDialogProps) {
  const form = useForm<CreateDevicePayload>({
    resolver: zodResolver(createDeviceSchema) as Resolver<CreateDevicePayload>,
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
    if (!open) return
    runDeviceTypes()
    runRooms()
  }, [open, runDeviceTypes, runRooms])

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

  const { onSubmit, isSubmitting } = useSubmit<CreateDevicePayload, null>({
    mutation: createDevice,
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Device',
    errorMessage: 'Failed To Add Device',
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
      title="Add Device"
      content={
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
