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
  UpdateCoursePayload,
  updateCourseSchema
} from '@/schema/master/course/course-schema'
import {
  getAllSemesters,
  showCourse,
  updateCourse
} from '@/service/master/course/course-service'
import { getAllStudyPrograms } from '@/service/master/study-program/study-program-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditCourseDialogProps {
  open: boolean
  courseId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EditCourseDialogSkeleton() {
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

export default function EditCourseDialog({
  open,
  courseId,
  onOpenChange,
  onSuccess
}: EditCourseDialogProps) {
  const form = useForm<UpdateCoursePayload>({
    resolver: zodResolver(updateCourseSchema) as Resolver<UpdateCoursePayload>,
    mode: 'onChange',
    defaultValues: {
      code: '',
      name: '',
      semester: 1,
      study_program_id: '',
      status: true
    }
  })

  const {
    data: courseResp,
    isLoading: isCourseLoading,
    run: runCourse,
    reset: resetCourse
  } = useFetcher(() => showCourse(courseId || ''), {
    immediate: false
  })

  const {
    data: studyProgramsResp,
    isLoading: isStudyProgramsLoading,
    run: runStudyPrograms
  } = useFetcher(getAllStudyPrograms, {
    immediate: false
  })

  const {
    data: semestersResp,
    isLoading: isSemestersLoading,
    run: runSemesters
  } = useFetcher(getAllSemesters, {
    immediate: false
  })

  useEffect(() => {
    if (!open || !courseId) return
    runCourse()
    runStudyPrograms()
    runSemesters()
  }, [courseId, open, runCourse, runSemesters, runStudyPrograms])

  useEffect(() => {
    resetCourse()
    if (!open) return

    form.reset({
      code: '',
      name: '',
      semester: 1,
      study_program_id: '',
      status: true
    })
  }, [courseId, form, open, resetCourse])

  useEffect(() => {
    if (!courseResp) return

    form.reset({
      code: courseResp.code,
      name: courseResp.name,
      semester: courseResp.semester,
      study_program_id: courseResp.study_program_id,
      status: courseResp.status
    })
  }, [courseResp, form])

  const { onSubmit, isSubmitting } = useSubmit<UpdateCoursePayload, null>({
    mutation: (payload) => updateCourse(courseId || '', payload),
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Course',
    errorMessage: 'Failed To Update Course',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      resetCourse()
    }
    onOpenChange(newOpen)
  }

  const isFormLoading =
    isCourseLoading || isStudyProgramsLoading || isSemestersLoading
  const isInitialLoading = isFormLoading && !courseResp

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Course"
      content={
        isInitialLoading ? (
          <EditCourseDialogSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Code<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter course code"
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter course name"
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
                        disabled={isFormLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Semester<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchComboBox
                        value={field.value ? String(field.value) : ''}
                        onChange={(value) =>
                          field.onChange(value ? Number(value) : undefined)
                        }
                        options={
                          semestersResp?.map((semester) => ({
                            value: String(semester.value),
                            label: semester.label
                          })) || []
                        }
                        placeholder="Select semester"
                        isLoading={isSemestersLoading}
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
