'use client'

import BaseDialog from '@/components/common/dialog/base-dialog'
import { AppButton } from '@/components/wrappers/app-button'
import { handleErrorToast } from '@/lib/error-parser'
import { useState } from 'react'
import { toast } from 'sonner'

interface ImportErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  failedCount: number
  title?: string
  onDownloadTemplate?: () => Promise<Blob>
  templateFileName?: string
}

export default function ImportErrorDialog({
  open,
  onOpenChange,
  failedCount,
  title = 'Import Item',
  onDownloadTemplate,
  templateFileName = 'import-template.xlsx'
}: ImportErrorDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const triggerBlobDownload = (blob: Blob, fileName: string) => {
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(downloadUrl)
  }

  const handleDownloadTemplate = async () => {
    if (!onDownloadTemplate) return

    setIsDownloading(true)
    try {
      const blob = await onDownloadTemplate()
      triggerBlobDownload(blob, templateFileName)
      toast.success('Template downloaded successfully')
    } catch (error) {
      handleErrorToast(error, 'Failed to download template')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      content={
        <div className="space-y-4">
          <div>
            <p className="text-sm mb-4">
              {failedCount} row{failedCount > 1 ? 's were' : ' was'} skipped.
              {onDownloadTemplate && (
                <>
                  {' '}Download the correct template{' '}
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    disabled={isDownloading}
                    className="text-[#03AC8F] underline"
                  >
                    here
                  </button>
                </>
              )}
              .
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end">
          <AppButton
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-[#2E3933] text-white hover:bg-[#26302B]"
          >
            OK
          </AppButton>
        </div>
      }
    />
  )
}
