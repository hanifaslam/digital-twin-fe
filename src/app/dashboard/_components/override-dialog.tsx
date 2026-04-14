'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { handleApiError } from '@/lib/utils'
import { LecturerService } from '@/service/master/lecturer/lecturer-service'
import { AlertCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface OverrideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function OverrideDialog({
  open,
  onOpenChange,
  onSuccess
}: OverrideDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await LecturerService.overrideStatus({ status: 'BUSY' })
      toast.success('Successfully set status to Not Available!')
      onOpenChange(false)
      onSuccess?.()
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Failed to set status'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="[&>button]:hidden p-0 gap-0 max-w-sm">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Clock Out - Override</DialogTitle>
          <DialogDescription className="sr-only">
            Manually override your status to offline.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 space-y-5">
          {/* Info */}
          <div className="flex gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800">
                Manual Override
              </p>
              <p className="text-xs text-amber-700">
                This will manually record your clock-out and set your status to
                offline. Use this if face recognition is unavailable.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                'Confirm Clock Out'
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
