'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import * as React from 'react'

type ConfirmOptions = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  icon?: React.ReactNode
  iconClassName?: string
  dialogClassName?: string
  confirmButtonClassName?: string
  cancelButtonClassName?: string
  destructive?: boolean
}

type ConfirmContextType = (opts: ConfirmOptions) => Promise<boolean>

const ConfirmContext = React.createContext<ConfirmContextType | null>(null)

export function useConfirm() {
  const ctx = React.useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<ConfirmOptions | null>(null)
  const resolverRef = React.useRef<(v: boolean) => void>(() => {})

  // Expose a function that opens dialog and resolves a promise
  const confirm = React.useCallback((opts: ConfirmOptions) => {
    setOptions({
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      ...opts
    })
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  // Handlers
  const handleCancel = React.useCallback(() => {
    setOpen(false)
    resolverRef.current(false)
  }, [])

  const handleConfirm = React.useCallback(() => {
    setOpen(false)
    resolverRef.current(true)
  }, [])

  const defaultConfirmBtn =
    'w-full font-semibold rounded-md ' +
    (options?.destructive
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-primary hover:bg-primary/90 text-primary-foreground')

  const defaultCancelBtn =
    'w-full font-semibold rounded-md border border-input bg-background hover:bg-accent'

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-0">
            <DrawerHeader className="items-center text-center">
              {options?.icon && (
                <div
                  className={cn(
                    'mb-2 flex justify-center',
                    options.iconClassName
                  )}
                >
                  {options.icon}
                </div>
              )}
              <DrawerTitle
                className={cn(
                  'w-full text-center text-xl',
                  !options?.icon && 'mt-2'
                )}
              >
                {options?.title}
              </DrawerTitle>
              {!!options?.description && (
                <DrawerDescription className="w-full text-center text-muted-foreground mt-1">
                  {options.description}
                </DrawerDescription>
              )}
            </DrawerHeader>
            <DrawerFooter className="flex flex-row gap-3 pt-2 pb-8">
              <DrawerClose
                onClick={handleCancel}
                className={cn(
                  defaultCancelBtn,
                  'flex-1 min-h-12 text-base h-12 inline-flex items-center justify-center',
                  options?.cancelButtonClassName
                )}
              >
                {options?.cancelText}
              </DrawerClose>
              <button
                onClick={handleConfirm}
                className={cn(
                  defaultConfirmBtn,
                  'flex-1 min-h-12 text-base h-12 inline-flex items-center justify-center',
                  options?.confirmButtonClassName
                )}
              >
                {options?.confirmText}
              </button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent
            className={cn('max-w-md rounded-sm', options?.dialogClassName)}
            autoFocus={false}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <AlertDialogHeader className="items-center text-center sm:place-items-center sm:text-center">
              {options?.icon && (
                <div
                  className={cn(
                    'mb-4 flex justify-center',
                    options.iconClassName
                  )}
                >
                  {options.icon}
                </div>
              )}

              <AlertDialogTitle
                className={cn(
                  'w-full text-center text-2xl sm:text-center',
                  !options?.icon && 'mt-2'
                )}
              >
                {options?.title}
              </AlertDialogTitle>

              {!!options?.description && (
                <AlertDialogDescription className="w-full text-center text-muted-foreground sm:text-center">
                  {options.description}
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>

            <div className="mt-2 grid w-full grid-cols-2 gap-4">
              <AlertDialogCancel
                onClick={handleCancel}
                className={cn(
                  defaultCancelBtn,
                  'min-h-12 !text-base',
                  options?.cancelButtonClassName
                )}
              >
                {options?.cancelText}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className={cn(
                  defaultConfirmBtn,
                  'min-h-12 !text-base',
                  options?.confirmButtonClassName
                )}
              >
                {options?.confirmText}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ConfirmContext.Provider>
  )
}
