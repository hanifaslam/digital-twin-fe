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
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import { getAllClasses } from '@/service/master/class/class-service'
import { getAllCourses } from '@/service/master/course/course-service'
import { getAllLecturers } from '@/service/master/lecturer/lecturer-service'
import { getAllRooms } from '@/service/master/room/room-service'
import {
  getAllDays,
  showSchedule,
  updateSchedule
} from '@/service/master/schedule/schedule-service'
import { getAllTimeSlots } from '@/service/master/time-slot/time-slot-service'
import {
  UpdateSchedulePayload,
  updateScheduleSchema
} from '@/schema/master/schedule/schedule-schema'
import { MeStudyProgramResponse } from '@/types/response/auth/auth-response'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

interface EditScheduleDialogProps {
  open: boolean
  scheduleId: string | null
  studyPrograms: MeStudyProgramResponse[]
  initialStudyProgramId: string
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function EditScheduleDialogSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  )
}

export default function EditScheduleDialog({
  open,
  scheduleId,
  studyPrograms,
  initialStudyProgramId,
  onOpenChange,
  onSuccess
}: EditScheduleDialogProps) {
  const form = useForm<UpdateSchedulePayload>({
    resolver: zodResolver(updateScheduleSchema) as Resolver<UpdateSchedulePayload>,
    mode: 'onChange',
    defaultValues: {
      study_program_id: initialStudyProgramId,
      class_id: '',
      room_id: '',
      lecturer_id: '',
      course_id: '',
      day: '',
      time_slot_id: [],
      status: true
    }
  })

  const selectedStudyProgramId = useWatch({
    control: form.control,
    name: 'study_program_id'
  })
  const previousStudyProgramIdRef = useRef<string | undefined>(undefined)

  const {
    data: scheduleResp,
    isLoading: isScheduleLoading,
    run: runSchedule,
    reset: resetSchedule
  } = useFetcher(() => showSchedule(scheduleId || ''), {
    immediate: false
  })

  const { data: roomsResp, isLoading: isRoomsLoading, run: runRooms } = useFetcher(
    getAllRooms,
    {
      immediate: false
    }
  )

  const {
    data: timeSlotsResp,
    isLoading: isTimeSlotsLoading,
    run: runTimeSlots
  } = useFetcher(getAllTimeSlots, {
    immediate: false
  })

  const {
    data: daysResp,
    isLoading: isDaysLoading,
    run: runDays
  } = useFetcher(getAllDays, {
    immediate: false
  })

  const {
    data: classesResp,
    isLoading: isClassesLoading,
    run: runClasses
  } = useFetcher(
    () =>
      getAllClasses({
        study_program_id: selectedStudyProgramId || ''
      }),
    {
      immediate: false
    }
  )

  const {
    data: lecturersResp,
    isLoading: isLecturersLoading,
    run: runLecturers
  } = useFetcher(
    () =>
      getAllLecturers({
        study_program_id: selectedStudyProgramId || ''
      }),
    {
      immediate: false
    }
  )

  const {
    data: coursesResp,
    isLoading: isCoursesLoading,
    run: runCourses
  } = useFetcher(
    () =>
      getAllCourses({
        study_program_id: selectedStudyProgramId || ''
      }),
    {
      immediate: false
    }
  )

  useEffect(() => {
    if (!open || !scheduleId) return
    runSchedule()
    runRooms()
    runTimeSlots()
    runDays()
  }, [open, runRooms, runSchedule, runTimeSlots, runDays, scheduleId])

  useEffect(() => {
    resetSchedule()
    previousStudyProgramIdRef.current = undefined

    if (!open) return

    form.reset({
      study_program_id: initialStudyProgramId,
      class_id: '',
      room_id: '',
      lecturer_id: '',
      course_id: '',
      day: '',
      time_slot_id: [],
      status: true
    })
  }, [form, initialStudyProgramId, open, resetSchedule, scheduleId])

  useEffect(() => {
    if (!scheduleResp) return

    form.reset({
      study_program_id: scheduleResp.study_program_id,
      class_id: scheduleResp.class_id,
      room_id: scheduleResp.room_id,
      lecturer_id: scheduleResp.lecturer_id,
      course_id: scheduleResp.course_id,
      day: scheduleResp.day,
      time_slot_id: scheduleResp.time_slots?.map((item) => item.id) ?? [],
      status: scheduleResp.status
    })
  }, [form, scheduleResp])

  useEffect(() => {
    if (!open || !selectedStudyProgramId) return

    const previousStudyProgramId = previousStudyProgramIdRef.current
    const hasChangedStudyProgram =
      previousStudyProgramId && previousStudyProgramId !== selectedStudyProgramId

    if (hasChangedStudyProgram) {
      form.setValue('class_id', '', { shouldDirty: true, shouldValidate: true })
      form.setValue('lecturer_id', '', {
        shouldDirty: true,
        shouldValidate: true
      })
      form.setValue('course_id', '', { shouldDirty: true, shouldValidate: true })
    }

    previousStudyProgramIdRef.current = selectedStudyProgramId
    runClasses()
    runLecturers()
    runCourses()
  }, [form, open, runClasses, runCourses, runLecturers, selectedStudyProgramId])

  const { onSubmit, isSubmitting } = useSubmit<UpdateSchedulePayload, null>({
    mutation: (payload) => updateSchedule(scheduleId || '', payload),
    form,
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Updated Schedule',
    errorMessage: 'Failed To Update Schedule',
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      previousStudyProgramIdRef.current = undefined
      form.reset()
      resetSchedule()
    }
    onOpenChange(newOpen)
  }

  const isFormLoading =
    isScheduleLoading ||
    isRoomsLoading ||
    isTimeSlotsLoading ||
    isClassesLoading ||
    isLecturersLoading ||
    isCoursesLoading ||
    isDaysLoading
  const isInitialLoading = isFormLoading && !scheduleResp

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Schedule"
      content={
        isInitialLoading ? (
          <EditScheduleDialogSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
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
                        options={studyPrograms.map((studyProgram) => ({
                          value: studyProgram.id,
                          label: studyProgram.name
                        }))}
                        placeholder="Select study program"
                        disabled={isFormLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Class<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchComboBox
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? '')}
                        options={
                          classesResp?.map((item) => ({
                            value: item.id,
                            label: item.name
                          })) || []
                        }
                        placeholder="Select class"
                        isLoading={isClassesLoading}
                        disabled={isFormLoading || !selectedStudyProgramId}
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
                          roomsResp?.map((item) => ({
                            value: item.id,
                            label: item.name
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

              <FormField
                control={form.control}
                name="lecturer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Lecturer<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchComboBox
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? '')}
                        options={
                          lecturersResp?.map((item) => ({
                            value: item.id,
                            label: item.name
                          })) || []
                        }
                        placeholder="Select lecturer"
                        isLoading={isLecturersLoading}
                        disabled={isFormLoading || !selectedStudyProgramId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Course<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchComboBox
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? '')}
                        options={
                          coursesResp?.map((item) => ({
                            value: item.id,
                            label: item.name
                          })) || []
                        }
                        placeholder="Select course"
                        isLoading={isCoursesLoading}
                        disabled={isFormLoading || !selectedStudyProgramId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Day<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchComboBox
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? '')}
                        options={
                          daysResp?.map((item) => ({
                            value: item.value,
                            label: item.label
                          })) || []
                        }
                        placeholder="Select day"
                        isLoading={isDaysLoading}
                        disabled={isFormLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_slot_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Time Slots<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <MultiSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        items={
                          timeSlotsResp?.map((item) => ({
                            id: item.id,
                            name: item.name
                          })) || []
                        }
                        placeholder="Select time slots"
                        searchPlaceholder="Search time slots..."
                        emptyText="No time slots found."
                        isLoading={isTimeSlotsLoading}
                        disabled={isFormLoading}
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






