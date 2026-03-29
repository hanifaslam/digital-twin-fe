import { XIcon } from '@/components/icons/x-icon'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface BaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export default function BaseDialog({
  open,
  onOpenChange,
  title,
  content,
  footer,
  className
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('[&>button]:hidden p-0 gap-0', className)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="px-6 py-6 border-b">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogClose asChild>
              <button className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                <XIcon className="size-5" />
              </button>
            </DialogClose>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-4">{content}</div>
        </ScrollArea>

        {footer && (
          <div className="px-6 py-4 border-t">
            <DialogFooter>{footer}</DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
