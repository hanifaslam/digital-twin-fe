'use client'

import ContentLayout from '@/components/layout/content-layout'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import { useFaceRecog } from '@/hooks/api/face-recog/use-face-recog'
import { useLecturerDashboardSocket } from '@/hooks/api/socket/use-lecturer-status'
import { handleApiError } from '@/lib/utils'
import { LecturerService } from '@/service/master/lecturer/lecturer-service'
import useAuthStore from '@/store/auth-store'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import AttendFaceDialog from './_components/attend-face-dialog'
import RegisterFaceDialog from './_components/register-face-dialog'

import { AttendanceCard } from './_components/attendance-card'
import { AttendanceTable } from './_components/attendance-table'
import { RegistrationBanner } from './_components/registration-banner'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const isLecturer = user?.role_code === 'DSN'
  const {
    data: faceStatus,
    isLoading: statusLoading,
    refetch
  } = useFaceRecog({
    enabled: !!isLecturer
  })

  useLecturerDashboardSocket(user?.lecturer_id)

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
      {isLecturer ? (
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
      ) : (
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga labore
            dolorum aut illum nisi facere laborum, itaque voluptatem obcaecati
            repellat iste quos vel possimus quis tempore modi. Vero inventore,
            et ratione pariatur ut, assumenda vel id debitis eos dignissimos
            neque consectetur qui aliquid? Voluptates, maxime sapiente debitis
            iusto quaerat laboriosam nisi blanditiis esse ut dicta non similique
            ad explicabo cumque ipsam sint beatae excepturi culpa nam
            accusantium nemo? Neque, totam commodi laboriosam delectus molestias
            inventore enim? Tenetur minus eius explicabo. Esse ipsa nihil ipsam
            iste error pariatur, quibusdam et hic repellendus quis veritatis
            provident rem laboriosam voluptas! Rerum, minus voluptate.
          </p>
        </div>
      )}

      {isLecturer && (
        <>
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
        </>
      )}
    </ContentLayout>
  )
}
