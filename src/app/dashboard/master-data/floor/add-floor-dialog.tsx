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
  CreateFloorPayload,
  createFloorSchema
} from '@/schema/master/floor/floor-schema'

import {
  createFloor
} from '@/service/master/floor/floor-service'

interface AddFloorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddFloorDialog({
  open,
  onOpenChange,
  onSuccess
}: AddFloorDialogProps) {
  const form = useForm<CreateFloorPayload>({
    resolver: zodResolver(createFloorSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      status: true
    }
  })

  const { onSubmit, isSubmitting } = useSubmit<
    CreateFloorPayload,
    null
  >({
    mutation: createFloor,
    form,
    autoReset: true,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Floor',
    errorMessage: 'Failed To Add Floor',
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
      title="Add Floor"
      content={
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
                      placeholder="Enter Floor name"
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