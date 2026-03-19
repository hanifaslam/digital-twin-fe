import PasswordInput from '@/components/common/input/password-input'
import { XCircleIcon } from '@/components/icons/x-circle-icon'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useSubmit } from '@/hooks/use-submit'
import {
  ChangeUserPasswordPayload,
  changeUserPasswordSchema
} from '@/schema/user-management/user-schema'
import { changeUserPassword } from '@/service/user-management/user-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

type Props = {
  userId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ChangeUserPasswordDialog({
  userId,
  open,
  onOpenChange
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = (v: boolean, temp?: boolean) => {
    if (!v && !temp) {
      resetForm()
    }

    if (isControlled) {
      onOpenChange?.(v)
    } else {
      setInternalOpen(v)
    }
  }

  const [error, setError] = useState<string | null>(null)
  const confirm = useConfirm()

  const form = useForm<ChangeUserPasswordPayload>({
    resolver: zodResolver(changeUserPasswordSchema) as Resolver<
      z.infer<typeof changeUserPasswordSchema>
    >,
    defaultValues: {
      new_password: '',
      confirm_password: ''
    },
    mode: 'onBlur'
  })

  const resetForm = useCallback(() => {
    setTimeout(() => {
      setError(null)
      form.reset()
    }, 100)
  }, [form])

  const newPasswordValue = useWatch({
    control: form.control,
    name: 'new_password'
  })
  useEffect(() => {
    const confirmPassword = form.getValues('confirm_password')
    if (confirmPassword) {
      form.trigger('confirm_password')
    }
  }, [newPasswordValue, form])

  const { onSubmit, isSubmitting } = useSubmit<
    z.infer<typeof changeUserPasswordSchema>,
    null
  >({
    mutation: (payload) =>
      changeUserPassword(userId, payload as ChangeUserPasswordPayload),
    form: form,
    autoReset: true,
    resetDelay: 100,
    successMessage: 'Successfully Changed Password',
    errorMessage: 'Failed To Change Password',
    onSuccess: () => {
      setDialogOpen(false)
    },
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => {
      toast.error(msg)
    }
  })

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="p-0 sm:max-w-[520px] [&>button:last-child]:hidden">
          <DialogHeader className="border-b-border flex border-b px-6 pt-6 pb-4">
            <DialogTitle className="text-start text-xl">
              Change User Password
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-3 hover:bg-transparent"
              >
                <XCircleIcon className="hover:text-primary" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="px-6">
            <Form {...form}>
              <form onSubmit={onSubmit} className="mt-4 space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          <span>New Password *</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Enter New Password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          <span>Confirm New Password *</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Confirm New Password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <DialogFooter className="border-t-border mt-2 flex border-t px-6 py-4">
            <div className="flex w-full justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={async () => {
                  setDialogOpen(false, true)
                  const ok = await confirm({
                    title: 'Change Password',
                    description:
                      "Are you sure you want to change this user's password?",
                    confirmText: 'Yes, Change',
                    cancelText: 'Cancel'
                  })

                  if (ok) {
                    onSubmit()
                  }

                  setDialogOpen(true, true)
                }}
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
