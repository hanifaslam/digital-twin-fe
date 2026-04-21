import { XCircleIcon } from '@/components/icons/x-circle-icon'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'

interface SheetDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  className?: string
  childClassName?: string
  children?: React.ReactNode
  confirmButtonText?: string
  cancelButtonText?: string
  confirmDisabled?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

export function SheetDrawer({
  open,
  onOpenChange,
  className,
  childClassName,
  title,
  children,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  confirmDisabled
}: SheetDrawerProps) {
  const isMobile = useIsMobile()

  function onCancelHandle() {
    onOpenChange(false)
    if (onCancel) {
      onCancel()
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen && onCancel) {
      onCancel()
    }
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className={cn('p-0', className)}>
          <DrawerHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
              <Button
                variant="ghost"
                onClick={onCancelHandle}
                size="icon"
                className="rounded-full"
              >
                <XCircleIcon className="size-5" />
              </Button>
            </div>
          </DrawerHeader>
          <div
            className={cn(
              'max-h-[60vh] overflow-y-auto px-6 py-4',
              childClassName
            )}
          >
            {children}
          </div>
          <DrawerFooter className="border-t px-6 py-4">
            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onCancelHandle}
                size="lg"
              >
                {cancelButtonText || 'Cancel'}
              </Button>
              <Button
                className="flex-1"
                onClick={onConfirm}
                disabled={confirmDisabled}
                size="lg"
              >
                {confirmButtonText || 'Save'}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        className={cn('min-w-xl [&>button:last-child]:hidden', className)}
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
      >
        <SheetHeader className="border-border border-b">
          <div className="flex items-center justify-between gap-1 px-2">
            <SheetTitle className="text-2xl font-semibold">{title}</SheetTitle>

            <Button
              variant={'ghost'}
              onClick={onCancelHandle}
              size={'icon'}
              aria-label="Close sheet"
            >
              <XCircleIcon className="size-4" />
            </Button>
          </div>
        </SheetHeader>
        <div className={cn('flex-1 overflow-y-auto px-6 py-1', childClassName)}>
          {children}
        </div>
        <SheetFooter className="shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex w-full justify-center gap-4">
            <Button
              variant={'outline'}
              className="border-primary text-primary hover:bg-primary flex-1 border hover:text-white"
              onClick={onCancelHandle}
              size={'lg'}
            >
              {cancelButtonText || 'Cancel'}
            </Button>
            <Button
              className="flex-1"
              size={'lg'}
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              {confirmButtonText || 'Save'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
