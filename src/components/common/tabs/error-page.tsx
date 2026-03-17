'use client'

import { XCircleIcon } from '@/components/icons/x-circle-icon'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  message: string
}

export function ErrorPage({ message }: ErrorPageProps) {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background via-muted/20 to-background px-4 text-base">
      <div className="text-center p-8 bg-card rounded-xl shadow-lg max-w-2xl w-full border animate-in fade-in-0 duration-500">
        <div className="flex justify-center mb-6">
          <XCircleIcon className="size-16 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <p className="text-xs text-muted-foreground mb-8">
          Please try again later or contact the administrator if the problem
          persists.
        </p>
        <Button onClick={handleRetry}>Try Again</Button>
      </div>
    </div>
  )
}
