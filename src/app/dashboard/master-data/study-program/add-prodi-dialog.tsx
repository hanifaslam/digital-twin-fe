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
  CreateStudyProgramPayload,
  createStudyProgramSchema
} from '@/schema/master/study-program/study-program-schema'

import {
  createStudyProgram
} from '@/service/master/study-program/study-program-service'

interface AddStudyProgramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddStudyProgramDialog({
  open,
  onOpenChange,
  onSuccess
}: AddStudyProgramDialogProps) {
  const form = useForm<CreateStudyProgramPayload>({
    resolver: zodResolver(createStudyProgramSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      code: '',
      status: true
    }
  })

  const { onSubmit, isSubmitting } = useSubmit<
    CreateStudyProgramPayload,
    null
  >({
    mutation: createStudyProgram,
    form,
    autoReset: true,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Study Program',
    errorMessage: 'Failed To Add Study Program',
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
      title="Add Study Program"
      content={
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Study Program Name
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter study program name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CODE */}
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

            {/* STATUS (FIXED) */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2 mt-2">
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

            {/* SUBMIT BUTTON DI DALAM FORM (PENTING) */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                type="button"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
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