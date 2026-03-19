'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type FormTrailingActionProps = {
  onSubmit?: (
    e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => void
  isSubmitting?: boolean
  isFetching?: boolean
  isDirty?: boolean
  cancelHref: string
  cancelLabel?: string
  submitLabel?: string
}

export default function FormTrailingAction({
  onSubmit,
  isSubmitting = false,
  isFetching = false,
  isDirty = false,
  cancelHref,
  cancelLabel = 'Cancel',
  submitLabel = 'Add'
}: FormTrailingActionProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href={cancelHref}>
        <Button variant={'outline'}>{cancelLabel}</Button>
      </Link>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || isFetching || !isDirty}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  )
}
