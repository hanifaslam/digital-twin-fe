import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLecturerActivityLog } from '@/hooks/api/history/lecturer/use-lecturer-history'
import { Loader2 } from 'lucide-react'

interface ActivityLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lecturerId: string | null
  date?: string
}

export function ActivityLogDialog({
  open,
  onOpenChange,
  lecturerId,
  date
}: ActivityLogDialogProps) {
  const { data, isLoading } = useLecturerActivityLog(
    open ? lecturerId : null,
    date
  )

  const logs = data?.data || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Activity Log</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No activity log found.
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              {logs.map((log, index) => {
                const dotColor = 'bg-gray-700'

                let badgeColor = ''
                if (log.text === 'Not Available') {
                  badgeColor = 'bg-red-100 text-red-600'
                } else if (
                  log.text === 'Available' ||
                  log.text === 'Via Face Recognition'
                ) {
                  badgeColor = 'bg-green-100 text-green-700'
                } else if (log.text.toLowerCase().includes('manual')) {
                  badgeColor = 'bg-orange-100 text-orange-600'
                } else {
                  badgeColor = 'bg-gray-100 text-gray-600'
                }

                return (
                  <div
                    key={index}
                    className="flex gap-4 p-3 border rounded-lg bg-card shadow-sm"
                  >
                    <div className="flex-none pt-1.5">
                      <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-primary">
                          {log.time}
                        </span>
                        {log.title === 'Clock In' && (
                          <span className="text-sm text-primary font-medium">
                            {log.title}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-medium ${badgeColor}`}
                        >
                          {log.text}
                        </span>
                      </div>
                      <p className="text-xs font-normal mt-1 text-foreground">
                        {log.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
