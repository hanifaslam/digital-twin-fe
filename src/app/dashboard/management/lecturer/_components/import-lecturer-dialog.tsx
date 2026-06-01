'use client'

import ImportDialog from '@/components/common/dialog/import-dialog'
import {
  downloadLecturerTemplate,
  importLecturer,
  LecturerImportCreatedRow,
  LecturerImportSkippedRow
} from '@/service/master/lecturer/lecturer-service'

interface ImportLecturerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void | Promise<void>
}

export default function ImportLecturerDialog({
  open,
  onOpenChange,
  onSuccess
}: ImportLecturerDialogProps) {
  return (
    <ImportDialog<LecturerImportCreatedRow, LecturerImportSkippedRow>
      open={open}
      onOpenChange={onOpenChange}
      title="Import Lecturer"
      description={
        <>
          Make sure the uploaded file is in the correct format. You can
          download the correct format
        </>
      }
      templateFileName="lecturer_upload_template.xlsx"
      downloadTemplate={downloadLecturerTemplate}
      uploadFile={async (file) => {
        const response = await importLecturer(file)
        return response.data
      }}
      onImportSuccess={onSuccess}
    />
  )
}
