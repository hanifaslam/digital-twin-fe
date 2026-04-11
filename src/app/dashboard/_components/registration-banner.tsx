import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowRightIcon, CheckIcon, User } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

interface RegistrationBannerProps {
  isRegistered: boolean | undefined
  onRegisterClick: () => void
}

export function RegistrationBanner({
  isRegistered,
  onRegisterClick
}: RegistrationBannerProps) {
  if (isRegistered === undefined) {
    return (
      <div className="flex w-full items-center gap-5 rounded-lg border bg-gray-50/50 p-4">
        <Skeleton className="size-6 rounded-full" />
        <div className="flex w-full items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    )
  }
  if (isRegistered === false) {
    return (
      <Alert className="bg-red-50 border-red-200 text-red-600 items-center !gap-x-5">
        <User className="!size-6 !translate-y-0 text-red-600" />
        <div className="flex w-full items-center justify-between">
          <div>
            <AlertTitle className="!text-md">
              Face not registered yet
            </AlertTitle>
            <AlertDescription className="!text-xs text-red-500">
              Click here to register your face before attending.
            </AlertDescription>
          </div>
          <button
            onClick={onRegisterClick}
            className="flex items-center gap-1 text-md font-semibold text-red-600 hover:text-red-700 transition-colors whitespace-nowrap ml-4"
          >
            Register Now
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </Alert>
    )
  }

  return (
    <Alert className="bg-green-50 border-[#4a7c59]/50 text-[#4a7c59] items-center !gap-x-5">
      <User className="!size-6 !translate-y-0 text-[#4a7c59]" />
      <div className="flex w-full items-center justify-between">
        <div>
          <AlertTitle className="!text-md">Face registered</AlertTitle>
          <AlertDescription className="!text-xs text-[#4a7c59]">
            Face recognition is active. You can now attend using face scan
          </AlertDescription>
        </div>
        <div className="flex items-center gap-1.5 text-md font-semibold text-[#4a7c59] whitespace-nowrap ml-4">
          Registered
          <CheckIcon className="h-4 w-4 text-[#4a7c59]" />
        </div>
      </div>
    </Alert>
  )
}
