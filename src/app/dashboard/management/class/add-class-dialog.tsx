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
  CreateClassPayload,
  createClassSchema
} from '@/schema/master/class/class-schema'
import { createClass } from '@/service/master/class/class-service'
import { getAllStudyPrograms } from '@/service/master/study-program/study-program-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface AddClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddClassDialog({
  open,
  onOpenChange,
  onSuccess
}: AddClassDialogProps) {
  const form = useForm<CreateClassPayload>({
    resolver: zodResolver(createClassSchema) as Resolver<CreateClassPayload>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      study_program_id: '',
      status: true
    }
  })

  const {
    data: studyProgramsResp,
    isLoading: isStudyProgramsLoading,
    run: runStudyPrograms
  } = useFetcher(getAllStudyPrograms, {
    immediate: false
  })

  useEffect(() => {
    if (!open) return
    runStudyPrograms()
  }, [open, runStudyPrograms])

  const { onSubmit, isSubmitting } = useSubmit<CreateClassPayload, null>({
    mutation: createClass,
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added Class',
    errorMessage: 'Failed To Add Class',
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
      title="Add Class"
      content={
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter class name"
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
              name="study_program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Study Program<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <SearchComboBox
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? '')}
                      options={
                        studyProgramsResp?.map((studyProgram) => ({
                          value: studyProgram.id,
                          label: studyProgram.name
                        })) || []
                      }
                      placeholder="Select study program"
                      isLoading={isStudyProgramsLoading}
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
