'use client'

import ImportDialog from '@/components/common/dialog/import-dialog'
import {
  downloadRoomTemplate,
  importRoom,
  RoomImportCreatedRow,
  RoomImportSkippedRow
} from '@/service/master/room/room-service'

interface ImportRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void | Promise<void>
}

export default function ImportRoomDialog({
  open,
  onOpenChange,
  onSuccess
}: ImportRoomDialogProps) {
  return (
    <ImportDialog<RoomImportCreatedRow, RoomImportSkippedRow>
      open={open}
      onOpenChange={onOpenChange}
      title="Import Room"
      description={
        <>
          Make sure the uploaded file is in the correct format. You can
          download the correct format
        </>
      }
      templateFileName="room_building_upload_template.xlsx"
      downloadTemplate={downloadRoomTemplate}
      uploadFile={async (file) => {
        const response = await importRoom(file)
        return response.data
      }}
      onImportSuccess={onSuccess}
    />
  )
}
