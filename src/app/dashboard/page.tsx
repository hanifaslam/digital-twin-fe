'use client'

import AttendFaceDialog from './_components/attend-face-dialog'
import RegisterFaceDialog from './_components/register-face-dialog'
import ContentLayout from '@/components/layout/content-layout'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import { useFaceRecog } from '@/hooks/api/face-recog/use-face-recog'
import { handleApiError } from '@/lib/utils'
import { LecturerService } from '@/service/master/lecturer/lecturer-service'
import useAuthStore from '@/store/auth-store'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Components
import { AttendanceCard } from './_components/attendance-card'
import { AttendanceTable } from './_components/attendance-table'
import { RegistrationBanner } from './_components/registration-banner'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: faceStatus, isLoading: statusLoading, refetch } = useFaceRecog()

  const confirm = useConfirm()
  const [registerOpen, setRegisterOpen] = useState(false)
  const [clockInOpen, setClockInOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm'))
  const [showColon, setShowColon] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(format(now, 'HH:mm'))
      setShowColon(now.getSeconds() % 2 === 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const status = faceStatus?.data
  const isRegistered = statusLoading ? undefined : (status?.registered ?? false)

  const handleSuccess = () => {
    refetch()
  }

  const handleNotAvailable = async () => {
    const ok = await confirm({
      title: 'Confirm Not Available',
      description: 'Are you sure you won’t be available for today?',
      confirmText: 'Yes',
      cancelText: 'Cancel',
      confirmButtonClassName: 'bg-red-600 hover:bg-red-700 text-white'
    })

    if (ok) {
      try {
        await LecturerService.overrideStatus({ status: 'BUSY' })
        toast.success('Status updated to Not Available')
        handleSuccess()
      } catch (err: unknown) {
        toast.error(handleApiError(err, 'Failed to update status'))
      }
    }
  }

  return (
    <ContentLayout title="Dashboard">
      <div className="flex flex-col gap-5">
        <RegistrationBanner
          isRegistered={isRegistered}
          onRegisterClick={() => setRegisterOpen(true)}
        />

        <AttendanceCard
          name={user?.name ?? '-'}
          nip={user?.nip}
          status={faceStatus}
          isLoading={statusLoading}
          onClockIn={() => setClockInOpen(true)}
          onClockOut={handleNotAvailable}
          currentTime={currentTime}
          showColon={showColon}
        />

        <AttendanceTable status={status} isLoading={statusLoading} />
      </div>

      <RegisterFaceDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSuccess={handleSuccess}
      />
      <AttendFaceDialog
        open={clockInOpen}
        onOpenChange={setClockInOpen}
        onSuccess={handleSuccess}
      />
    </ContentLayout>
  )
}
