'use client'

import BaseDialog from '@/components/common/dialog/base-dialog'
import ImportErrorDialog from '@/components/common/dialog/import-error-dialog'
import { AppButton } from '@/components/wrappers/app-button'
import { handleErrorToast } from '@/lib/error-parser'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import LoadingSpinner from '../loader/loading-spinner'

export interface ImportResultColumn<T> {
  key: string
  label: string
  render: (row: T) => React.ReactNode
}

export interface BaseImportResult<TCreated, TSkipped> {
  created_count: number
  skipped_count: number
  created: TCreated[]
  skipped: TSkipped[]
  default_password?: string
  sheet_name?: string
  study_program_name?: string
  class_name?: string
  semester?: string | number
}

interface ImportDialogProps<TCreated, TSkipped> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  helperText?: React.ReactNode
  emptyFileText?: string
  templateFileName: string
  acceptedFileTypes?: string
  uploadLabel?: string
  downloadTemplate: () => Promise<Blob>
  uploadFile: (file: File) => Promise<BaseImportResult<TCreated, TSkipped>>
  onImportSuccess?: () => void | Promise<void>
}

export default function ImportDialog<TCreated, TSkipped>({
  open,
  onOpenChange,
  title,
  description,
  helperText,
  emptyFileText = 'Choose File .xlsx or .xls',
  templateFileName,
  acceptedFileTypes = '.xlsx,.xls',
  uploadLabel = 'Upload',
  downloadTemplate,
  uploadFile,
  onImportSuccess
}: ImportDialogProps<TCreated, TSkipped>) {
  const fileInputId = useId()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [failedCount, setFailedCount] = useState(0)

  const resetState = () => {
    setSelectedFile(null)
  }

  const validateFile = (file: File) => {
    const allowedExtensions = ['.xlsx', '.xls']
    const normalizedName = file.name.toLowerCase()
    return allowedExtensions.some((extension) =>
      normalizedName.endsWith(extension)
    )
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (!validateFile(file)) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)')
      event.target.value = ''
      return
    }

    setSelectedFile(file)
  }

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
    setIsDownloading(true)
    try {
      const blob = await downloadTemplate()
      triggerBlobDownload(blob, templateFileName)
      toast.success('Template downloaded successfully')
    } catch (error) {
      handleErrorToast(error, 'Failed to download template')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadFile(selectedFile)
      await onImportSuccess?.()
      resetState()
      onOpenChange(false)

      if (result.skipped_count > 0) {
        setFailedCount(result.skipped_count)
        setIsErrorDialogOpen(true)
        return
      }

      toast.success(`Upload completed. Created: ${result.created_count}`)
    } catch (error) {
      handleErrorToast(error, 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <BaseDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetState()
          }
          onOpenChange(isOpen)
        }}
        title={title}
        className="max-w-4xl"
        content={
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm leading-6 text-foreground">
                {description}{' '}
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  disabled={isDownloading}
                  className="text-primary underline underline-offset-2 disabled:opacity-60"
                >
                  {isDownloading ? 'downloading' : 'here'}
                </button>
                .
              </p>

              {helperText ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  {helperText}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor={fileInputId} className="cursor-pointer">
                  <AppButton type="button" variant="outline" asChild>
                    <span>Choose File</span>
                  </AppButton>
                  <input
                    id={fileInputId}
                    type="file"
                    accept={acceptedFileTypes}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <span className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : emptyFileText}
                </span>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="flex w-full items-center justify-end gap-3">
            <AppButton
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-primary text-white hover:bg-primary/80"
            >
              {isUploading ? (
                <LoadingSpinner className="size-4" />
              ) : (
                uploadLabel
              )}
            </AppButton>
          </div>
        }
      />

      <ImportErrorDialog
        open={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
        failedCount={failedCount}
        title={title}
        onDownloadTemplate={downloadTemplate}
        templateFileName={templateFileName}
      />
    </>
  )
}
