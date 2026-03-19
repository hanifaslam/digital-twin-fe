import { FilterIcon } from '@/components/icons/filter-icon'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { SheetDrawer } from './sheet-drawer'

interface FilterSheetProps {
  buttonText?: string
  buttonIcon?: React.ComponentType<{ className?: string }>
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  onConfirm?: () => void
  onCancel?: () => void
  children: React.ReactNode
  className?: string
  badgeCount?: number
}

export function FilterSheet({
  buttonText = 'Filter',
  buttonIcon: Icon = FilterIcon,
  title = 'Filter',
  confirmButtonText = 'Save',
  cancelButtonText = 'Reset',
  onConfirm,
  onCancel,
  children,
  className,
  badgeCount
}: FilterSheetProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    setOpen(false)
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={`flex min-w-[100px] items-center gap-2 ${className || ''}`}
      >
        <Icon className="h-4 w-4" />
        {buttonText}
        {typeof badgeCount === 'number' && badgeCount > 0 && (
          <span className="bg-primary ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white">
            {badgeCount}
          </span>
        )}
      </Button>
      <SheetDrawer
        open={open}
        onOpenChange={setOpen}
        title={title}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        <div className="space-y-4">{children}</div>
      </SheetDrawer>
    </>
  )
}
