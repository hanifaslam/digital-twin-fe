'use client'

import ChangePasswordDialog from '@/components/common/modal/change-pass'
import ContentLayout from '@/components/layout/content-layout'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LecturerService } from '@/service/master/lecturer/lecturer-service'
import { UserService } from '@/service/user-management/user-service'
import useAuthStore from '@/store/auth-store'
import { KeyIcon, ScanFace } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [isChangePassOpen, setIsChangePassOpen] = useState(false)
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const confirm = useConfirm()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)

      const ok = await confirm({
        title: 'Confirm Photo Change',
        description: 'Are you sure you want to change your profile picture?',
        confirmText: 'Yes, Change',
        cancelText: 'Cancel'
      })

      if (ok) {
        setProfilePic(url)
        // TODO: Hit backend API here
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const { data: lecturerData, mutate: mutateLecturer } = useSWR(
    user?.lecturer_id ? ['lecturer', user.lecturer_id] : null,
    () => LecturerService.detail(user!.lecturer_id!)
  )

  const lecturer = lecturerData?.data

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user?.email) setEmail(user.email)
    else if (lecturer?.email) setEmail(lecturer.email)

    if (lecturer?.phone_number) setPhone(lecturer.phone_number)
  }, [user, lecturer])

  const initialEmail = user?.email || lecturer?.email || ''
  const initialPhone = lecturer?.phone_number || ''
  const isChanged = email !== initialEmail || phone !== initialPhone

  const handleSave = async () => {
    if (!isChanged) return
    setIsSaving(true)
    try {
      if (email !== initialEmail && user?.id) {
        await UserService.update(user.id, { email })
      }

      if (phone !== initialPhone && user?.lecturer_id) {
        await LecturerService.update(user.lecturer_id, { phone_number: phone })
      }

      toast.success('Profile updated successfully')
      mutateLecturer()
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ContentLayout title="Profile">
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Left Card - Profile Summary */}
        <Card className="w-full md:w-[350px] h-fit">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div
              className="relative group cursor-pointer h-40 w-40 mb-4 rounded-xl shadow-sm overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Avatar className="h-full w-full rounded-xl">
                <AvatarImage src={profilePic || ''} className="object-cover" />
                <AvatarFallback className="bg-blue-600 text-white text-5xl rounded-xl font-medium">
                  {user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-sm font-medium transition-all">
                Change Photo
              </div>
            </div>

            <h2 className="text-xl font-bold mb-1">
              {user?.name || 'Unknown User'}
            </h2>
            {user?.nip && (
              <p className="text-sm text-muted-foreground mb-4">
                Employee ID: {user.nip}
              </p>
            )}

            <div className="flex gap-2 mb-6">
              {user?.role_name && (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-md">
                  {user.role_name}
                </span>
              )}
              {lecturerData ? (
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-md">
                  Active
                </span>
              ) : null}
            </div>

            <Button
              className="w-full mb-3 bg-zinc-700 hover:bg-zinc-800 text-white"
              onClick={() => setIsChangePassOpen(true)}
            >
              <KeyIcon className="w-4 h-4 mr-2" />
              Change Password
            </Button>

            <Button
              variant="outline"
              className="w-full bg-zinc-100 text-zinc-500 border-none hover:bg-zinc-200"
              disabled
            >
              <ScanFace className="w-4 h-4 mr-2" />
              Face Verified
            </Button>
          </CardContent>
        </Card>

        {/* Right Card - Profile Details */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  Employee ID
                </Label>
                <div className="md:col-span-3">
                  <Input
                    value={user?.nip || lecturer?.nip || '-'}
                    disabled
                    className="bg-zinc-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  Name
                </Label>
                <div className="md:col-span-3">
                  <Input
                    value={user?.name || lecturer?.name || '-'}
                    disabled
                    className="bg-zinc-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <div className="md:col-span-3">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </Label>
                <div className="md:col-span-3">
                  <Input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="bg-zinc-50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                disabled={!isChanged || isSaving}
                onClick={handleSave}
                className={`w-24 text-white ${!isChanged ? 'bg-primary/50' : 'bg-primary'}`}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChangePasswordDialog
        open={isChangePassOpen}
        onOpenChange={setIsChangePassOpen}
      />
    </ContentLayout>
  )
}
