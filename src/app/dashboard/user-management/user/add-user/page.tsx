'use client'

import PasswordInput from '@/components/common/input/password-input'
import ContentLayout from '@/components/layout/content-layout'
import { SearchComboBox } from '@/components/template/modal/search-combobox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import useFetcher from '@/hooks/use-fetcher'
import { useSubmit } from '@/hooks/use-submit'
import {
  CreateUserPayload,
  createUserSchema
} from '@/schema/user-management/user-schema'
import { getAllRoles } from '@/service/user-management/role-service'
import { createUser } from '@/service/user-management/user-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import UserSkeletonLoading from '../skeleton-loading'

export default function AddUserPage() {
  const router = useRouter()

  const {
    data: rolesResp,
    isLoading: isRolesLoading,
    run: runRoles
  } = useFetcher(getAllRoles, {
    immediate: false
  })

  const form = useForm<CreateUserPayload>({
    resolver: zodResolver(createUserSchema) as Resolver<CreateUserPayload>,
    mode: 'onBlur',
    defaultValues: {
      username: '',
      name: '',
      email: '',
      role_id: '',
      password: '',
      confirm_password: '',
      status: true
    }
  })

  useEffect(() => {
    runRoles()
  }, [runRoles])

  const { onSubmit, isSubmitting } = useSubmit<CreateUserPayload, null>({
    mutation: createUser,
    form: form,
    uniqueErrors: [
      {
        field: 'username',
        triggers: ['username must be unique', 'username already exists'],
        message: 'Username is already used'
      },
      {
        field: 'email',
        triggers: ['email must be unique', 'email already exists'],
        message: 'Email is already used'
      }
    ],
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => toast.error(msg),
    successMessage: 'Successfully Added User',
    errorMessage: 'Failed To Add User',
    onSuccess: () => {
      router.push('/dashboard/user-management/user')
    }
  })

  if (!rolesResp && isRolesLoading) {
    return (
      <ContentLayout title="Add User">
        <UserSkeletonLoading />
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title="Add User">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="shadow-none">
            <CardContent className="flex flex-col space-y-6 w-full pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Username<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter username"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter name"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl className="w-full">
                        <SearchComboBox
                          value={field.value}
                          onChange={field.onChange}
                          options={
                            rolesResp?.map((role) => ({
                              value: role.id,
                              label: role.name
                            })) || []
                          }
                          placeholder="Select role"
                          isLoading={isRolesLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter password"
                          {...field}
                          autoComplete="new-password"
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
                      <FormLabel>
                        Confirm Password<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm password"
                          {...field}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span>{field.value ? 'Active' : 'Inactive'}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/dashboard/user-management/user')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? 'Adding...' : 'Add User'}
            </Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  )
}
