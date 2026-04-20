import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useFaceRecog } from '@/hooks/api/face-recog/use-face-recog'
import { cn, formatToday, getInitials } from '@/lib/utils'

interface AttendanceCardProps {
  name: string
  nip?: string
  status: ReturnType<typeof useFaceRecog>['data']
  isLoading: boolean
  onClockIn: () => void
  onClockOut: () => void
  currentTime: string
  showColon?: boolean
}

export function AttendanceCard({
  name,
  nip,
  status,
  isLoading,
  onClockIn,
  onClockOut,
  currentTime,
  showColon = true
}: AttendanceCardProps) {
  const faceStatus = status?.data
  const hasAttended = Boolean(faceStatus?.attended_at)
  const canVerify = faceStatus?.can_verify ?? false
  const canOverride = faceStatus?.can_override ?? false

  return (
    <div className="rounded-2xl bg-blue-600 p-4 sm:p-5 text-white shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-12 rounded-full bg-blue-500/50" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-blue-500/50" />
              <Skeleton className="h-3 w-20 bg-blue-500/50" />
            </div>
          </>
        ) : (
          <>
            <Avatar size="lg" className="ring-2 ring-blue-400">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base leading-tight">{name}</p>
              {nip && <p className="text-sm text-blue-200">NIP. {nip}</p>}
            </div>
          </>
        )}
      </div>

      <div className="rounded-xl bg-white p-3 sm:p-4 text-foreground">
        <p className="mb-4 text-sm font-semibold capitalize text-muted-foreground">
          {formatToday()}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-gray-50/60 p-3 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="rounded-lg border bg-gray-50/60 p-2 sm:p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-base text-muted-foreground">
                  Clock In
                </span>
                {hasAttended && (
                  <span className="text-sm font-medium text-gray-700">
                    {faceStatus?.attended_at}
                  </span>
                )}
                {!hasAttended && (
                  <span className="text-md font-medium text-gray-700 tabular-nums inline-flex items-center">
                    <span>{currentTime.split(':')[0]}</span>
                    <span
                      className={cn(
                        'transition-opacity duration-100 mx-0.5 translate-y-[-1px]',
                        showColon ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      :
                    </span>
                    <span>{currentTime.split(':')[1]}</span>
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className={cn(
                  'w-full text-sm font-semibold transition-all h-11',
                  hasAttended
                    ? 'bg-blue-200 text-blue-700 hover:bg-blue-200 cursor-default pointer-events-none'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
                disabled={!canVerify || hasAttended}
                onClick={onClockIn}
              >
                {hasAttended ? 'Clocked In' : 'Attend Now'}
              </Button>
            </div>

            <div className="rounded-lg border bg-gray-50/60 p-2 sm:p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-base text-muted-foreground">
                  {hasAttended ? 'Clock Out' : 'Not Available'}
                </span>
              </div>
              <Button
                size="sm"
                className={cn(
                  'w-full text-sm font-semibold transition-all h-11',
                  hasAttended && faceStatus?.status !== 'AVAILABLE'
                    ? 'bg-red-500 text-white hover:bg-red-500 cursor-default pointer-events-none'
                    : canOverride
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-200 text-blue-400 cursor-default pointer-events-none'
                )}
                disabled={
                  !canOverride ||
                  (hasAttended && faceStatus?.status !== 'AVAILABLE')
                }
                onClick={onClockOut}
              >
                Not Available
              </Button>
              {hasAttended && faceStatus?.status === 'AVAILABLE' && (
                <p className="mt-1.5 text-center text-sm font-medium text-[#4a7c59]">
                  Available
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
