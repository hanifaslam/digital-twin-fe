'use client'

import ImportDialog from '@/components/common/dialog/import-dialog'
import {
  downloadScheduleTemplate,
  importSchedule,
  ScheduleImportCreatedRow,
  ScheduleImportSkippedRow
} from '@/service/master/schedule/schedule-service'

interface ImportScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void | Promise<void>
}

export default function ImportScheduleDialog({
  open,
  onOpenChange,
  onSuccess
}: ImportScheduleDialogProps) {
  return (
    <ImportDialog<ScheduleImportCreatedRow, ScheduleImportSkippedRow>
      open={open}
      onOpenChange={onOpenChange}
      title="Import Schedule"
      description={
        <>
          Make sure the uploaded file is in the correct format. You can
          download the correct format
        </>
      }
      helperText="Make sure lecturer and room master data have been uploaded before importing schedules."
      templateFileName="format_schedule.xlsx"
      downloadTemplate={downloadScheduleTemplate}
      uploadFile={async (file) => {
        const response = await importSchedule(file)
        return response.data
      }}
      onImportSuccess={onSuccess}
    />
  )
}
