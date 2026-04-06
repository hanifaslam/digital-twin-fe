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
import { useSubmit } from '@/hooks/use-submit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  CreateBuildingPayload,
  createBuildingSchema
} from '@/schema/master/building/building-schema'

import {
  createBuilding
} from '@/service/master/building/building-service'

interface AddBuildingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddBuildingDialog({
  open,
  onOpenChange,
  onSuccess
}: AddBuildingDialogProps) {
  const form = useForm<CreateBuildingPayload>({
    resolver: zodResolver(createBuildingSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      code: '',
      status: true
    }
  })

  const { onSubmit, isSubmitting } = useSubmit<
    CreateBuildingPayload,
    null
  >({
    mutation: createBuilding,
    form,
    autoReset: true,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Building',
    errorMessage: 'Failed To Add Building',
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
      title="Add Building"
      content={
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
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
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
          </form>
        </Form>
      }
    />
  )
}