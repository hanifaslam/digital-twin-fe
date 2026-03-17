'use client'

import PasswordInput from '@/components/common/input/password-input'
import LoadingAuth from '@/components/loader/loading-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { useSubmit } from '@/hooks/use-submit'
import { LoginInput, createLoginSchema } from '@/schema/auth/login-schema'
import { login } from '@/service/auth/auth-service'
import useAuthStore from '@/store/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login: authLogin, isAuthenticated, hasHydrated } = useAuthStore()
  const isCheckingAuth = !hasHydrated

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, hasHydrated, router])

  const form = useForm<LoginInput>({
    resolver: zodResolver(createLoginSchema()),
    defaultValues: {
      login: '',
      password: '',
      remember_me: false
    }
  })

  const { onSubmit, isSubmitting } = useSubmit({
    mutation: login,
    form,
    successMessage: 'Successfully logged in',
    errorMessage: 'Failed to log in',
    notifySuccess: toast.success,
    notifyError: toast.error,
    onSuccess: (res) => {
      if (res.data) {
        authLogin(res.data)
      }
    }
  })

  if (isCheckingAuth) {
    return <LoadingAuth />
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <div className="w-24 h-24 flex items-center justify-center">
            <Image
              src="/logo.png"
              width={512}
              height={512}
              alt="Logo"
              className="w-full h-full object-contain dark:invert"
            />
          </div>
          <span className="text-xl font-semibold">Digital Twin</span>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        <span>Username</span>
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter username"
                          className="border border-gray-300 p-2"
                          autoComplete="off"
                          maxLength={100}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        <span>Password</span>
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter password"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remember_me"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          Remember Me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end mb-4">
                <Link
                  type="button"
                  className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                  href="/forgot-password"
                >
                  Forgot Password
                </Link>
              </div>

              <Button
                type="submit"
                variant="default"
                className="hover:bg-primary/90 border-primary/90 bg-primary w-full border p-2 text-white transition-colors"
                disabled={
                  isSubmitting || isCheckingAuth || !form.formState.isValid
                }
              >
                {isSubmitting && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border border-white border-t-transparent"></div>
                )}
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
